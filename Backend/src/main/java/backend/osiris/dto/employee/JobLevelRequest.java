package backend.osiris.dto.employee;

import lombok.Data;

@Data
public class JobLevelRequest {
    private String name;
    private Integer status;
}