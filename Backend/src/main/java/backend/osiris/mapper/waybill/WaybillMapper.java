package backend.osiris.mapper.waybill;

import backend.osiris.dto.waybill.WaybillRequest;
import backend.osiris.dto.waybill.WaybillResponse;
import backend.osiris.entity.waybill.Waybill;
import backend.osiris.mapper.GenericMapper;
import backend.osiris.mapper.order.OrderMapper;
import backend.osiris.utils.MapperUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {MapperUtils.class, OrderMapper.class})
public interface WaybillMapper extends GenericMapper<Waybill, WaybillRequest, WaybillResponse> {

    @Override
    @Mapping(source = "orderId", target = "order")
    Waybill requestToEntity(WaybillRequest request);

    @Override
    @Mapping(source = "orderId", target = "order")
    Waybill partialUpdate(@MappingTarget Waybill entity, WaybillRequest request);

}
