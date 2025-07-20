package com.bankingSystem.coreBanking.Service;

import com.bankingSystem.coreBanking.Entity.Account1;
import com.bankingSystem.coreBanking.Entity.Transaction;
import com.bankingSystem.coreBanking.Repository.AccountRepository1;
import com.bankingSystem.coreBanking.Repository.TransactionRepository;
import org.springframework.stereotype.Service;
import com.bankingSystem.coreBanking.DTO.FundTransferDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class TransactionService {

    @Autowired
    private AccountRepository1 accountRepo;

    @Autowired
    private TransactionRepository transactionRepo;

    @Transactional
    public void transferFunds(FundTransferDTO transferDTO) {
        Account1 from = accountRepo.findById(transferDTO.getFromAccountId())
                .orElseThrow(() -> new RuntimeException("Sender account not found"));

        Account1 to = accountRepo.findById(transferDTO.getToAccountId())
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
        txn.setRemarks(transferDTO.getRemarks());
        txn.setStatus(Transaction.TxnStatus.SUCCESS);
        txn.setTxnTime(LocalDateTime.now());

        transactionRepo.save(txn);
    }
}