package com.bookfair.reservation_service.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    @Value("${app.kafka.topic.notification}")
    private String notificationTopic;

    @Value("${app.kafka.topic.stall-update}")
    private String stallUpdateTopic;

    /**
     * Topic for the notification-service to consume
     */
    @Bean
    public NewTopic notificationTopic() {
        return TopicBuilder.name(notificationTopic)
                .partitions(1)
                .replicas(1)
                .build();
    }

    /**
     * Topic for the stall-service to consume
     */
    @Bean
    public NewTopic stallUpdateTopic() {
        return TopicBuilder.name(stallUpdateTopic)
                .partitions(1)
                .replicas(1)
                .build();
    }
}