package backend.osiris.dto.product;

import lombok.Data;

@Data
public class TagRequest {
    private String name;
    private String slug;
    private Integer status;
}