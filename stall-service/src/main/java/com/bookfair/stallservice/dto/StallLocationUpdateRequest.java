package com.bookfair.stallservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StallLocationUpdateRequest {

    @NotNull(message = "id is required")
    private Long id;

    @NotNull(message = "locationX is required")
    private Double locationX;

    @NotNull(message = "locationY is required")
    private Double locationY;
}

