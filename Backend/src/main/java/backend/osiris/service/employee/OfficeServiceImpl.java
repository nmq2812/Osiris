package backend.osiris.service.employee;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.employee.OfficeRequest;
import backend.osiris.dto.employee.OfficeResponse;
import backend.osiris.mapper.employee.OfficeMapper;
import backend.osiris.repository.employee.OfficeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class OfficeServiceImpl implements OfficeService {

    private OfficeRepository officeRepository;

    private OfficeMapper officeMapper;

    @Override
    public ListResponse<OfficeResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.OFFICE, officeRepository, officeMapper);
    }

    @Override
    public OfficeResponse findById(Long id) {
        return defaultFindById(id, officeRepository, officeMapper, ResourceName.OFFICE);
    }

    @Override
    public OfficeResponse save(OfficeRequest request) {
        return defaultSave(request, officeRepository, officeMapper);
    }

    @Override
    public OfficeResponse save(Long id, OfficeRequest request) {
        return defaultSave(id, request, officeRepository, officeMapper, ResourceName.OFFICE);
    }

    @Override
    public void delete(Long id) {
        officeRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        officeRepository.deleteAllById(ids);
    }

}