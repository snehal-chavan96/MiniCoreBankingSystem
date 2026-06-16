package com.bankingSystem.coreBanking.Repository.TransactionRepo;

import com.bankingSystem.coreBanking.Entity.Transaction.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction,Long> {

    long count();

    long countByStatus(Transaction.TxnStatus status);

    long countByFromAccount_AccountNumberOrToAccount_AccountNumber(String accNo1, String accNo2);
    @Query("SELECT t FROM Transaction t WHERE t.fromAccount.accountNumber = :accountNumber OR t.toAccount.accountNumber = :accountNumber")
    List<Transaction> findRelevantTransactions(@Param("accountNumber") String accountNumber);


    @Query("SELECT t FROM Transaction t " +
            "JOIN FETCH t.fromAccount fa " +
            "JOIN FETCH t.toAccount ta " +
            "WHERE t.txnType = :type " +
            "ORDER BY t.txnTime DESC")
    List<Transaction> findAllForAdmin(@Param("type") Transaction.TxnType type);


    @Query("SELECT t FROM Transaction t WHERE " +
            "(t.fromAccount.accountNumber = :accountNumber OR t.toAccount.accountNumber = :accountNumber) " +
            "AND t.txnTime BETWEEN :start AND :end")
    List<Transaction> findTransactionsForAccountInPeriod(
            @Param("accountNumber") String accountNumber,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );


}

