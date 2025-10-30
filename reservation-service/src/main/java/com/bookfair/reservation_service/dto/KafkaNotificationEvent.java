package com.bookfair.reservation_service.dto;

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
public class KafkaNotificationEvent {
    private UUID userId;
    private String userEmail;
    private Long reservationId;
    private String stallCode;
}