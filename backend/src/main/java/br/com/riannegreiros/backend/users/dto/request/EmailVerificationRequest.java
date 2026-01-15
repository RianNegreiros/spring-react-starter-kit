package br.com.riannegreiros.backend.users.dto.request;

import org.hibernate.validator.constraints.Length;

import jakarta.validation.constraints.NotEmpty;

public record EmailVerificationRequest(
        @NotEmpty(message = "Email is required") String email,
        @NotEmpty(message = "Verification code is required") @Length(min = 6) String code) {
}
