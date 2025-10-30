
package com.bookfairzone.security_service.service;


import com.bookfairzone.security_service.dto.RegisterRequest;
import com.bookfairzone.security_service.dto.RegisterResponse;
import com.bookfairzone.security_service.entity.User;
import com.bookfairzone.security_service.entity.VerificationToken;
import com.bookfairzone.security_service.enums.AccountStatus;
import com.bookfairzone.security_service.repository.UserRepository;
import com.bookfairzone.security_service.repository.VerificationTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final VerificationTokenRepository tokenRepository;
    private final EmailService emailService;


    public RegisterResponse register(RegisterRequest request) {
        // Validate email not exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create user
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .accountStatus(AccountStatus.UNVERIFIED)
                .mfaEnabled(false)
                .failedLoginAttempts(0)
                .build();


        User savedUser = userRepository.save(user);
        String token = generateVerificationToken(savedUser);
        emailService.sendVerificationEmail(savedUser.getEmail(), token);


        return RegisterResponse.builder()
                .userId(savedUser.getUserId())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .message("Registration successful. Check your email for verification link.")
                .build();
    }

    private String generateVerificationToken(User user) {
        String token = UUID.randomUUID().toString();

        VerificationToken verificationToken = VerificationToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(24))
                .build();

        tokenRepository.save(verificationToken);

        return token;
    }

    public String verifyEmail(String token) {
        VerificationToken verificationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        User user = verificationToken.getUser();
        user.setAccountStatus(AccountStatus.ACTIVE);
        userRepository.save(user);

        tokenRepository.delete(verificationToken);

        return "Email verified successfully";
    }

}