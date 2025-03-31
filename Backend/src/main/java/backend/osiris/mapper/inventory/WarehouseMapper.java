package backend.osiris.mapper.inventory;

import backend.osiris.dto.inventory.WarehouseRequest;
import backend.osiris.dto.inventory.WarehouseResponse;
import backend.osiris.entity.inventory.Warehouse;
import backend.osiris.mapper.GenericMapper;
import backend.osiris.mapper.address.AddressMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = AddressMapper.class)
public interface WarehouseMapper extends GenericMapper<Warehouse, WarehouseRequest, WarehouseResponse> {}
