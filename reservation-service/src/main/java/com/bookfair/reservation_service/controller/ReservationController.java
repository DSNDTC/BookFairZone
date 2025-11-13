package com.bookfair.reservation_service.controller;

import com.bookfair.bookfair_contracts.dto.KafkaReservationEvent;
import com.bookfair.reservation_service.dto.ReservationRequest;
import com.bookfair.reservation_service.dto.ReservationResponse;
import com.bookfair.reservation_service.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.bookfair.reservation_service.producer.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;
    private final NotificationEventProducer notificationEventProducer;

    public ReservationController(ReservationService reservationService, NotificationEventProducer notificationEventProducer) {
        this.reservationService = reservationService;
        this.notificationEventProducer = notificationEventProducer;
    }

    /**
     * Endpoint for a Vendor (USER_ROLE) to create a reservation request.
     */
    @PostMapping
    @PreAuthorize("hasAuthority('USER_ROLE')")
    public ResponseEntity<ReservationResponse> createReservation(
            @Valid @RequestBody ReservationRequest request,
            Authentication authentication) {
        ReservationResponse response = reservationService.createReservation(request, authentication);
        KafkaReservationEvent event = new KafkaReservationEvent(
                response.getUserId(),
                response.getUserEmail(),
                response.getId(),
                response.getStallId(),
                "Your reservation has been created.",
                "CREATED"
        );
        notificationEventProducer.sendReservationEvent(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Endpoint for an Employee (ADMIN_ROLE) to confirm a reservation.
     */
    @PostMapping("/{id}/confirm")
    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    public ResponseEntity<ReservationResponse> confirmReservation(@PathVariable("id") Long reservationId) {
        ReservationResponse response = reservationService.confirmReservation(reservationId);
        KafkaReservationEvent event = new KafkaReservationEvent(
                response.getUserId(),
                response.getUserEmail(),
                response.getId(),
                response.getStallId(),
                "Your reservation has been confirmed.",
                "CONFIRMED"
        );
        notificationEventProducer.sendReservationEvent(event);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint for an Employee (ADMIN_ROLE) to reject a reservation.
     */
    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    public ResponseEntity<ReservationResponse> rejectReservation(@PathVariable("id") Long reservationId) {
        ReservationResponse response = reservationService.rejectReservation(reservationId);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint for a Vendor (USER_ROLE) to see their own reservations.
     */
    @GetMapping("/my-reservations")
    @PreAuthorize("hasAuthority('USER_ROLE')")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(Authentication authentication) {
        return ResponseEntity.ok(reservationService.getMyReservations(authentication));
    }

    /**
     * Endpoint for an Employee (ADMIN_ROLE) to see all reservations.
     */
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    /**
     * Endpoint for an Employee (ADMIN_ROLE) to get reservations for a specific user.
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    public ResponseEntity<List<ReservationResponse>> getReservationsByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(reservationService.getReservationsByUserId(userId));
    }
}