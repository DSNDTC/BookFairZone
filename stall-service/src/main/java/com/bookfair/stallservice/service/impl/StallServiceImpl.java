package com.bookfair.stallservice.service.impl;

import com.bookfair.stallservice.dto.StallDto;
import com.bookfair.stallservice.dto.StallLocationUpdateRequest;
import com.bookfair.stallservice.exception.ResourceNotFoundException;
import com.bookfair.stallservice.model.Stall;
import com.bookfair.stallservice.repository.StallRepository;
import com.bookfair.stallservice.service.StallService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class StallServiceImpl implements StallService {

    private final StallRepository repository;

    public StallServiceImpl(StallRepository repository) {
        this.repository = repository;
    }

    @Override
    public StallDto create(StallDto dto) {
        Stall entity = toEntity(dto);
        Stall saved = repository.save(entity);
        return toDto(saved);
    }

    @Override
    public StallDto getById(Long id) {
        Stall s = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Stall not found with id: " + id));
        return toDto(s);
    }

    @Override
    public List<StallDto> getAll() {
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public StallDto update(Long id, StallDto dto) {
        Stall existing = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Stall not found with id: " + id));
        // update fields
        existing.setCode(dto.getCode());
        existing.setSize(dto.getSize());
        existing.setPrice(dto.getPrice());
        existing.setIsReserved(dto.getIsReserved() != null ? dto.getIsReserved() : existing.getIsReserved());
        existing.setLocationX(dto.getLocationX());
        existing.setLocationY(dto.getLocationY());
        Stall saved = repository.save(existing);
        return toDto(saved);
    }

    @Override
    public void delete(Long id) {
        Stall existing = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Stall not found with id: " + id));
        repository.delete(existing);
    }

    @Override
    public List<StallDto> updateLocations(List<StallLocationUpdateRequest> updates) {
        if (updates == null || updates.isEmpty()) {
            return List.of();
        }

        return updates.stream()
                .map(update -> {
                    Stall stall = repository.findById(update.getId())
                            .orElseThrow(() -> new ResourceNotFoundException("Stall not found with id: " + update.getId()));
                    stall.setLocationX(update.getLocationX());
                    stall.setLocationY(update.getLocationY());
                    return repository.save(stall);
                })
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private StallDto toDto(Stall s) {
        return StallDto.builder()
                .id(s.getId())
                .code(s.getCode())
                .size(s.getSize())
                .price(s.getPrice())
                .isReserved(s.getIsReserved())
                .locationX(s.getLocationX())
                .locationY(s.getLocationY())
                .build();
    }

    private Stall toEntity(StallDto dto) {
        return Stall.builder()
                .id(dto.getId())
                .code(dto.getCode())
                .size(dto.getSize())
                .price(dto.getPrice())
                .isReserved(dto.getIsReserved() != null ? dto.getIsReserved() : false)
                .locationX(dto.getLocationX())
                .locationY(dto.getLocationY())
                .build();
    }

    @Override
    public void updateReservationStatus(Long stallId, Boolean isReserved) {
        Stall stall = repository.findById(stallId)
                .orElseThrow(() -> new ResourceNotFoundException("Stall not found with id: " + stallId));
        stall.setIsReserved(isReserved);
        repository.save(stall);
        log.info("Stall {} reservation status updated to: {}", stallId, isReserved);
    }
}
