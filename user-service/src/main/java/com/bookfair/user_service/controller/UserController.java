package com.bookfair.user_service.controller;

import com.bookfair.user_service.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookfair.user_service.model.dto.User;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    @Autowired
    UserRepo repo;

    @PostMapping("/addUser")
    public void addUser(@RequestBody User user) {
        repo.save(user);
    }
}