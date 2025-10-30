package com.bookfair.reservation_service.dto;

import lombok.Data;

@Data
public class StallDto {
    private Long id;
    private String code;
    private Boolean isReserved; 
}