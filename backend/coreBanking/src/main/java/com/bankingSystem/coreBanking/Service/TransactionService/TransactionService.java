package com.bankingSystem.coreBanking.Service.TransactionService;

import com.bankingSystem.coreBanking.DTO.TransactionDTOs.FundTransferDTO;
import com.bankingSystem.coreBanking.Entity.Accounts.Account;
import com.bankingSystem.coreBanking.Entity.Transaction.Transaction;
import com.bankingSystem.coreBanking.Repository.AccountRepository.AccountRepository;
import com.bankingSystem.coreBanking.Repository.TransactionRepo.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class TransactionService {

    private final AccountRepository accountRepo;
    private final TransactionRepository transactionRepo;
    private final PasswordEncoder encoder; // if you want PIN validation

    public TransactionService(AccountRepository accountRepo,
                              TransactionRepository transactionRepo,
                              PasswordEncoder encoder) {
        this.accountRepo = accountRepo;
        this.transactionRepo = transactionRepo;
        this.encoder = encoder;
    }

    @Transactional
    public Transaction transferFunds(FundTransferDTO dto) {
        // Load accounts (Optional-based repository recommended)
        Account from = accountRepo.findByAccountNumber(dto.getFromAccountNumber())
                .orElseThrow(() -> new IllegalArgumentException("Sender account not found"));
        Account to = accountRepo.findByAccountNumber(dto.getToAccountNumber())
                .orElseThrow(() -> new IllegalArgumentException("Receiver account not found"));

        // PIN check (uncomment if FundTransferDTO includes pin and you store hashed pin)
        /*
        if (!encoder.matches(dto.getPin(), from.getPin())) {
            throw new IllegalArgumentException("Incorrect PIN.");
        }
        */

        BigDecimal amount = dto.getAmount();
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }
        if (from.getAccountNumber().equals(to.getAccountNumber())) {
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }
        if (from.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient balance");
        }

        // Create txn as PENDING
        Transaction txn = new Transaction();
        txn.setFromAccount(from);
        txn.setToAccount(to);
        txn.setAmount(amount);
        txn.setTxnType(Transaction.TxnType.INTERNAL_TRANSFER);
        txn.setRemarks(dto.getRemarks());
        txn.setStatus(Transaction.TxnStatus.PENDING);
        txn.setTxnTime(LocalDateTime.now());
        transactionRepo.save(txn);

        // Apply balances
        from.setBalance(from.getBalance().subtract(amount));
        to.setBalance(to.getBalance().add(amount));
        accountRepo.save(from);
        accountRepo.save(to);

        // Mark SUCCESS & save
        txn.setStatus(Transaction.TxnStatus.SUCCESS);
        return transactionRepo.save(txn);
    }

    public Optional<Transaction> getTransactionById(Long txnId) {
        return transactionRepo.findById(txnId);
    }


}
