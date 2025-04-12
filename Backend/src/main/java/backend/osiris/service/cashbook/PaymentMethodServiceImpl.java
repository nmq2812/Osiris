package backend.osiris.service.cashbook;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.cashbook.PaymentMethodRequest;
import backend.osiris.dto.cashbook.PaymentMethodResponse;
import backend.osiris.mapper.cashbook.PaymentMethodMapper;
import backend.osiris.repository.cashbook.PaymentMethodRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class PaymentMethodServiceImpl implements PaymentMethodService {

    private PaymentMethodRepository paymentMethodRepository;

    private PaymentMethodMapper paymentMethodMapper;

    @Override
    public ListResponse<PaymentMethodResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.PAYMENT_METHOD, paymentMethodRepository, paymentMethodMapper);
    }

    @Override
    public PaymentMethodResponse findById(Long id) {
        return defaultFindById(id, paymentMethodRepository, paymentMethodMapper, ResourceName.PAYMENT_METHOD);
    }

    @Override
    public PaymentMethodResponse save(PaymentMethodRequest request) {
        return defaultSave(request, paymentMethodRepository, paymentMethodMapper);
    }

    @Override
    public PaymentMethodResponse save(Long id, PaymentMethodRequest request) {
        return defaultSave(id, request, paymentMethodRepository, paymentMethodMapper, ResourceName.PAYMENT_METHOD);
    }

    @Override
    public void delete(Long id) {
        paymentMethodRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        paymentMethodRepository.deleteAllById(ids);
    }

}