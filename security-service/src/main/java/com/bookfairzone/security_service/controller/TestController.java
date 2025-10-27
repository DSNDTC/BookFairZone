package com.bookfairzone.security_service.controller;

import com.bookfairzone.security_service.entity.User;
import com.bookfairzone.security_service.enums.Role;
import com.bookfairzone.security_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;


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

}