package com.bookfair.user_service.event;

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
    private String role;
    private LocalDateTime registeredAt;

    // User details
    private String name;
    private String businessName;
    private String phoneNumber;

    // Event metadata
    private String eventId;
    private String eventType;
}