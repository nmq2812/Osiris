package backend.osiris.dto.customer;

import backend.osiris.dto.authentication.UserResponse;
import lombok.Data;

import java.time.Instant;

@Data
public class CustomerResponse {
    private Long id;
    private Instant createdAt;
    private Instant updatedAt;
    private UserResponse user;
    private CustomerGroupResponse customerGroup;
    private CustomerStatusResponse customerStatus;
    private CustomerResourceResponse customerResource;
}