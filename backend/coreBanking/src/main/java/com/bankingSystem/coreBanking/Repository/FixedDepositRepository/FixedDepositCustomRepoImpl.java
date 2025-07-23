package com.bankingSystem.coreBanking.Repository.FixedDepositRepository;

import com.bankingSystem.coreBanking.DTO.FixedDepositDTO.FixedDepositFilterRequestDTO;
import com.bankingSystem.coreBanking.Entity.FixedDeposit.FixedDeposit;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;

@Repository
public class FixedDepositCustomRepoImpl implements FixedDepositCustomRepo {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<FixedDeposit> filterFDs(FixedDepositFilterRequestDTO filter) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<FixedDeposit> cq = cb.createQuery(FixedDeposit.class);
        Root<FixedDeposit> root = cq.from(FixedDeposit.class);

        List<Predicate> predicates = new ArrayList<>();

        if (filter.getAccountId() != null) {
            predicates.add(cb.equal(root.get("account").get("accountId"), filter.getAccountId()));
        }

        if (filter.getStatus() != null) {
            predicates.add(cb.equal(root.get("status"), filter.getStatus()));
        }

        if (filter.getStartFrom() != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("startDate"), filter.getStartFrom().atStartOfDay()));
        }

        if (filter.getStartTo() != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("startDate"), filter.getStartTo().atTime(23, 59, 59)));
        }

        if (filter.getMaturityFrom() != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("maturityDate"), filter.getMaturityFrom().atStartOfDay()));
        }

        if (filter.getMaturityTo() != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("maturityDate"), filter.getMaturityTo().atTime(23, 59, 59)));
        }

        cq.where(predicates.toArray(new Predicate[0]));
        return em.createQuery(cq).getResultList();
    }
}
