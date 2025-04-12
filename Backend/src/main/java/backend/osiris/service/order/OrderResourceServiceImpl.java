package backend.osiris.service.order;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.order.OrderResourceRequest;
import backend.osiris.dto.order.OrderResourceResponse;
import backend.osiris.mapper.order.OrderResourceMapper;
import backend.osiris.repository.order.OrderResourceRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class OrderResourceServiceImpl implements OrderResourceService {

    private OrderResourceRepository orderResourceRepository;

    private OrderResourceMapper orderResourceMapper;

    @Override
    public ListResponse<OrderResourceResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.ORDER_RESOURCE, orderResourceRepository, orderResourceMapper);
    }

    @Override
    public OrderResourceResponse findById(Long id) {
        return defaultFindById(id, orderResourceRepository, orderResourceMapper, ResourceName.ORDER_RESOURCE);
    }

    @Override
    public OrderResourceResponse save(OrderResourceRequest request) {
        return defaultSave(request, orderResourceRepository, orderResourceMapper);
    }

    @Override
    public OrderResourceResponse save(Long id, OrderResourceRequest request) {
        return defaultSave(id, request, orderResourceRepository, orderResourceMapper, ResourceName.ORDER_RESOURCE);
    }

    @Override
    public void delete(Long id) {
        orderResourceRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        orderResourceRepository.deleteAllById(ids);
    }

}