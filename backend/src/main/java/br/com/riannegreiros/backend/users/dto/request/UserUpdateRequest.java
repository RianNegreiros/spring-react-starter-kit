package br.com.riannegreiros.backend.users.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserUpdateRequest(
        @NotBlank(message = "First name is required")
        String firstName,
        
        @NotBlank(message = "Last name is required")
        String lastName,
        
        @NotBlank(message = "Email is required")
        @Email(message = "Email should be valid")
        String email
) {
}
