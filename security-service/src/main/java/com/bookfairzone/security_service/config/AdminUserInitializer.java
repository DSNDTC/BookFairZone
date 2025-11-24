package com.bookfairzone.security_service.config;

import com.bookfairzone.security_service.entity.User;
import com.bookfairzone.security_service.enums.AccountStatus;
import com.bookfairzone.security_service.enums.Role;
import com.bookfairzone.security_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class AdminUserInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.default.email:admin@bookfair.com}")
    private String adminEmail;

    @Value("${admin.default.password:Admin@123}")
    private String adminPassword;

    @Value("${admin.auto-create:true}")
    private boolean autoCreateAdmin;

    @Bean
    public CommandLineRunner initializeAdminUser() {
        return args -> {
            if (!autoCreateAdmin) {
                log.info("Admin user auto-creation is disabled");
                return;
            }

            // Check if admin already exists
            if (userRepository.existsByEmail(adminEmail)) {
                log.info("Admin user already exists: {}", adminEmail);
                return;
            }

            // Create admin user
            User adminUser = User.builder()
                    .email(adminEmail)
                    .passwordHash(passwordEncoder.encode(adminPassword))
                    .role(Role.ADMIN_ROLE)
                    .accountStatus(AccountStatus.ACTIVE)
                    .mfaEnabled(false)
                    .failedLoginAttempts(0)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            userRepository.save(adminUser);

            log.info("====================================================");
            log.info("Default Admin User Created Successfully!");
            log.info("====================================================");
            log.info(" Email: {}", adminEmail);
            log.info(" Password: {}", adminPassword);
            log.info(" IMPORTANT: Change this password immediately!");
            log.info("====================================================");
        };
    }
}