package com.bookfair.stallservice.dto;

import com.bookfair.stallservice.model.StallSize;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StallDto {
    private Long id;

    @NotBlank(message = "code is required")
    private String code;

    @NotNull(message = "size is required")
    private StallSize size;

    @NotNull(message = "price is required")
    @PositiveOrZero(message = "price must be zero or positive")
    private Double price;

    @NotNull(message = "vendorId is required")
    private Long vendorId;

    private Boolean isReserved = false;

    private Integer locationX;
    private Integer locationY;
}
