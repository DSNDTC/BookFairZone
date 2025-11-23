package com.bookfair.user_service.listener;

import com.bookfair.user_service.event.UserRegisteredEvent;
import com.bookfair.user_service.model.User;
import com.bookfair.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserEventListener {

    private final UserService userService;

    @KafkaListener(
            topics = "${spring.kafka.topic.user-registered:user.registered.events}",
            groupId = "${spring.kafka.consumer.group-id:user-service-group}",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleUserRegisteredEvent(
            @Payload UserRegisteredEvent event,
            @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset,
            Acknowledgment acknowledgment) {

        try {
            log.info("========================================");
            log.info("Received UserRegisteredEvent");
            log.info("Topic: {}, Partition: {}, Offset: {}", topic, partition, offset);
            log.info("EventId: {}", event.getEventId());
            log.info("UserId: {}", event.getUserId());
            log.info("Email: {}", event.getEmail());
            log.info("Role: {}", event.getRole());
            log.info("========================================");

            // Check if user already exists (idempotency)
            if (userService.userExistsByEmail(event.getEmail())) {
                log.warn("User with email {} already exists. Skipping creation (idempotent).", event.getEmail());
                acknowledgment.acknowledge();
                return;
            }

            // Create user from event
            User user = new User();
            user.setEmail(event.getEmail());
            user.setName(event.getEmail().split("@")[0]); // Default name from email
            // Note: We don't have password here, it's only in Security Service
            // Set other fields as needed or leave them null

            User createdUser = userService.createUser(user);

            log.info("✓ Successfully created user profile");
            log.info("  - User ID (user-service): {}", createdUser.getId());
            log.info("  - Email: {}", createdUser.getEmail());
            log.info("  - Security Service UserId: {}", event.getUserId());
            log.info("========================================");

            // Acknowledge the message after successful processing
            acknowledgment.acknowledge();

        } catch (Exception e) {
            log.error("========================================");
            log.error("✗ ERROR processing UserRegisteredEvent");
            log.error("EventId: {}", event.getEventId());
            log.error("UserId: {}", event.getUserId());
            log.error("Email: {}", event.getEmail());
            log.error("Error: {}", e.getMessage(), e);
            log.error("========================================");

            // Don't acknowledge - message will be retried
            // In production, consider:
            // 1. Exponential backoff
            // 2. Dead Letter Queue after max retries
            // 3. Alert monitoring systems

            // For now, throw exception to trigger retry
            throw new RuntimeException("Failed to process user registration event", e);
        }
    }
}