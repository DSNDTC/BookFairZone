package com.bookfair.stallservice.service;

import com.bookfair.stallservice.dto.StallDto;

import java.util.List;

public interface StallService {
    StallDto create(StallDto dto);
    StallDto getById(Long id);
    List<StallDto> getAll();
    StallDto update(Long id, StallDto dto);
    void delete(Long id);
}
