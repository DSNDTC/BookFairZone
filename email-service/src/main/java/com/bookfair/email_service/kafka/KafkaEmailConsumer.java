package com.bookfair.email_service.kafka;

import com.bookfair.bookfair_contracts.dto.KafkaReservationEvent;
import com.bookfair.email_service.service.SendEmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;


@Service
public class KafkaEmailConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(KafkaEmailConsumer.class);

    @Autowired
    private SendEmailService sendEmailService;

    @KafkaListener(topics = "${app.kafka.topic.notification}", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeOrder(KafkaReservationEvent event) {
        
        LOGGER.info(String.format("Kafka Notification Event received in email service => %s", event.toString()));

        // 1. Prepare and send email content based on the event

        try {
            // 2. Extract details from the event DTO
            String toEmail = event.getUserEmail();
            
            // Create a Subject based on the status (e.g., "Reservation CONFIRMED")
            String subject = "BookFair Reservation Update: " + event.getStatus();

            // Construct the Email Body
            String body = String.format(
                "Hello,\n\n%s\n\nReservation Details:\nID: %d\nStall ID: %d\nStatus: %s",
                event.getMessage(),      // The message from the event
                event.getReservationId(),
                event.getStallId(),
                event.getStatus()
            );

            // 3. Send the email if the address is valid
            if (toEmail != null && !toEmail.isEmpty()) {
                sendEmailService.sendEmail(toEmail, body, subject);
                LOGGER.info("Email successfully sent to: " + toEmail);
            } else {
                LOGGER.warn("Skipping email sending: No email address found in event.");
            }

        } catch (Exception e) {
            LOGGER.error("Error sending email for event: " + event.getReservationId(), e);
        }

    }
}
    
