package br.com.riannegreiros.backend.users.dto.response;

public record UserRegisterResponse(String token, String name, String email) {
}
