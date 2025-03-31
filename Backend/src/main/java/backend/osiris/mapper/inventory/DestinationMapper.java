package backend.osiris.mapper.inventory;

import backend.osiris.dto.inventory.DestinationRequest;
import backend.osiris.dto.inventory.DestinationResponse;
import backend.osiris.entity.inventory.Destination;
import backend.osiris.mapper.GenericMapper;
import backend.osiris.mapper.address.AddressMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = AddressMapper.class)
public interface DestinationMapper extends GenericMapper<Destination, DestinationRequest, DestinationResponse> {}
