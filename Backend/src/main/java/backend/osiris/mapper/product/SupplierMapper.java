package backend.osiris.mapper.product;

import backend.osiris.dto.product.SupplierRequest;
import backend.osiris.dto.product.SupplierResponse;
import backend.osiris.entity.product.Supplier;
import backend.osiris.mapper.GenericMapper;
import backend.osiris.mapper.address.AddressMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = AddressMapper.class)
public interface SupplierMapper extends GenericMapper<Supplier, SupplierRequest, SupplierResponse> {
}