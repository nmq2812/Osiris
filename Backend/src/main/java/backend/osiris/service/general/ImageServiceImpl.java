package backend.osiris.service.general;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.general.ImageRequest;
import backend.osiris.dto.general.ImageResponse;
import backend.osiris.dto.general.UploadedImageResponse;
import backend.osiris.exception.FileStorageException;
import backend.osiris.exception.StorageFileNotFoundException;
import backend.osiris.mapper.general.ImageMapper;
import backend.osiris.repository.general.ImageRepository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;

@Service
public class ImageServiceImpl implements ImageService {

    private ImageRepository imageRepository;
    private ImageMapper imageMapper;

    private static final Path IMAGE_DIR = Paths.get(System.getProperty("user.dir")).resolve("image-dir");

    public ImageServiceImpl() {
        if (!Files.exists(IMAGE_DIR)) {
            try {
                Files.createDirectories(IMAGE_DIR);
            } catch (IOException e) {
                throw new FileStorageException("Could not create the directory where the uploaded files will be stored.", e);
            }
        }
    }

    @Override
    public UploadedImageResponse store(MultipartFile image) {
        String imageName = StringUtils.cleanPath(Objects.requireNonNull(image.getOriginalFilename()));

        try {
            if (imageName.contains("..")) {
                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + imageName);
            }

            Path targetLocation = Files.createTempFile(IMAGE_DIR, "img-", ".jpg");
            try (InputStream fileContent = image.getInputStream()) {
                Files.copy(fileContent, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }

            String uploadedImageName = targetLocation.getFileName().toString();

            String uploadedImagePath = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/images/")
                    .path(uploadedImageName)
                    .toUriString();

            return new UploadedImageResponse(uploadedImageName, uploadedImagePath, image.getContentType(), image.getSize());
        } catch (IOException e) {
            throw new FileStorageException("Could not store file " + imageName + ". Please try again!", e);
        }
    }

    @Override
    public Resource load(String imageName) {
        try {
            Path imagePath = IMAGE_DIR.resolve(imageName).normalize();
            Resource resource = new UrlResource(imagePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new StorageFileNotFoundException("File not found " + imageName);
            }
        } catch (MalformedURLException e) {
            throw new StorageFileNotFoundException("File not found " + imageName, e);
        }
    }

    @Override
    public void delete(String imageName) {
        try {
            Path imagePath = IMAGE_DIR.resolve(imageName).normalize();
            Resource resource = new UrlResource(imagePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                Files.delete(imagePath);
            } else {
                throw new StorageFileNotFoundException("File not found " + imageName);
            }
        } catch (MalformedURLException e) {
            throw new StorageFileNotFoundException("File not found " + imageName, e);
        } catch (IOException e) {
            throw new FileStorageException("File not found " + imageName + ". Please try again!", e);
        }
    }

    @Override
    public ListResponse<ImageResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.IMAGE, imageRepository, imageMapper);
    }

    @Override
    public ImageResponse findById(Long id) {
        return defaultFindById(id, imageRepository, imageMapper, ResourceName.IMAGE);
    }

    @Override
    public ImageResponse save(ImageRequest request) {
        return defaultSave(request, imageRepository, imageMapper);
    }

    @Override
    public ImageResponse save(Long id, ImageRequest request) {
        return defaultSave(id, request, imageRepository, imageMapper, ResourceName.IMAGE);
    }

    @Override
    public void delete(Long id) {
        imageRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        imageRepository.deleteAllById(ids);
    }

}