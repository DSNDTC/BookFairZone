package com.bookfair.reservation_service.repository;

import com.bookfair.reservation_service.model.Reservation;
import com.bookfair.reservation_service.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    long countByUserIdAndStatus(UUID userId, ReservationStatus status);

    List<Reservation> findByUserId(UUID userId);

    List<Reservation> findByStallIdAndStatus(Long stallId, ReservationStatus status);
}