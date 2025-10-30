package com.bookfair.reservation_service.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReservationRequest {
    @NotNull(message = "Stall ID is required")
    private Long stallId;
}