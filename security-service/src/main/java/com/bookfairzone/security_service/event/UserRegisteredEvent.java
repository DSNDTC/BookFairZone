package com.bookfairzone.security_service.event;

import com.bookfairzone.security_service.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRegisteredEvent {
    private UUID userId;
    private String email;
    private Role role;
    private LocalDateTime registeredAt;

    // Additional fields that User Service might need
    private String eventId; // Unique event ID for idempotency
    private String eventType; // e.g., "USER_REGISTERED"
}