package com.bookfair.user_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.HashMap;


@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public Map<String, String> checkHealth() {
        Map<String, String> response = new HashMap<>();
        // print message
        response.put("message", "User-Service is up and running.");
        // response.put("status", "UP");
        // response.put("service", "User-Service");
        // response.put("message", "Microservice is running correctly.");
        return response;
    }
}