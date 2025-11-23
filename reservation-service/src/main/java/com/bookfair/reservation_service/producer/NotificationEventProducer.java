package com.bookfair.reservation_service.producer;

import com.bookfair.bookfair_contracts.dto.KafkaReservationEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

/**
 * Publishes events for the notification-service.
 */
@Service
public class NotificationEventProducer {

    private static final Logger log = LoggerFactory.getLogger(NotificationEventProducer.class);

    @Value("${app.kafka.topic.notification}")
    private String topic;

    private final KafkaTemplate<String, KafkaReservationEvent> kafkaTemplate;

    public NotificationEventProducer(KafkaTemplate<String, KafkaReservationEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendReservationEvent(KafkaReservationEvent event) {
        try {
            log.info("Publishing reservation event to topic {}: {}", topic, event);
            kafkaTemplate.send(topic, event.getReservationId().toString(), event);
        } catch (Exception e) {
            log.error("Failed to send notification event for reservation {}: {}", event.getReservationId(), e.getMessage());
        }
    }
}