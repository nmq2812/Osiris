package backend.osiris.mapper.product;

import backend.osiris.dto.product.VariantRequest;
import backend.osiris.dto.product.VariantResponse;
import backend.osiris.entity.product.Variant;
import backend.osiris.mapper.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface VariantMapper extends GenericMapper<Variant, VariantRequest, VariantResponse> {
}