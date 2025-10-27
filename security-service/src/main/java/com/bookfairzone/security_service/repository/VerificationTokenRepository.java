package com.bookfairzone.security_service.repository;

import com.bookfairzone.security_service.entity.User;
import com.bookfairzone.security_service.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, UUID> {
    Optional<VerificationToken> findByToken(String token);
    Optional<VerificationToken> findByUser(User user);
    void deleteByExpiryDateBefore(LocalDateTime date);
}