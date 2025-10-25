package com.bookfair.stallservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<String> check() {
        return ResponseEntity.ok("Stall Service Running ✅");
    }
}
