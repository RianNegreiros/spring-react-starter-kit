package br.com.riannegreiros.backend.users.dto.request;

import jakarta.validation.constraints.NotEmpty;

public record ValidateResetCodeRequest(
    @NotEmpty(message = "Reset code is required") String code) {
}
