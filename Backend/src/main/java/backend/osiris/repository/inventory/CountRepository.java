package backend.osiris.repository.inventory;

import backend.osiris.entity.inventory.Count;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CountRepository extends JpaRepository<Count, Long>, JpaSpecificationExecutor<Count> {}
