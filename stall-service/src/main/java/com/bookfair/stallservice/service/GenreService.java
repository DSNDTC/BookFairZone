package com.bookfair.stallservice.service;

import com.bookfair.stallservice.dto.GenreDto;

import java.util.List;

public interface GenreService {
    List<GenreDto> addGenres(Long stallId, List<GenreDto> genres);
    List<GenreDto> getByStall(Long stallId);
    List<GenreDto> updateByStall(Long stallId, List<GenreDto> genres);
    void deleteByStall(Long stallId);
    void deleteById(Long stallId, Long genreId);
}
