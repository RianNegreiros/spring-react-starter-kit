package br.com.riannegreiros.backend.users.dto.request;

import jakarta.validation.constraints.NotEmpty;

public record ResetPasswordRequest(@NotEmpty(message = "Token is required") String code,
        @NotEmpty(message = "The new password is required") String newPassword) {

}
