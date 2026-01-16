package br.com.riannegreiros.backend.users.dto.response;

public record UserRegisterResponse(String lastName, String firstName, String email, String message) {
}
