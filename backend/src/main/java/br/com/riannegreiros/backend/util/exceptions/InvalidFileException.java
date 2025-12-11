package br.com.riannegreiros.backend.util.exceptions;

import org.springframework.http.HttpStatus;

public class InvalidFileException extends ApiException {
    public InvalidFileException(String message) {
        super(HttpStatus.BAD_REQUEST, message);
    }
}
