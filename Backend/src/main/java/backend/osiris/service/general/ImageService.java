package backend.osiris.service.general;

import backend.osiris.dto.general.ImageRequest;
import backend.osiris.dto.general.ImageResponse;
import backend.osiris.dto.general.UploadedImageResponse;
import backend.osiris.service.CrudService;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface ImageService extends CrudService<Long, ImageRequest, ImageResponse> {

    UploadedImageResponse store(MultipartFile image);

    String load(String imageName);

    void delete(String imageName);

}