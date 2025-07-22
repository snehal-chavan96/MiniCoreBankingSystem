package com.bankingSystem.coreBanking.Repository;

import com.bankingSystem.coreBanking.Entity.Transactions.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction,Long> {
    List<Transaction> findByFromAccount_AccountNumberOrToAccount_AccountNumber(
            String fromAccountNumber,
            String toAccountNumber
    );
    // Count all transactions
    long count();

    // Count transactions by status
    long countByStatus(Transaction.TxnStatus status);


    // Count transactions by account number (per user)
    long countByFromAccount_AccountNumberOrToAccount_AccountNumber(String accNo1, String accNo2);

}
