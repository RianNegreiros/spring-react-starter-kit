package br.com.riannegreiros.backend.avatar.service;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import br.com.riannegreiros.backend.storage.service.StorageService;
import br.com.riannegreiros.backend.users.User;
import br.com.riannegreiros.backend.users.repository.UserRepository;
import br.com.riannegreiros.backend.users.service.UserService;
import br.com.riannegreiros.backend.util.exceptions.InvalidFileException;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class AvatarService {

    private static final List<String> ALLOWED_TYPES = Arrays.asList("image/jpeg", "image/png", "image/gif",
            "image/webp");
    private static final long MAX_SIZE = 5 * 1024 * 1024; // 5MB

    private final StorageService storageService;
    private final UserService userService;
    private final UserRepository userRepository;

    public AvatarService(StorageService storageService, UserService userService, UserRepository userRepository) {
        this.storageService = storageService;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    public String uploadAvatar(MultipartFile file) throws IOException {
        validateFile(file);
        User user = userService.getCurrentUserEntity();

        if (user.getAvatarUrl() != null) {
            storageService.deleteFile(user.getAvatarUrl());
        }

        String avatarUrl = storageService.uploadFile(file, "avatars/user_" + user.getId());
        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);

        return avatarUrl;
    }

    public void deleteAvatar() {
        User user = userService.getCurrentUserEntity();

        if (user.getAvatarUrl() != null) {
            storageService.deleteFile(user.getAvatarUrl());
            user.setAvatarUrl(null);
            userRepository.save(user);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new InvalidFileException("File cannot be empty");
        }
        if (file.getSize() > MAX_SIZE) {
            throw new InvalidFileException("File size must be less than 5MB");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new InvalidFileException("Only JPEG, PNG, GIF, and WebP images are allowed");
        }
    }
}
