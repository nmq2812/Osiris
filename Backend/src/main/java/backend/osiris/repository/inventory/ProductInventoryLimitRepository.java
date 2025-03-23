package backend.osiris.repository.inventory;

import backend.osiris.entity.inventory.ProductInventoryLimit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProductInventoryLimitRepository extends JpaRepository<ProductInventoryLimit, Long>,
        JpaSpecificationExecutor<ProductInventoryLimit> {}
