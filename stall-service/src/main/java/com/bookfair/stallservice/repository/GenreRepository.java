package com.bookfair.stallservice.repository;

import com.bookfair.stallservice.model.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {
    List<Genre> findByStallId(Long stallId);
    void deleteByStallId(Long stallId);
}
