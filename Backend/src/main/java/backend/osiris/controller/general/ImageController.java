package backend.osiris.controller.general;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.CollectionWrapper;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.general.ImageRequest;
import backend.osiris.dto.general.ImageResponse;
import backend.osiris.dto.general.UploadedImageResponse;
import backend.osiris.service.general.ImageService;
import io.micrometer.common.lang.Nullable;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/images")
@AllArgsConstructor
@Slf4j
public class ImageController {

    private ImageService imageService;

    @PostMapping("/upload-single")
    public ResponseEntity<UploadedImageResponse> uploadSingleImage(@RequestParam("image") MultipartFile image) {
        return ResponseEntity.status(HttpStatus.OK).body(imageService.store(image));
    }

    @PostMapping("/upload-multiple")
    public ResponseEntity<CollectionWrapper<UploadedImageResponse>> uploadMultipleImages(@RequestParam("images") MultipartFile[] images) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(new CollectionWrapper<>(Stream.of(images)
                        .map(imageService::store)
                        .collect(Collectors.toList())));
    }

    @GetMapping("/{imageName:.+}")
    public ResponseEntity<Void> serveImage(@PathVariable String imageName) {
        String imageUrl = imageService.load(imageName);
        return ResponseEntity.status(HttpStatus.FOUND) // HTTP 302
                .location(URI.create(imageUrl))
                .build();
    }

    @DeleteMapping("/by-name/{imageName:.+}")
    public ResponseEntity<Void> deleteImage(@PathVariable String imageName) {
        imageService.delete(imageName);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping("/by-names")
    public ResponseEntity<Void> deleteMultipleImages(@RequestBody List<String> imageNames) {
        imageNames.forEach(imageService::delete);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping
    public ResponseEntity<ListResponse> getAllImages(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(imageService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/by-id/{id}")
    public ResponseEntity<ImageResponse> getImage(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(imageService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ImageResponse> createImage(@RequestBody ImageRequest imageRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(imageService.save(imageRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ImageResponse> updateImage(@PathVariable("id") Long id,
                                                           @RequestBody ImageRequest imageRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(imageService.save(id, imageRequest));
    }

    @DeleteMapping("/by-id/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable("id") Long id) {
        imageService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping("/by-ids")
    public ResponseEntity<Void> deleteImages(@RequestBody List<Long> ids) {
        imageService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}