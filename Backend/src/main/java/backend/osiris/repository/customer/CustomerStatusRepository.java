package backend.osiris.repository.customer;

import backend.osiris.entity.customer.CustomerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CustomerStatusRepository extends JpaRepository<CustomerStatus, Long>, JpaSpecificationExecutor<CustomerStatus> {
}