package com.bookfair.stallservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "stalls")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code; // e.g. A12, B03

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StallSize size;

    @Column(nullable = false)
    private Double price;

    @Column(name = "vendor_id", nullable = false)
    private Long vendorId;

    @Column(name = "is_reserved", nullable = false)
    private Boolean isReserved = false;

    @Column(name = "location_x")
    private Integer locationX;

    @Column(name = "location_y")
    private Integer locationY;
}
