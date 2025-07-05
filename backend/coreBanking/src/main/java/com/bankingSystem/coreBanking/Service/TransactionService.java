package com.bankingSystem.coreBanking.service;

import org.springframework.stereotype.Service;
import com.bankingSystem.coreBanking.DTO.FundTransferDTO;
import com.bankingSystem.coreBanking.entity.Account;
import com.bankingSystem.coreBanking.entity.Transaction;
import com.bankingSystem.coreBanking.repository.AccountRepository;
import com.bankingSystem.coreBanking.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class TransactionService {

    @Autowired
    private AccountRepository accountRepo;

    @Autowired
    private TransactionRepository transactionRepo;

    @Transactional
    public void transferFunds(FundTransferDTO transferDTO) {
        Account from = accountRepo.findById(transferDTO.getFromAccountId())
                .orElseThrow(() -> new RuntimeException("Sender account not found"));

        Account to = accountRepo.findById(transferDTO.getToAccountId())
                .orElseThrow(() -> new RuntimeException("Receiver account not found"));

        BigDecimal amount = transferDTO.getAmount();

        if (from.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        // Deduct from sender
        from.setBalance(from.getBalance().subtract(amount));

        // Add to receiver
        to.setBalance(to.getBalance().add(amount));

        // Save accounts
        accountRepo.save(from);
        accountRepo.save(to);

        // Log transaction
        Transaction txn = new Transaction();
        txn.setFromAccount(from);
        txn.setToAccount(to);
        txn.setAmount(amount);
        txn.setTxnType(Transaction.TxnType.valueOf("INTERNAL_TRANSFER"));
        txn.setTxnTime(LocalDateTime.now());

        transactionRepo.save(txn);
    }
}
