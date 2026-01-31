package br.com.riannegreiros.backend.users.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public record ForgotPasswordRequest(
        @NotEmpty(message = "Email is required") @Email(message = "Invalid email format") String email) {
}
