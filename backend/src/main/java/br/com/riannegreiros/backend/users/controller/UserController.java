package br.com.riannegreiros.backend.users.controller;

import org.springframework.web.bind.annotation.RestController;

import br.com.riannegreiros.backend.users.dto.request.UserUpdateRequest;
import br.com.riannegreiros.backend.users.dto.response.UserResponse;
import br.com.riannegreiros.backend.users.service.UserService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @Valid @RequestBody UserUpdateRequest request) {

        UserResponse response = userService.updateUser(request);
        return ResponseEntity.ok(response);
    }
}
