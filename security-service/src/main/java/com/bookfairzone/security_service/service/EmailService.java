package com.bookfairzone.security_service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.base-url:http://localhost:8081}")
    private String baseUrl;

    public void sendVerificationEmail(String toEmail, String token) {
        String verificationUrl = baseUrl + "/auth/verify-email?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Verify Your Email - Reservation System");
        message.setText("Click the link to verify your email:\n" + verificationUrl +
                "\n\nThis link expires in 24 hours.");

        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
        String resetUrl = baseUrl + "/auth/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Password Reset Request - Book Fair Zone");
        message.setText("Click the link to reset your password:\n" + resetUrl +
                "\n\nThis link expires in 1 hour.\n\n" +
                "If you did not request a password reset, please ignore this email.");

        mailSender.send(message);
    }
}