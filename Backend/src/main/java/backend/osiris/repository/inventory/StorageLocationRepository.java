package backend.osiris.repository.inventory;

import backend.osiris.entity.inventory.StorageLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface StorageLocationRepository extends JpaRepository<StorageLocation, Long>, JpaSpecificationExecutor<StorageLocation> {}
