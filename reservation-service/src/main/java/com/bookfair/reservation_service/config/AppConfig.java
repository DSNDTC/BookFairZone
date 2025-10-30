package com.bookfair.reservation_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    /**
     * Bean for making REST calls to other services (e.g., stall-service).
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}