package com.bookfair.reservation_service.service;

import com.bookfair.reservation_service.dto.ReservationRequest;
import com.bookfair.reservation_service.dto.ReservationResponse;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.UUID;

public interface ReservationService {

    /**
     * Creates a new reservation request (Status: PENDING).
     * Called by a Vendor (USER_ROLE).
     */
    ReservationResponse createReservation(ReservationRequest request, Authentication authentication);

    /**
     * Confirms a reservation (Status: CONFIRMED).
     * Publishes events to Kafka.
     * Called by an Employee (ADMIN_ROLE).
     */
    ReservationResponse confirmReservation(Long reservationId);

    /**
     * Rejects a reservation (Status: REJECTED).
     * Called by an Employee (ADMIN_ROLE).
     */
    ReservationResponse rejectReservation(Long reservationId);

    /**
     * Gets all reservations for the currently authenticated vendor.
     */
    List<ReservationResponse> getMyReservations(Authentication authentication);

    /**
     * Gets all reservations for a specific user.
     * Called by an Employee (ADMIN_ROLE).
     */
    List<ReservationResponse> getReservationsByUserId(UUID userId);

    /**
     * Gets all reservations in the system.
     * Called by an Employee (ADMIN_ROLE).
     */
    List<ReservationResponse> getAllReservations();
}