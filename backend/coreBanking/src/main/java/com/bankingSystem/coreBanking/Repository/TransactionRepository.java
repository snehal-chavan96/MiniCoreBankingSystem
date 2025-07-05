package com.bankingSystem.coreBanking.repository;

import com.bankingSystem.coreBanking.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction,Long> {
}
