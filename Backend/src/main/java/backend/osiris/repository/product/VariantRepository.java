package backend.osiris.repository.product;

import backend.osiris.entity.inventory.DocketVariant;
import backend.osiris.entity.product.Variant;
import jakarta.persistence.criteria.Join;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface VariantRepository extends JpaRepository<Variant, Long>, JpaSpecificationExecutor<Variant> {

    default Page<Variant> findDocketedVariants(Pageable pageable) {
        Specification<Variant> spec = (root, query, cb) -> {
            Join<Variant, DocketVariant> docketVariant = root.join("docketVariants");

            query.distinct(true);
            query.orderBy(cb.desc(docketVariant.get("docket").get("id")));

            return query.getRestriction();
        };

        return findAll(spec, pageable);
    }

}