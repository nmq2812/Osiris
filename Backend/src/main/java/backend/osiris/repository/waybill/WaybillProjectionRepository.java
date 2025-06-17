package backend.osiris.repository.waybill;

import backend.osiris.dto.statistic.StatisticResource;
import backend.osiris.entity.waybill.Waybill;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
@AllArgsConstructor
public class WaybillProjectionRepository {

    private EntityManager em;

    public List<StatisticResource> getWaybillCountByCreateDate() {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<StatisticResource> query = cb.createQuery(StatisticResource.class);

        Root<Waybill> waybill = query.from(Waybill.class);
        Expression<Instant> createdAtExpr = waybill.get("createdAt").as(Instant.class);

        query.select(cb.construct(
                StatisticResource.class,
                createdAtExpr,
                cb.count(waybill.get("id"))
        ));
        query.groupBy(createdAtExpr);
        query.orderBy(cb.asc(createdAtExpr));

        return em.createQuery(query).getResultList();
    }

}
