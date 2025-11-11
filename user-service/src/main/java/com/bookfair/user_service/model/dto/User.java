package com.bookfair.user_service.model.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    private Long id;
    private String name;
//    private String email;
//    private String fullName;
//    private String role;

    // Constructor, getters, setters
}