package br.com.riannegreiros.backend.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;

import br.com.riannegreiros.backend.util.exceptions.ApiException;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResponse<Void>> handleApiException(ApiException ex, WebRequest request) {
        log.warn("API Exception: {}", ex.getMessage());

        return ResponseEntity.status(ex.getStatus())
                .body(new ApiResponse<>(
                        LocalDateTime.now(),
                        false,
                        ex.getMessage(),
                        null,
                        null));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentials(
            BadCredentialsException ex, WebRequest request) {

        log.warn("Authentication failed - bad credentials");

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse<>(
                        LocalDateTime.now(),
                        false,
                        "Invalid email or password",
                        null,
                        null));
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleUsernameNotFound(
            UsernameNotFoundException ex, WebRequest request) {

        log.warn("Authentication failed - user not found");

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse<>(
                        LocalDateTime.now(),
                        false,
                        "Invalid email or password",
                        null,
                        null));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationException(
            MethodArgumentNotValidException ex, WebRequest request) {

        Map<String, String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        error -> error.getDefaultMessage() != null ? error.getDefaultMessage() : "Invalid value"));

        String message = errors.entrySet().stream()
                .map(entry -> entry.getKey() + ": " + entry.getValue())
                .collect(Collectors.joining(", "));

        log.warn("Validation error: {}", message);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse<>(
                        LocalDateTime.now(),
                        false,
                        "Validation failed",
                        null,
                        errors));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(
            AccessDeniedException ex, WebRequest request) {

        log.warn("Access denied - insufficient permissions");

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ApiResponse<>(
                        LocalDateTime.now(),
                        false,
                        "You do not have permission to access this resource",
                        null,
                        null));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgument(
            IllegalArgumentException ex, WebRequest request) {

        log.warn("Invalid argument: {}", ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse<>(
                        LocalDateTime.now(),
                        false,
                        ex.getMessage(),
                        null,
                        null));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiResponse<Void>> handleMaxSizeException(
            MaxUploadSizeExceededException ex, WebRequest request) {

        log.warn("File upload size exceeded: {}", ex.getMessage());

        return ResponseEntity.status(HttpStatus.CONTENT_TOO_LARGE)
                .body(new ApiResponse<>(
                        LocalDateTime.now(),
                        false,
                        "File too large. Maximum size allowed is 5MB",
                        null,
                        null));
    }

    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<ApiResponse<Void>> handleMultipartException(
            MultipartException ex, WebRequest request) {

        log.warn("Multipart file error: {}", ex.getMessage());

        return ResponseEntity.badRequest()
                .body(new ApiResponse<>(
                        LocalDateTime.now(),
                        false,
                        "Invalid file format or corrupted file",
                        null,
                        null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(
            Exception ex, WebRequest request) {

        String requestUri = request.getDescription(false).replace("uri=", "");
        log.error("Unhandled exception occurred - URI: {}, Message: {}", requestUri, ex.getMessage(), ex);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(
                        LocalDateTime.now(),
                        false,
                        "An unexpected error occurred. Please try again later",
                        null,
                        null));
    }
}
