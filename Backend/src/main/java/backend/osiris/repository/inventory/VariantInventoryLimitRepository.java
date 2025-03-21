package backend.osiris.repository.inventory;

import backend.osiris.entity.inventory.VariantInventoryLimit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface VariantInventoryLimitRepository extends JpaRepository<VariantInventoryLimit, Long>,
        JpaSpecificationExecutor<VariantInventoryLimit> {}
