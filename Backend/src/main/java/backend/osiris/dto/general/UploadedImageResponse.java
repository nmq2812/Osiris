package backend.osiris.dto.general;

import lombok.Value;

@Value
public class UploadedImageResponse {
    String name;
    String path;
    String contentType;
    long size;
}