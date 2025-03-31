package backend.osiris.mapper.inventory;

import backend.osiris.dto.inventory.StorageLocationRequest;
import backend.osiris.dto.inventory.StorageLocationResponse;
import backend.osiris.entity.inventory.StorageLocation;
import backend.osiris.mapper.GenericMapper;
import backend.osiris.mapper.product.VariantMapper;
import backend.osiris.utils.MapperUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {MapperUtils.class, WarehouseMapper.class, VariantMapper.class})
public interface StorageLocationMapper extends GenericMapper<StorageLocation, StorageLocationRequest, StorageLocationResponse> {

    @Override
    @Mapping(source = "warehouseId", target = "warehouse")
    @Mapping(source = "variantId", target = "variant")
    StorageLocation requestToEntity(StorageLocationRequest request);

    @Override
    @Mapping(source = "warehouseId", target = "warehouse")
    @Mapping(source = "variantId", target = "variant")
    StorageLocation partialUpdate(@MappingTarget StorageLocation entity, StorageLocationRequest request);

}
