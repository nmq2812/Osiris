package backend.osiris.dto.inventory;

import lombok.Data;

@Data
public class DocketReasonRequest {
    private String name;
    private Integer status;
}
