package com.bookfairzone.security_service.service;

import com.bookfairzone.security_service.event.UserRegisteredEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserEventPublisher {

    private final KafkaTemplate<String, UserRegisteredEvent> kafkaTemplate;

    @Value("${spring.kafka.topic.user-registered:user.registered.events}")
    private String userRegisteredTopic;

    public void publishUserRegisteredEvent(UserRegisteredEvent event) {
        try {
            log.info("Publishing UserRegisteredEvent for userId: {}", event.getUserId());

            CompletableFuture<SendResult<String, UserRegisteredEvent>> future =
                    kafkaTemplate.send(userRegisteredTopic, event.getUserId().toString(), event);

            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("Successfully published event for userId: {} to partition: {}",
                            event.getUserId(),
                            result.getRecordMetadata().partition());
                } else {
                    log.error("Failed to publish event for userId: {}", event.getUserId(), ex);
                    // In production, you might want to:
                    // 1. Store failed events in a dead letter queue
                    // 2. Trigger alerts
                    // 3. Retry with exponential backoff
                }
            });
        } catch (Exception e) {
            log.error("Exception while publishing UserRegisteredEvent for userId: {}",
                    event.getUserId(), e);
            // Handle exception - could store in outbox table for retry
        }
    }
}