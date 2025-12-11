package br.com.riannegreiros.backend.storage.service;

import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    String uploadFile(MultipartFile file, String path) throws IOException;
    void deleteFile(String fileUrl);
}
