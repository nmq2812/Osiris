package backend.osiris.dto.address;

import lombok.Data;

@Data
public class DistrictRequest {
    private String name;
    private String code;
    private Long provinceId;
}