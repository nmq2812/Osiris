package backend.osiris.service.order;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.order.OrderCancellationReasonRequest;
import backend.osiris.dto.order.OrderCancellationReasonResponse;
import backend.osiris.mapper.order.OrderCancellationReasonMapper;
import backend.osiris.repository.order.OrderCancellationReasonRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class OrderCancellationReasonServiceImpl implements OrderCancellationReasonService {

    private OrderCancellationReasonRepository orderCancellationReasonRepository;

    private OrderCancellationReasonMapper orderCancellationReasonMapper;

    @Override
    public ListResponse<OrderCancellationReasonResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.ORDER_CANCELLATION_REASON, orderCancellationReasonRepository, orderCancellationReasonMapper);
    }

    @Override
    public OrderCancellationReasonResponse findById(Long id) {
        return defaultFindById(id, orderCancellationReasonRepository, orderCancellationReasonMapper, ResourceName.ORDER_CANCELLATION_REASON);
    }

    @Override
    public OrderCancellationReasonResponse save(OrderCancellationReasonRequest request) {
        return defaultSave(request, orderCancellationReasonRepository, orderCancellationReasonMapper);
    }

    @Override
    public OrderCancellationReasonResponse save(Long id, OrderCancellationReasonRequest request) {
        return defaultSave(id, request, orderCancellationReasonRepository, orderCancellationReasonMapper, ResourceName.ORDER_CANCELLATION_REASON);
    }

    @Override
    public void delete(Long id) {
        orderCancellationReasonRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        orderCancellationReasonRepository.deleteAllById(ids);
    }

}