package backend.osiris.dto.employee;

import lombok.Data;

@Data
public class JobTypeRequest {
    private String name;
    private Integer status;
}