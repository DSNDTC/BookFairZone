package com.bookfair.stall_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.bookfair")
@EnableJpaRepositories(basePackages = "com.bookfair.stallservice.repository")
@EntityScan(basePackages = "com.bookfair.stallservice.model")
public class StallServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(StallServiceApplication.class, args);
	}

}
