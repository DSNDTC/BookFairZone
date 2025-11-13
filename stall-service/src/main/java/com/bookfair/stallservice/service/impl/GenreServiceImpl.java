package com.bookfair.stallservice.service.impl;

import com.bookfair.stallservice.dto.GenreDto;
import com.bookfair.stallservice.exception.ResourceNotFoundException;
import com.bookfair.stallservice.model.Genre;
import com.bookfair.stallservice.model.Stall;
import com.bookfair.stallservice.repository.GenreRepository;
import com.bookfair.stallservice.repository.StallRepository;
import com.bookfair.stallservice.service.GenreService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class GenreServiceImpl implements GenreService {

    private final GenreRepository genreRepository;
    private final StallRepository stallRepository;

    public GenreServiceImpl(GenreRepository genreRepository, StallRepository stallRepository) {
        this.genreRepository = genreRepository;
        this.stallRepository = stallRepository;
    }

    @Override
    public List<GenreDto> addGenres(Long stallId, List<GenreDto> genres) {
        Stall stall = stallRepository.findById(stallId)
                .orElseThrow(() -> new ResourceNotFoundException("Stall not found with id: " + stallId));

        List<Genre> entities = genres.stream().map(dto -> {
            Genre g = new Genre();
            g.setName(dto.getName());
            g.setStall(stall);
            return g;
        }).collect(Collectors.toList());

        List<Genre> saved = genreRepository.saveAll(entities);
        return saved.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<GenreDto> getByStall(Long stallId) {
        if (!stallRepository.existsById(stallId)) {
            throw new ResourceNotFoundException("Stall not found with id: " + stallId);
        }
        return genreRepository.findByStallId(stallId).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<GenreDto> updateByStall(Long stallId, List<GenreDto> genres) {
        Stall stall = stallRepository.findById(stallId)
                .orElseThrow(() -> new ResourceNotFoundException("Stall not found with id: " + stallId));

        // delete existing genres for stall
        genreRepository.deleteByStallId(stallId);

        // add new ones
        List<Genre> entities = genres.stream().map(dto -> {
            Genre g = new Genre();
            g.setName(dto.getName());
            g.setStall(stall);
            return g;
        }).collect(Collectors.toList());

        List<Genre> saved = genreRepository.saveAll(entities);
        return saved.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public void deleteByStall(Long stallId) {
        if (!stallRepository.existsById(stallId)) {
            throw new ResourceNotFoundException("Stall not found with id: " + stallId);
        }
        genreRepository.deleteByStallId(stallId);
    }

    @Override
    public void deleteById(Long stallId, Long genreId) {
        Genre genre = genreRepository.findById(genreId)
                .orElseThrow(() -> new ResourceNotFoundException("Genre not found with id: " + genreId));

        Stall stall = genre.getStall();
        if (stall == null || !stall.getId().equals(stallId)) {
            throw new ResourceNotFoundException("Genre with id: " + genreId + " does not belong to stall id: " + stallId);
        }

        genreRepository.delete(genre);
    }

    private GenreDto toDto(Genre g) {
        return GenreDto.builder().id(g.getId()).name(g.getName()).build();
    }
}
