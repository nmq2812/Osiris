package backend.osiris.repository.employee;

import backend.osiris.entity.employee.JobLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface JobLevelRepository extends JpaRepository<JobLevel, Long>, JpaSpecificationExecutor<JobLevel> {
}