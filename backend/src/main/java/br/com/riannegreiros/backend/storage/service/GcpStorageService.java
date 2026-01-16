package br.com.riannegreiros.backend.storage.service;

import com.google.cloud.storage.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import br.com.riannegreiros.backend.util.exceptions.StorageException;

import java.io.IOException;
import java.util.UUID;

@Service
public class GcpStorageService implements StorageService {

    @Value("${gcp.project-id}")
    private String projectId;

    @Value("${gcp.bucket-name}")
    private String bucketName;

    @Override
    public String uploadFile(MultipartFile file, String path) throws IOException {
        try {
            String fileName = generateFileName(file, path);
            Storage storage = StorageOptions.newBuilder().setProjectId(projectId).build().getService();
            
            BlobId blobId = BlobId.of(bucketName, fileName);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(file.getContentType()).build();
            
            storage.createFrom(blobInfo, file.getInputStream());
            return String.format("https://storage.googleapis.com/%s/%s", bucketName, fileName);
        } catch (Exception e) {
            throw new IOException("Failed to upload file: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        try {
            String fileName = extractFileName(fileUrl);
            Storage storage = StorageOptions.newBuilder().setProjectId(projectId).build().getService();
            
            Blob blob = storage.get(bucketName, fileName);
            if (blob != null) {
                blob.delete();
            }
        } catch (Exception e) {
            throw new StorageException("Failed to delete file: " + e.getMessage(), e);
        }
    }

    private String generateFileName(MultipartFile file, String path) {
        String extension = getFileExtension(file.getOriginalFilename());
        return path + "_" + UUID.randomUUID() + extension;
    }

    private String getFileExtension(String filename) {
        return filename != null && filename.contains(".") ? 
            filename.substring(filename.lastIndexOf(".")) : "";
    }

    private String extractFileName(String fileUrl) {
        return fileUrl.substring(fileUrl.lastIndexOf(bucketName) + bucketName.length() + 1);
    }
}
