package br.com.riannegreiros.backend.users.dto.request;

import jakarta.validation.constraints.NotEmpty;

public record ResendVerificationCodeRequest(
    @NotEmpty(message = "Email is required") String email) {
}
