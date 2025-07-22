package com.bankingSystem.coreBanking.Service;

import com.bankingSystem.coreBanking.Entity.Account1;
import com.bankingSystem.coreBanking.Entity.Transaction;
import com.bankingSystem.coreBanking.Repository.AccountRepository1;
import com.bankingSystem.coreBanking.Repository.TransactionRepository;
import com.bankingSystem.coreBanking.DTO.FundTransferDTO;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class TransactionService {

    private final AccountRepository1 accountRepo;
    private final TransactionRepository transactionRepo;

    public TransactionService(AccountRepository1 accountRepo,
                              TransactionRepository transactionRepo) {
        this.accountRepo = accountRepo;
        this.transactionRepo = transactionRepo;
    }

    @Transactional
    public BigDecimal transferFunds(FundTransferDTO dto) {
        Account1 from = accountRepo.findByAccountNumber(dto.getFromAccountNumber())
                .orElseThrow(() -> new RuntimeException("Sender account not found"));

        Account1 to = accountRepo.findByAccountNumber(dto.getToAccountNumber())
                .orElseThrow(() -> new RuntimeException("Receiver account not found"));

        BigDecimal amount = dto.getAmount();
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be greater than zero");
        }
        if (from.getAccountNumber().equals(to.getAccountNumber())) {
            throw new RuntimeException("Cannot transfer to the same account");
        }
        if (from.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        // Update balances
        from.setBalance(from.getBalance().subtract(amount));
        to.setBalance(to.getBalance().add(amount));
        accountRepo.save(from);
        accountRepo.save(to);

        // Save transaction
        Transaction txn = new Transaction();
        txn.setFromAccount(from);
        txn.setToAccount(to);
        txn.setAmount(amount);
        txn.setTxnType(Transaction.TxnType.INTERNAL_TRANSFER);
        txn.setRemarks(dto.getRemarks());
        txn.setStatus(Transaction.TxnStatus.SUCCESS);
        txn.setTxnTime(LocalDateTime.now());
        transactionRepo.save(txn);

        return from.getBalance();
    }
}
