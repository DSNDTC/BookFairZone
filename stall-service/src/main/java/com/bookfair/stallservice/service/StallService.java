package com.bookfair.stallservice.service;

import com.bookfair.stallservice.dto.StallDto;
import com.bookfair.stallservice.dto.StallLocationUpdateRequest;

import java.util.List;

public interface StallService {
    StallDto create(StallDto dto);
    StallDto getById(Long id);
    List<StallDto> getAll();
    StallDto update(Long id, StallDto dto);
    void delete(Long id);
    List<StallDto> updateLocations(List<StallLocationUpdateRequest> updates);
}
