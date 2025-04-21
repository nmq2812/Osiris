package backend.osiris.repository.authentication;

import backend.osiris.dto.statistic.StatisticResource;
import backend.osiris.entity.authentication.User;
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
public class UserProjectionRepository {

    private EntityManager em;

    public List<StatisticResource> getUserCountByCreateDate() {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<StatisticResource> query = cb.createQuery(StatisticResource.class);

        Root<User> user = query.from(User.class);
        Expression<Instant> createdAtExpr = user.get("createdAt").as(Instant.class);

        query.select(cb.construct(
                StatisticResource.class,
                createdAtExpr,
                cb.count(user.get("id"))
        ));
        query.groupBy(createdAtExpr);
        query.orderBy(cb.asc(createdAtExpr));

        return em.createQuery(query).getResultList();
    }

}