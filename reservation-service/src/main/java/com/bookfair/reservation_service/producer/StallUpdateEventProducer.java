package com.bookfair.reservation_service.producer;

import com.bookfair.reservation_service.dto.KafkaStallUpdateEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

/**
 * Publishes events for the stall-service to mark a stall as reserved.
 */
@Service
public class StallUpdateEventProducer {

    private static final Logger log = LoggerFactory.getLogger(StallUpdateEventProducer.class);

    @Value("${app.kafka.topic.stall-update}")
    private String topic;

    private final KafkaTemplate<String, KafkaStallUpdateEvent> kafkaTemplate;

    public StallUpdateEventProducer(KafkaTemplate<String, KafkaStallUpdateEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendStallUpdateEvent(KafkaStallUpdateEvent event) {
        try {
            log.info("Publishing stall update event to topic {}: {}", topic, event);
            kafkaTemplate.send(topic, event.getStallId().toString(), event);
        } catch (Exception e) {
            log.error("Failed to send stall update event for stall {}: {}", event.getStallId(), e.getMessage());
        }
    }
}