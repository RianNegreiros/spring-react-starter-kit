package br.com.riannegreiros.backend.email.request;

import org.hibernate.validator.constraints.Length;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public record EmailVerificationRequest(
        @NotEmpty(message = "Email is required") @Email(message = "Invalid email format") String email,
        @NotEmpty(message = "Verification code is required") @Length(min = 6) String code) {
}
