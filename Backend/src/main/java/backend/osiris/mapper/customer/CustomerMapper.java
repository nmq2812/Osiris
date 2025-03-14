package backend.osiris.mapper.customer;

import backend.osiris.dto.customer.CustomerRequest;
import backend.osiris.dto.customer.CustomerResponse;
import backend.osiris.entity.customer.Customer;
import backend.osiris.mapper.GenericMapper;
import backend.osiris.mapper.authentication.UserMapper;
import backend.osiris.utils.MapperUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {MapperUtils.class, UserMapper.class})
public interface CustomerMapper extends GenericMapper<Customer, CustomerRequest, CustomerResponse> {

    @Override
    @Mapping(source = "customerGroupId", target = "customerGroup")
    @Mapping(source = "customerResourceId", target = "customerResource")
    @Mapping(source = "customerStatusId", target = "customerStatus")
    Customer requestToEntity(CustomerRequest request);

    @Override
    @Mapping(source = "customerGroupId", target = "customerGroup")
    @Mapping(source = "customerResourceId", target = "customerResource")
    @Mapping(source = "customerStatusId", target = "customerStatus")
    Customer partialUpdate(@MappingTarget Customer entity, CustomerRequest request);

}