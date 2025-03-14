package backend.osiris.mapper.customer;

import backend.osiris.dto.customer.CustomerStatusRequest;
import backend.osiris.dto.customer.CustomerStatusResponse;
import backend.osiris.entity.customer.CustomerStatus;
import backend.osiris.mapper.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CustomerStatusMapper extends GenericMapper<CustomerStatus, CustomerStatusRequest, CustomerStatusResponse> {
}