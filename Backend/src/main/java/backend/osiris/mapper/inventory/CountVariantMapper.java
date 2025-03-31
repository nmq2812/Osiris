package backend.osiris.mapper.inventory;

import backend.osiris.dto.inventory.CountVariantRequest;
import backend.osiris.dto.inventory.CountVariantResponse;
import backend.osiris.entity.inventory.CountVariant;
import backend.osiris.mapper.GenericMapper;
import backend.osiris.utils.MapperUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = MapperUtils.class)
public interface CountVariantMapper extends GenericMapper<CountVariant, CountVariantRequest, CountVariantResponse> {

    @Override
    @Mapping(source = "variantId", target = "variant")
    CountVariant requestToEntity(CountVariantRequest request);

    @Override
    @Mapping(source = "variantId", target = "variant")
    CountVariant partialUpdate(@MappingTarget CountVariant entity, CountVariantRequest request);

}
