package com.bankingSystem.coreBanking.Repository;

import com.bankingSystem.coreBanking.Entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction,Long> {
}
