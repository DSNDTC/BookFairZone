package com.bookfair.email_service.kafka;
import org.slf4j.Logger;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.bookfair.bookfair_contracts.dto.KafkaReservationEvent;

@Service
public class KafkaEmailConsumer {

    private static final Logger LOGGER = org.slf4j.LoggerFactory.getLogger(KafkaEmailConsumer.class);

    @KafkaListener(topics = "${app.kafka.topic.notification}", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeOrder(KafkaReservationEvent kafkaNotificationEvent) {
        LOGGER.info(String.format("Kafka Notification Event received in email service => %s", kafkaNotificationEvent.toString()));

        // save order event data to the database
    }
}
    