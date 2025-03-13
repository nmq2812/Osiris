package backend.osiris.mapper.product;

import backend.osiris.dto.product.UnitRequest;
import backend.osiris.dto.product.UnitResponse;
import backend.osiris.entity.product.Unit;
import backend.osiris.mapper.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UnitMapper extends GenericMapper<Unit, UnitRequest, UnitResponse> {
}