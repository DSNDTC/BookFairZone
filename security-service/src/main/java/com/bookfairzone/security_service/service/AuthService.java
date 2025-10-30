
package com.bookfairzone.security_service.service;


import com.bookfairzone.security_service.dto.LoginRequest;
import com.bookfairzone.security_service.dto.LoginResponse;
import com.bookfairzone.security_service.dto.RegisterRequest;
import com.bookfairzone.security_service.dto.RegisterResponse;
import com.bookfairzone.security_service.entity.User;
import com.bookfairzone.security_service.entity.VerificationToken;
import com.bookfairzone.security_service.enums.AccountStatus;
import com.bookfairzone.security_service.repository.UserRepository;
import com.bookfairzone.security_service.repository.VerificationTokenRepository;
import com.bookfairzone.security_service.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private final VerificationTokenRepository tokenRepository;
    @Autowired
    private final EmailService emailService;
    @Autowired
    private final JwtUtil jwtUtil;


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


    public LoginResponse login(LoginRequest request) {
        // Find user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            incrementFailedAttempts(user);
            throw new RuntimeException("Invalid credentials");
        }

        // Check account status
        if (user.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new RuntimeException("Account not verified or is suspended");
        }

        // Reset failed attempts
        resetFailedAttempts(user);

        // Check MFA
        if (user.getMfaEnabled()) {
            return LoginResponse.builder()
                    .mfaRequired(true)
                    .build();
        }

        // Generate tokens
        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(900) // 15 minutes in seconds
                .mfaRequired(false)
                .build();
    }

    private void incrementFailedAttempts(User user) {
        user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
        user.setLastFailedLogin(LocalDateTime.now());

        if (user.getFailedLoginAttempts() >= 5) {
            user.setAccountStatus(AccountStatus.LOCKED);
        }

        userRepository.save(user);
    }

    private void resetFailedAttempts(User user) {
        user.setFailedLoginAttempts(0);
        user.setLastFailedLogin(null);
        userRepository.save(user);
    }

}