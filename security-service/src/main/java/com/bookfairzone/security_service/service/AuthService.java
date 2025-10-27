
package com.bookfairzone.security_service.service;


import com.bookfairzone.security_service.dto.RegisterRequest;
import com.bookfairzone.security_service.dto.RegisterResponse;
import com.bookfairzone.security_service.entity.User;
import com.bookfairzone.security_service.enums.AccountStatus;
import com.bookfairzone.security_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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

        return RegisterResponse.builder()
                .userId(savedUser.getUserId())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .message("User registered. Email verification pending.")
                .build();
    }
}