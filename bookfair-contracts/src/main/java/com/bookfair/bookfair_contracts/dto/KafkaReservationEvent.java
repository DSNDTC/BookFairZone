package com.bookfair.bookfair_contracts.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Event published to Kafka for the Notification Service
 * to consume.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KafkaReservationEvent {
    private UUID userId;
    private String userEmail;
    private Long reservationId;
    private String stallCode;
    private String message;
    private String status;
}