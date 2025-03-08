package backend.osiris.dto.authentication;

import lombok.Value;

import java.io.Serializable;
import java.time.Instant;

@Value
public class RoleResponse implements Serializable {
    Long id;
    Instant createdAt;
    Instant updatedAt;
    String code;
    String name;
    Integer status;
}