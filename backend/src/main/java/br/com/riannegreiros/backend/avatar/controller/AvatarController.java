package br.com.riannegreiros.backend.avatar.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import br.com.riannegreiros.backend.avatar.dto.AvatarResponse;
import br.com.riannegreiros.backend.avatar.service.AvatarService;
import br.com.riannegreiros.backend.util.ApiResponse;

@RestController
@RequestMapping("/api/avatar")
public class AvatarController {

    private static final Logger log = LoggerFactory.getLogger(AvatarController.class);
    private final AvatarService avatarService;

    public AvatarController(AvatarService avatarService) {
        this.avatarService = avatarService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AvatarResponse>> upload(@RequestParam("file") MultipartFile file) {
        try {
            String avatarUrl = avatarService.uploadAvatar(file);
            AvatarResponse response = new AvatarResponse(avatarUrl, "Avatar uploaded successfully");
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            log.error("Avatar upload failed", e);
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<AvatarResponse>> delete() {
        try {
            avatarService.deleteAvatar();
            AvatarResponse response = new AvatarResponse(null, "Avatar deleted successfully");
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
