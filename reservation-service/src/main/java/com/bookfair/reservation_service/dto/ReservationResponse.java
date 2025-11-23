package com.bookfair.reservation_service.dto;

import com.bookfair.reservation_service.model.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse {
    private Long id;
    private Long stallId;
    private UUID userId;
    private String userEmail;
    private ReservationStatus status;
    private LocalDateTime createdAt;

    public static ReservationResponse fromEntity(com.bookfair.reservation_service.model.Reservation entity) {
        return ReservationResponse.builder()
                .id(entity.getId())
                .stallId(entity.getStallId())
                .userId(entity.getUserId())
                .userEmail(entity.getUserEmail())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}