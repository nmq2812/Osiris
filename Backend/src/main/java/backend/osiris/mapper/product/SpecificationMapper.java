package backend.osiris.mapper.product;

import backend.osiris.dto.product.SpecificationRequest;
import backend.osiris.dto.product.SpecificationResponse;
import backend.osiris.entity.product.Specification;
import backend.osiris.mapper.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SpecificationMapper extends GenericMapper<Specification, SpecificationRequest, SpecificationResponse> {
}