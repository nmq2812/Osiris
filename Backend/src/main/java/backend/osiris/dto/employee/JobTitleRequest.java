package backend.osiris.dto.employee;

import lombok.Data;

@Data
public class JobTitleRequest {
    private String name;
    private Integer status;
}