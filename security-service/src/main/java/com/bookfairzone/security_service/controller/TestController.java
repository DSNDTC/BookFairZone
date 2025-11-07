package com.bookfairzone.security_service.controller;

import com.bookfairzone.security_service.entity.User;
import com.bookfairzone.security_service.enums.Role;
import com.bookfairzone.security_service.repository.UserRepository;
import com.bookfairzone.security_service.security.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;



@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/create-user")
    public User createTestUser() {
        User user = User.builder()
                .email("test@example.com")
                .passwordHash("dummy")
                .role(Role.USER_ROLE)
                .build();
        return userRepository.save(user);
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/hash")
    public String testHash() {
        String raw = "password123";
        String hashed = passwordEncoder.encode(raw);
        boolean matches = passwordEncoder.matches(raw, hashed);
        return "Hashed: " + hashed + ", Matches: " + matches;
    }

    @GetMapping("/jwt")
    public Map<String, Object> testJwt() {
        User testUser = userRepository.findByEmail("test@example.com")
                .orElseThrow();

        String accessToken = jwtUtil.generateAccessToken(testUser);
        String refreshToken = jwtUtil.generateRefreshToken(testUser);

        Claims claims = jwtUtil.extractClaims(accessToken);

        return Map.of(
                "accessToken", accessToken,
                "refreshToken", refreshToken,
                "email", claims.getSubject(),
                "role", claims.get("role")
        );
    }

}