package com.bookfair.stallservice.controller;

import com.bookfair.stallservice.dto.StallDto;
import com.bookfair.stallservice.dto.StallLocationUpdateRequest;
import com.bookfair.stallservice.service.StallService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stalls")
@Slf4j
public class StallController {

    private final StallService stallService;

    public StallController(StallService stallService) {
        this.stallService = stallService;
    }

    @PostMapping
    public ResponseEntity<StallDto> createStall(@RequestBody StallDto stallDto) {
        log.info("REST request to create Stall: {}", stallDto); 
        StallDto created = stallService.createStall(stallDto);
        log.info("Successfully created Stall with ID: {}", created.getId()); 
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<StallDto>> list() {
        log.debug("REST request to list all Stalls"); 
        return ResponseEntity.ok(stallService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StallDto> get(@PathVariable Long id) {
        log.debug("REST request to get Stall : {}", id);
        return ResponseEntity.ok(stallService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StallDto> update(@PathVariable Long id, @Valid @RequestBody StallDto dto) {
        log.info("REST request to update Stall ID: {}", id);
        return ResponseEntity.ok(stallService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("REST request to delete Stall ID: {}", id);
        stallService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/locations")
    public ResponseEntity<List<StallDto>> updateLocations(
            @RequestBody @Valid List<@Valid StallLocationUpdateRequest> updates) {
        log.info("REST request to update locations for {} stalls", updates.size());
        return ResponseEntity.ok(stallService.updateLocations(updates));
    }
}