package backend.osiris.mapper.inventory;

import backend.osiris.dto.inventory.PurchaseOrderRequest;
import backend.osiris.dto.inventory.PurchaseOrderResponse;
import backend.osiris.entity.inventory.PurchaseOrder;
import backend.osiris.mapper.GenericMapper;
import backend.osiris.mapper.product.SupplierMapper;
import backend.osiris.utils.MapperUtils;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {MapperUtils.class, SupplierMapper.class, DestinationMapper.class, PurchaseOrderVariantMapper.class})
public interface PurchaseOrderMapper extends GenericMapper<PurchaseOrder, PurchaseOrderRequest, PurchaseOrderResponse> {

    @Override
    @BeanMapping(qualifiedByName = "attachPurchaseOrder")
    @Mapping(source = "supplierId", target = "supplier")
    @Mapping(source = "destinationId", target = "destination")
    PurchaseOrder requestToEntity(PurchaseOrderRequest request);

    @Override
    @BeanMapping(qualifiedByName = "attachPurchaseOrder")
    @Mapping(source = "supplierId", target = "supplier")
    @Mapping(source = "destinationId", target = "destination")
    PurchaseOrder partialUpdate(@MappingTarget PurchaseOrder entity, PurchaseOrderRequest request);

}
