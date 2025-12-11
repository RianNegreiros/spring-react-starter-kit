package br.com.riannegreiros.backend.util.exceptions;

import org.springframework.http.HttpStatus;

public class AvatarUploadException extends ApiException {
    public AvatarUploadException(String message) {
        super(HttpStatus.BAD_REQUEST, message);
    }
    
    public AvatarUploadException(String message, Throwable cause) {
        super(HttpStatus.INTERNAL_SERVER_ERROR, message);
        initCause(cause);
    }
}
