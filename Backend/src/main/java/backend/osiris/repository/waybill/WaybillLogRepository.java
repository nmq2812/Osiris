package backend.osiris.repository.waybill;

import backend.osiris.entity.waybill.WaybillLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface WaybillLogRepository extends JpaRepository<WaybillLog, Long>, JpaSpecificationExecutor<WaybillLog> {}
