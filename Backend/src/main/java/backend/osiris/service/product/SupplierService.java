package backend.osiris.service.product;

import backend.osiris.dto.product.SupplierRequest;
import backend.osiris.dto.product.SupplierResponse;
import backend.osiris.service.CrudService;

public interface SupplierService extends CrudService<Long, SupplierRequest, SupplierResponse> {}