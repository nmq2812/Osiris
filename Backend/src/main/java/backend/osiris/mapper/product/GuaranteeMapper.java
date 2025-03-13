package backend.osiris.mapper.product;

import backend.osiris.dto.product.GuaranteeRequest;
import backend.osiris.dto.product.GuaranteeResponse;
import backend.osiris.entity.product.Guarantee;
import backend.osiris.mapper.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface GuaranteeMapper extends GenericMapper<Guarantee, GuaranteeRequest, GuaranteeResponse> {
}