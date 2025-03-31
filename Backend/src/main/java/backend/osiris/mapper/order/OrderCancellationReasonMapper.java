package backend.osiris.mapper.order;

import backend.osiris.dto.order.OrderCancellationReasonRequest;
import backend.osiris.dto.order.OrderCancellationReasonResponse;
import backend.osiris.entity.order.OrderCancellationReason;
import backend.osiris.mapper.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface OrderCancellationReasonMapper extends GenericMapper<OrderCancellationReason, OrderCancellationReasonRequest,
        OrderCancellationReasonResponse> {}
