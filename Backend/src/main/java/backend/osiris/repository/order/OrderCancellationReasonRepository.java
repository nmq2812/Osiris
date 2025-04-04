package backend.osiris.repository.order;

import backend.osiris.entity.order.OrderCancellationReason;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface OrderCancellationReasonRepository extends JpaRepository<OrderCancellationReason, Long>,
        JpaSpecificationExecutor<OrderCancellationReason> {}
