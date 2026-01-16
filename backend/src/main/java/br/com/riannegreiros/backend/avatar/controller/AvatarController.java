package br.com.riannegreiros.backend.avatar.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import br.com.riannegreiros.backend.avatar.dto.AvatarResponse;
import br.com.riannegreiros.backend.avatar.service.AvatarService;

@RestController
@RequestMapping("/api/avatar")
public class AvatarController {

    private final AvatarService avatarService;

    public AvatarController(AvatarService avatarService) {
        this.avatarService = avatarService;
    }

    @PostMapping
    public ResponseEntity<AvatarResponse> upload(@RequestParam("file") MultipartFile file) throws Exception {
        String avatarUrl = avatarService.uploadAvatar(file);
        return ResponseEntity.ok(new AvatarResponse(avatarUrl));
    }

    @DeleteMapping
    public ResponseEntity<Void> delete() {
        avatarService.deleteAvatar();
        return ResponseEntity.noContent().build();
    }
}
