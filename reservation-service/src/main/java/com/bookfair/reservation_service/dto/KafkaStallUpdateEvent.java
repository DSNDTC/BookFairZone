package com.bookfair.reservation_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Event published to Kafka for the Stall Service
 * to update the reservation status of a stall.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KafkaStallUpdateEvent {
    private Long stallId;
    private Boolean isReserved;
}