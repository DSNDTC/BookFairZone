package com.bookfair.stallservice.repository;

import com.bookfair.stallservice.model.Stall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StallRepository extends JpaRepository<Stall, Long> {
    Optional<Stall> findByCode(String code);
}
