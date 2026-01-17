package br.com.riannegreiros.backend.email.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public record ResendVerificationCodeRequest(
        @NotEmpty(message = "Email is required") @Email(message = "Invalid email format") String email) {
}
