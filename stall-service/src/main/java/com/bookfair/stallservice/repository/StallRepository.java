package com.bookfair.stallservice.repository;

import com.bookfair.stallservice.model.Stall;
import com.bookfair.stallservice.model.StallSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface StallRepository extends JpaRepository<Stall, Long> {
    Optional<Stall> findByCode(String code);

    // Get stalls by size (SMALL, MEDIUM, LARGE)
    List<Stall> findBySize(StallSize size);

    // Get stalls by reservation status (true = reserved, false = available)
    List<Stall> findByIsReserved(Boolean isReserved);

    // Update reservation status for a stall by id. Returns number of rows updated.
    @Transactional
    @Modifying
    @Query("UPDATE Stall s SET s.isReserved = :isReserved WHERE s.id = :id")
    int updateIsReservedById(@Param("id") Long id, @Param("isReserved") Boolean isReserved);
}
