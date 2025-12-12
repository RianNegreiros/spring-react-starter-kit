package br.com.riannegreiros.backend.users.dto.response;

public record UserResponse(
        String userId,
        String email,
        String firstName,
        String lastName,
        String avatarUrl) {
}
