package backend.osiris.service.waybill;

import backend.osiris.dto.waybill.GhnCallbackOrderRequest;
import backend.osiris.dto.waybill.WaybillRequest;
import backend.osiris.dto.waybill.WaybillResponse;
import backend.osiris.service.CrudService;

public interface WaybillService extends CrudService<Long, WaybillRequest, WaybillResponse> {

    void callbackStatusWaybillFromGHN(GhnCallbackOrderRequest ghnCallbackOrderRequest);

}
