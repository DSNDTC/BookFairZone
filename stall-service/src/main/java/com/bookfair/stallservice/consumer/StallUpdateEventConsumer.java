package com.bookfair.stallservice.consumer;

import com.bookfair.stallservice.service.StallService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Kafka consumer that listens for stall update events from the reservation service.
 * When a reservation is confirmed, this consumer updates the stall's reservation status.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StallUpdateEventConsumer {

    private final StallService stallService;

    @KafkaListener(topics = "${app.kafka.topic.stall-update}", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeStallUpdateEvent(Map<String, Object> event) {
        try {
            log.info("Received stall update event: {}", event);
            
            Long stallId = ((Number) event.get("stallId")).longValue();
            Boolean isReserved = (Boolean) event.get("isReserved");
            String message = (String) event.get("message");
            
            log.info("Processing stall update - stallId: {}, isReserved: {}, message: {}", 
                    stallId, isReserved, message);
            
            stallService.updateReservationStatus(stallId, isReserved);
            
            log.info("Successfully updated stall {} reservation status to {}", stallId, isReserved);
        } catch (Exception e) {
            log.error("Error processing stall update event: {}", e.getMessage(), e);
        }
    }
}
