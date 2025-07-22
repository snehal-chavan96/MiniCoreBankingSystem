package com.bankingSystem.coreBanking.Service.TransactionService;

import com.bankingSystem.coreBanking.Entity.Transaction.Transaction;
import com.bankingSystem.coreBanking.Repository.TransactionRepo.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TransactionAnalyticsService {
    private final TransactionRepository transactionRepo;

    public TransactionAnalyticsService(TransactionRepository transactionRepo) {
        this.transactionRepo = transactionRepo;
    }

    public long getTotalTransactionCount() {
        return transactionRepo.count();
    }

    public long getTransactionCountByStatus(Transaction.TxnStatus status) {
        return transactionRepo.countByStatus(status);
    }

    public long getTransactionCountForAccount(String accountNumber) {
        return transactionRepo.countByFromAccount_AccountNumberOrToAccount_AccountNumber(accountNumber, accountNumber);
    }

    public List<Transaction> getTransactionsForAccount(String accountNumber) {
        return transactionRepo.findByFromAccount_AccountNumberOrToAccount_AccountNumber(accountNumber, accountNumber);
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepo.findAll();
    }

    public Map<String, Long> getTransactionSummary() {
        Map<String, Long> summary = new HashMap<>();
        summary.put("total", transactionRepo.count());
        summary.put("success", transactionRepo.countByStatus(Transaction.TxnStatus.SUCCESS));
        summary.put("failed", transactionRepo.countByStatus(Transaction.TxnStatus.FAILED));
        summary.put("pending", transactionRepo.countByStatus(Transaction.TxnStatus.PENDING));
        return summary;
    }
}
