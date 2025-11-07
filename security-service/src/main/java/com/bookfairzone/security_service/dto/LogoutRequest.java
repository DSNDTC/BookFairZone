package com.bookfairzone.security_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LogoutRequest {
    private String token;
}