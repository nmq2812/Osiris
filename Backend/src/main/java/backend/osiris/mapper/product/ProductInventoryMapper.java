package backend.osiris.mapper.product;

import backend.osiris.dto.inventory.ProductInventoryResponse;
import backend.osiris.projection.inventory.ProductInventory;
import backend.osiris.mapper.inventory.DocketVariantMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {DocketVariantMapper.class, BrandMapper.class, SupplierMapper.class})
public interface ProductInventoryMapper {

    ProductInventoryResponse toResponse(ProductInventory productInventory);

    List<ProductInventoryResponse> toResponse(List<ProductInventory> productInventory);

}
