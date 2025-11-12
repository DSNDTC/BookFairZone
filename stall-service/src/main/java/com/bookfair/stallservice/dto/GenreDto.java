package com.bookfair.stallservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GenreDto {
    private Long id;

    @NotBlank(message = "name is required")
    private String name;
}
