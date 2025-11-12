package com.bookfair.user_service.controller;

import com.bookfair.user_service.model.dto.Stall;
import com.bookfair.user_service.service.StallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/stalls")
public class StallController {

    private final StallService stallService;

    @Autowired
    public StallController(StallService stallService) {
        this.stallService = stallService;
    }

    // 1. Add (Create) Stall: POST /api/stalls
    @PostMapping
    public ResponseEntity<Stall> addStall(@RequestBody Stall stall) {
        Stall newStall = stallService.addStall(stall);
        return new ResponseEntity<>(newStall, HttpStatus.CREATED);
    }

    // 2. Get All Stalls: GET /api/stalls
    @GetMapping
    public ResponseEntity<List<Stall>> getAllStalls() {
        List<Stall> stalls = stallService.getAllStalls();
        return new ResponseEntity<>(stalls, HttpStatus.OK);
    }

    // 3. Get Stall by ID: GET /api/stalls/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Stall> getStallById(@PathVariable Long id) {
        Optional<Stall> stall = stallService.getStallById(id);
        return stall.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // 4. Update Stall: PUT /api/stalls/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Stall> updateStall(@PathVariable Long id, @RequestBody Stall stallDetails) {
        Stall updatedStall = stallService.updateStall(id, stallDetails);
        if (updatedStall != null) {
            return new ResponseEntity<>(updatedStall, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // 5. Delete Stall: DELETE /api/stalls/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStall(@PathVariable Long id) {
        boolean deleted = stallService.deleteStall(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Success, no content to return
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}