package backend.osiris.service.general;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.general.ImageRequest;
import backend.osiris.dto.general.ImageResponse;
import backend.osiris.dto.general.UploadedImageResponse;
import backend.osiris.entity.general.Image;
import backend.osiris.exception.FileStorageException;
import backend.osiris.exception.StorageFileNotFoundException;
import backend.osiris.mapper.general.ImageMapper;
import backend.osiris.repository.general.ImageRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class ImageServiceImpl implements ImageService {

    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;
    private final Cloudinary cloudinary;

    private static final Path IMAGE_DIR = Paths.get(System.getProperty("user.dir")).resolve("image-dir");

    public ImageServiceImpl(
            ImageRepository imageRepository,
            ImageMapper imageMapper,
            @Value("${cloudinary.cloudName}") String cloudName,
            @Value("${cloudinary.apiKey}") String apiKey,
            @Value("${cloudinary.apiSecret}") String apiSecret) {

        this.imageRepository = imageRepository;
        this.imageMapper = imageMapper;

        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
        ));
    }


    @Override
    public UploadedImageResponse store(MultipartFile image) {
        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(image.getOriginalFilename()));

        if (originalFileName.contains("..")) {
            throw new FileStorageException("Sorry! Filename contains invalid path sequence " + originalFileName);
        }

        try {
            // Chuyển MultipartFile thành File tạm để Cloudinary upload
            File tempFile = File.createTempFile("upload-", originalFileName);
            image.transferTo(tempFile);

            // Upload lên Cloudinary
            Map uploadResult = cloudinary.uploader().upload(tempFile, ObjectUtils.emptyMap());

            // Xóa file tạm sau khi upload
            tempFile.delete();

            // Trả về response
            String imageUrl = uploadResult.get("secure_url").toString();
            String publicId = uploadResult.get("public_id").toString();
            String contentType = image.getContentType();
            long size = image.getSize();

            //save image info to database
//            Image imageEntity = new Image();
//            imageEntity.setName(publicId);
//            imageEntity.setPath(imageUrl);
//            imageEntity.setContentType(contentType);
//            imageEntity.setSize(size);
//            imageRepository.save(imageEntity);

            return new UploadedImageResponse(publicId, imageUrl, contentType, size);

        } catch (IOException e) {
            throw new FileStorageException("Could not upload file " + originalFileName + " to Cloudinary", e);
        }
    }

    @Override
    public String load(String imageName) {
        return cloudinary.url().secure(true).generate(imageName);
    }

    @Override
    public void delete(String imageName) {
        try {
            Map result = cloudinary.uploader().destroy(imageName, ObjectUtils.emptyMap());
            String status = (String) result.get("result");
            if (!"ok".equals(status)) {
                throw new StorageFileNotFoundException("Could not delete image with publicId: " + imageName);
            }
        } catch (IOException e) {
            throw new FileStorageException("Error deleting image with publicId: " + imageName, e);
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