
package com.bookfairzone.security_service.service;


import com.bookfairzone.security_service.dto.*;
import com.bookfairzone.security_service.entity.BlacklistedToken;
import com.bookfairzone.security_service.entity.PasswordResetToken;
import com.bookfairzone.security_service.entity.User;
import com.bookfairzone.security_service.entity.VerificationToken;
import com.bookfairzone.security_service.enums.AccountStatus;
import com.bookfairzone.security_service.event.UserRegisteredEvent;
import com.bookfairzone.security_service.repository.BlacklistedTokenRepository;
import com.bookfairzone.security_service.repository.PasswordResetTokenRepository;
import com.bookfairzone.security_service.repository.UserRepository;
import com.bookfairzone.security_service.repository.VerificationTokenRepository;
import com.bookfairzone.security_service.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    @Autowired
    private final UserEventPublisher userEventPublisher; // NEW

    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final BlacklistedTokenRepository blacklistedTokenRepository;


    @Transactional
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

        // Publish event to Kafka for User Service with all user details
        publishUserRegisteredEvent(savedUser, request);

        return RegisterResponse.builder()
                .userId(savedUser.getUserId())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .message("Registration successful. Check your email for verification link.")
                .build();
    }

    private void publishUserRegisteredEvent(User user, RegisterRequest request) {
        UserRegisteredEvent event = UserRegisteredEvent.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .role(user.getRole())
                .registeredAt(user.getCreatedAt())
                .name(request.getName())
                .businessName(request.getBusinessName())
                .phoneNumber(request.getPhoneNumber())
                .eventId(UUID.randomUUID().toString())
                .eventType("USER_REGISTERED")
                .build();

        userEventPublisher.publishUserRegisteredEvent(event);
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


    public LoginResponse refreshAccessToken(String refreshToken) {
        if (!jwtUtil.isTokenValid(refreshToken)) {
            throw new RuntimeException("Invalid or expired refresh token");
        }

        // Check if token is blacklisted
        if (isTokenBlacklisted(refreshToken)) {
            throw new RuntimeException("Token has been revoked");
        }

        String email = jwtUtil.extractEmail(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new RuntimeException("Account is not active");
        }

        String newAccessToken = jwtUtil.generateAccessToken(user);

        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken) // Keep same refresh token
                .tokenType("Bearer")
                .expiresIn(900)
                .mfaRequired(false)
                .build();
    }


    @Transactional
    public String logout(String token) {
        if (token == null || token.isEmpty()) {
            throw new RuntimeException("Token is required");
        }

        if (!jwtUtil.isTokenValid(token)) {
            throw new RuntimeException("Invalid token");
        }

        // Add token to blacklist
        LocalDateTime expiryDate = LocalDateTime.now().plusDays(7); // Match refresh token expiry

        BlacklistedToken blacklistedToken = BlacklistedToken.builder()
                .token(token)
                .expiryDate(expiryDate)
                .build();

        blacklistedTokenRepository.save(blacklistedToken);

        return "Logged out successfully";
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokenRepository.findByToken(token).isPresent();
    }




    @Transactional
    public String forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new RuntimeException("Account is not active");
        }

        // Generate reset token
        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(1)) // 1 hour expiry
                .used(false)
                .build();

        passwordResetTokenRepository.save(resetToken);

        // Send reset email
        emailService.sendPasswordResetEmail(user.getEmail(), token);

        return "Password reset link sent to your email";
    }

    @Transactional
    public String resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token expired");
        }

        if (resetToken.getUsed()) {
            throw new RuntimeException("Reset token already used");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Mark token as used
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        return "Password reset successfully";
    }


}