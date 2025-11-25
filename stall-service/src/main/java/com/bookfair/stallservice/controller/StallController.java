package com.bookfair.stallservice.controller;

import com.bookfair.stallservice.dto.StallDto;
import com.bookfair.stallservice.dto.StallLocationUpdateRequest;
import com.bookfair.stallservice.service.StallService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/stalls")
public class StallController {

    private final StallService stallService;

    public StallController(StallService stallService) {
        this.stallService = stallService;
    }

    @PostMapping
    public ResponseEntity<StallDto> create(@Valid @RequestBody StallDto dto) {
        StallDto created = stallService.create(dto);
        return ResponseEntity.created(URI.create("/api/stalls/" + created.getId())).body(created);
    }

    @GetMapping
    public ResponseEntity<List<StallDto>> list() {
        return ResponseEntity.ok(stallService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StallDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(stallService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StallDto> update(@PathVariable Long id, @Valid @RequestBody StallDto dto) {
        return ResponseEntity.ok(stallService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        stallService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/locations")
    public ResponseEntity<List<StallDto>> updateLocations(@RequestBody @Valid List<@Valid StallLocationUpdateRequest> updates) {
        return ResponseEntity.ok(stallService.updateLocations(updates));
    }
}
