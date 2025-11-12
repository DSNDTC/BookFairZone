package com.bookfair.user_service.repository;

import com.bookfair.user_service.model.dto.Stall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StallRepository extends JpaRepository<Stall, Long> {
    // Basic CRUD operations (save, findAll, findById, deleteById) are inherited
}