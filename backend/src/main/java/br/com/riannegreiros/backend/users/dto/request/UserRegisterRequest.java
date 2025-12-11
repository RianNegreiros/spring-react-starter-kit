package br.com.riannegreiros.backend.users.dto.request;

import jakarta.validation.constraints.NotEmpty;

public record UserRegisterRequest(
        @NotEmpty(message = "Email is required") String email,
        @NotEmpty(message = "First name is required") String firstName,
        @NotEmpty(message = "Last name is required") String lastName,
        @NotEmpty(message = "Password is required") String password) {
}
