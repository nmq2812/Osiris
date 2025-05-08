package backend.osiris.repository.order;

import backend.osiris.dto.statistic.StatisticResource;
import backend.osiris.entity.order.Order;
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
public class OrderProjectionRepository {

    private EntityManager em;

    public List<StatisticResource> getOrderCountByCreateDate() {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<StatisticResource> query = cb.createQuery(StatisticResource.class);

        Root<Order> order = query.from(Order.class);
        Expression<Instant> createdAtExpr = order.get("createdAt").as(Instant.class);

        query.select(cb.construct(
                StatisticResource.class,
                createdAtExpr,
                cb.count(order.get("id"))
        ));
        query.groupBy(createdAtExpr);
        query.orderBy(cb.asc(createdAtExpr));

        return em.createQuery(query).getResultList();
    }

}
