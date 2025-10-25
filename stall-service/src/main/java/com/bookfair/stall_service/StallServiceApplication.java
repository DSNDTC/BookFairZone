package com.bookfair.stall_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.bookfair")
public class StallServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(StallServiceApplication.class, args);
	}

}
