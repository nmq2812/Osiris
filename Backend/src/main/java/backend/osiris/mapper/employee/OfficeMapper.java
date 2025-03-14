package backend.osiris.mapper.employee;

import backend.osiris.dto.employee.OfficeRequest;
import backend.osiris.dto.employee.OfficeResponse;
import backend.osiris.entity.employee.Office;
import backend.osiris.mapper.GenericMapper;
import backend.osiris.mapper.address.AddressMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = AddressMapper.class)
public interface OfficeMapper extends GenericMapper<Office, OfficeRequest, OfficeResponse> {
}