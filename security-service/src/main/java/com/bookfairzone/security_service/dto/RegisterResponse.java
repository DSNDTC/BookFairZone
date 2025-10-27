package com.bookfairzone.security_service.dto;

import com.bookfairzone.security_service.enums.Role;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class RegisterResponse {
    private UUID userId;
    private String email;
    private Role role;
    private String message;
}