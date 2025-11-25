package com.bookfair.notification_service.kafka;
import org.slf4j.Logger;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.bookfair.bookfair_contracts.dto.KafkaReservationEvent;

@Service
public class KafkaNotificationConsumer {

    private static final Logger LOGGER = org.slf4j.LoggerFactory.getLogger(KafkaNotificationConsumer.class);

    @KafkaListener(topics = "${app.kafka.topic.notification}", groupId = "${spring.kafka.consumer.group-id}")
    public void sendConfirmationNotifications(KafkaReservationEvent kafkaNotificationEvent) {
        LOGGER.info(String.format("Kafka Notification Event received in email service => %s",
                kafkaNotificationEvent.toString()));
        try {
            LOGGER.info("Sending confirmation email notification to: " + kafkaNotificationEvent.getUserEmail());
        } catch (Exception e) {
            LOGGER.error("Error while sending email notification: " + e.getMessage());
        }

    }
}
    