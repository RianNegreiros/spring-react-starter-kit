package br.com.riannegreiros.backend.email.response;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EmailVerificationResponse(
        @NotBlank(message = "Token is required") String token,

        @NotBlank(message = "Last name is required") String lastName,

        @NotBlank(message = "First name is required") String firstName,

        @NotBlank(message = "Email is required") @Email(message = "Email should be valid") String email) {
}
