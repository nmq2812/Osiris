package backend.osiris.mapper.product;

import backend.osiris.dto.product.PropertyRequest;
import backend.osiris.dto.product.PropertyResponse;
import backend.osiris.entity.product.Property;
import backend.osiris.mapper.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PropertyMapper extends GenericMapper<Property, PropertyRequest, PropertyResponse> {
}