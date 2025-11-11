package com.bookfair.user_service.Repo;

import com.bookfair.user_service.model.dto.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface UserRepo extends JpaRepository <User, Long> {
}
