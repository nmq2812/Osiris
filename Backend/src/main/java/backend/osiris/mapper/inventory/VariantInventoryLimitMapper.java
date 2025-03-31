package backend.osiris.mapper.inventory;

import backend.osiris.dto.inventory.VariantInventoryLimitRequest;
import backend.osiris.dto.inventory.VariantInventoryLimitResponse;
import backend.osiris.entity.inventory.VariantInventoryLimit;
import backend.osiris.mapper.GenericMapper;
import backend.osiris.utils.MapperUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = MapperUtils.class)
public interface VariantInventoryLimitMapper extends GenericMapper<VariantInventoryLimit, VariantInventoryLimitRequest,
        VariantInventoryLimitResponse> {

    @Override
    @Mapping(source = "variantId", target = "variant")
    VariantInventoryLimit requestToEntity(VariantInventoryLimitRequest request);

    @Override
    @Mapping(source = "variantId", target = "variant")
    VariantInventoryLimit partialUpdate(@MappingTarget VariantInventoryLimit entity, VariantInventoryLimitRequest request);

}
