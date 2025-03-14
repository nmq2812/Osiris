package backend.osiris.dto.customer;

import backend.osiris.dto.authentication.UserRequest;
import lombok.Data;

@Data
public class CustomerRequest {
    private UserRequest user;
    private Long customerGroupId;
    private Long customerStatusId;
    private Long customerResourceId;
}