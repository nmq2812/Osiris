package backend.osiris.mapper.customer;

import backend.osiris.dto.customer.CustomerResourceRequest;
import backend.osiris.dto.customer.CustomerResourceResponse;
import backend.osiris.entity.customer.CustomerResource;
import backend.osiris.mapper.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CustomerResourceMapper extends GenericMapper<CustomerResource, CustomerResourceRequest, CustomerResourceResponse> {
}