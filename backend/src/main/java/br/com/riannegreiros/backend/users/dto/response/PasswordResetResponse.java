package br.com.riannegreiros.backend.users.dto.response;

public record PasswordResetResponse(
        String message,
        boolean success) {
    public PasswordResetResponse(String message) {
        this(message, true);
    }
}
