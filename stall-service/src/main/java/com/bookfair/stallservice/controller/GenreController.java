package com.bookfair.stallservice.controller;

import com.bookfair.stallservice.dto.GenreDto;
import com.bookfair.stallservice.service.GenreService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/stalls/{stallId}/genres")
public class GenreController {

    private final GenreService genreService;

    public GenreController(GenreService genreService) {
        this.genreService = genreService;
    }

    @PostMapping
    public ResponseEntity<List<GenreDto>> addGenres(@PathVariable Long stallId, @Valid @RequestBody List<GenreDto> genres) {
        List<GenreDto> created = genreService.addGenres(stallId, genres);
        return ResponseEntity.created(URI.create("/api/stalls/" + stallId + "/genres")).body(created);
    }

    @GetMapping
    public ResponseEntity<List<GenreDto>> getByStall(@PathVariable Long stallId) {
        return ResponseEntity.ok(genreService.getByStall(stallId));
    }

    @PutMapping
    public ResponseEntity<List<GenreDto>> updateByStall(@PathVariable Long stallId, @Valid @RequestBody List<GenreDto> genres) {
        return ResponseEntity.ok(genreService.updateByStall(stallId, genres));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteByStall(@PathVariable Long stallId) {
        genreService.deleteByStall(stallId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{genreId}")
    public ResponseEntity<Void> deleteById(@PathVariable Long stallId, @PathVariable Long genreId) {
        genreService.deleteById(stallId, genreId);
        return ResponseEntity.noContent().build();
    }
}
