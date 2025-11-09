package com.bookfairzone.security_service.service;


import com.bookfairzone.security_service.repository.BlacklistedTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {
    private final BlacklistedTokenRepository blacklistedTokenRepository;

    public boolean isBlacklisted(String token) {
        return blacklistedTokenRepository.findByToken(token).isPresent();
    }
}