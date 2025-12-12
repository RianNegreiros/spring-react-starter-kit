package br.com.riannegreiros.backend.users.dto.response;

public record UserRegisterResponse(String token, String lastName, String firstName, String email) {
}
