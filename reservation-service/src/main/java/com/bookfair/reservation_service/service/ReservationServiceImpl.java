package com.bookfair.reservation_service.service;

import com.bookfair.bookfair_contracts.dto.KafkaReservationEvent;
import com.bookfair.bookfair_contracts.dto.KafkaStallUpdateEvent;
import com.bookfair.reservation_service.dto.ReservationRequest;
import com.bookfair.reservation_service.dto.ReservationResponse;
import com.bookfair.reservation_service.dto.StallDto;
import com.bookfair.reservation_service.exception.ReservationException;
import com.bookfair.reservation_service.exception.ResourceNotFoundException;
import com.bookfair.reservation_service.model.Reservation;
import com.bookfair.reservation_service.model.ReservationStatus;
import com.bookfair.reservation_service.producer.NotificationEventProducer;
import com.bookfair.reservation_service.producer.StallUpdateEventProducer;
import com.bookfair.reservation_service.repository.ReservationRepository;
import com.bookfair.reservation_service.security.GatewayUserDetails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReservationServiceImpl implements ReservationService {

    private static final Logger log = LoggerFactory.getLogger(ReservationServiceImpl.class);
    private static final int MAX_RESERVATIONS = 3;

    private final ReservationRepository reservationRepository;
    private final RestTemplate restTemplate;
    private final NotificationEventProducer notificationEventProducer;
    private final StallUpdateEventProducer stallUpdateEventProducer;
    private final String stallServiceUrl;

    public ReservationServiceImpl(ReservationRepository reservationRepository,
                                  RestTemplate restTemplate,
                                  NotificationEventProducer notificationEventProducer,
                                  StallUpdateEventProducer stallUpdateEventProducer,
                                  @Value("${stall.service.url}") String stallServiceUrl) {
        this.reservationRepository = reservationRepository;
        this.restTemplate = restTemplate;
        this.notificationEventProducer = notificationEventProducer;
        this.stallUpdateEventProducer = stallUpdateEventProducer;
        this.stallServiceUrl = stallServiceUrl;
    }

    @Override
    public ReservationResponse createReservation(ReservationRequest request, Authentication authentication) {
        GatewayUserDetails userDetails = (GatewayUserDetails) authentication.getPrincipal();
        UUID userId = UUID.fromString(userDetails.getUserId());
        String email = userDetails.getEmail();

        long activeReservations = reservationRepository.countByUserIdAndStatus(userId, ReservationStatus.CONFIRMED);
        if (activeReservations >= MAX_RESERVATIONS) {
            throw new ReservationException("User has reached the maximum of " + MAX_RESERVATIONS + " reservations.");
        }

        StallDto stall = getStallDetails(request.getStallId());
        if (stall.getIsReserved()) {
            throw new ReservationException("Stall with ID " + request.getStallId() + " is already reserved.");
        }

        Reservation reservation = Reservation.builder()
                .stallId(request.getStallId())
                .userId(userId)
                .userEmail(email)
                .status(ReservationStatus.PENDING)
                .build();

        Reservation savedReservation = reservationRepository.save(reservation);
        log.info("Pending reservation created for user {} and stall {}", userId, request.getStallId());
        
        return ReservationResponse.fromEntity(savedReservation);
    }

    @Override
    public ReservationResponse confirmReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + reservationId));

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new ReservationException("Reservation is not in a PENDING state.");
        }

        reservation.setStatus(ReservationStatus.CONFIRMED);
        Reservation savedReservation = reservationRepository.save(reservation);
        log.info("Reservation {} confirmed.", reservationId);

        StallDto stall = getStallDetails(reservation.getStallId());

        KafkaStallUpdateEvent stallEvent = new KafkaStallUpdateEvent(reservation.getStallId(), true, "Stall reserved for reservation ID " + reservationId);
        stallUpdateEventProducer.sendStallUpdateEvent(stallEvent);

        KafkaReservationEvent notificationEvent = new KafkaReservationEvent(
                reservation.getUserId(),
                reservation.getUserEmail(),
                reservation.getId(),
                reservation.getStallId(),
                "Your reservation has been confirmed.",
                "CONFIRMED"
        );
        notificationEventProducer.sendReservationEvent(notificationEvent);

        return ReservationResponse.fromEntity(savedReservation);
    }

    @Override
    public ReservationResponse rejectReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + reservationId));

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new ReservationException("Reservation is not in a PENDING state.");
        }

        reservation.setStatus(ReservationStatus.REJECTED);
        Reservation savedReservation = reservationRepository.save(reservation);
        log.info("Reservation {} rejected.", reservationId);
        
        return ReservationResponse.fromEntity(savedReservation);
    }

    @Override
    public List<ReservationResponse> getMyReservations(Authentication authentication) {
        GatewayUserDetails userDetails = (GatewayUserDetails) authentication.getPrincipal();
        UUID userId = UUID.fromString(userDetails.getUserId());

        return reservationRepository.findByUserId(userId).stream()
                .map(ReservationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReservationResponse> getReservationsByUserId(UUID userId) {
        return reservationRepository.findByUserId(userId).stream()
                .map(ReservationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(ReservationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Helper method to call the stall-service.
     */
    private StallDto getStallDetails(Long stallId) {
        String url = stallServiceUrl + "/" + stallId;
        try {
            StallDto stall = restTemplate.getForObject(url, StallDto.class);
            if (stall == null) {
                throw new ResourceNotFoundException("Stall not found from stall-service with id: " + stallId);
            }
            return stall;
        } catch (HttpClientErrorException.NotFound e) {
            throw new ResourceNotFoundException("Stall not found from stall-service with id: " + stallId);
        } catch (Exception e) {
            log.error("Error calling stall-service at {}: {}", url, e.getMessage());
            throw new ReservationException("Unable to verify stall availability. Please try again later.");
        }
    }
}