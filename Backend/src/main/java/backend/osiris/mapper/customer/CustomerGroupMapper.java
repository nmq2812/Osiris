package backend.osiris.mapper.customer;

import backend.osiris.dto.customer.CustomerGroupRequest;
import backend.osiris.dto.customer.CustomerGroupResponse;
import backend.osiris.entity.customer.CustomerGroup;
import backend.osiris.mapper.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CustomerGroupMapper extends GenericMapper<CustomerGroup, CustomerGroupRequest, CustomerGroupResponse> {
}