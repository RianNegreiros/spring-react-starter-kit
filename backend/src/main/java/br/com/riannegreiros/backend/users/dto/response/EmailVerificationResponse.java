package br.com.riannegreiros.backend.users.dto.response;

public record EmailVerificationResponse(String token, String lastName, String firstName, String email) {
}
