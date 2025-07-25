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
        Account from = accountRepo.findByAccountNumber(dto.getFromAccountNumber())
                .orElseThrow(() -> new IllegalArgumentException("Sender account not found"));

        Account to = accountRepo.findByAccountNumber(dto.getToAccountNumber())
                .orElseThrow(() -> new IllegalArgumentException("Receiver account not found"));

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

        // DEBIT transaction for sender
        Transaction debitTxn = new Transaction();
        debitTxn.setFromAccount(from);
        debitTxn.setToAccount(to);
        debitTxn.setAmount(amount);
        debitTxn.setTxnType(Transaction.TxnType.DEBIT);
        debitTxn.setStatus(Transaction.TxnStatus.SUCCESS);
        debitTxn.setRemarks("Transferred to " + to.getAccountNumber() + ": " + dto.getRemarks());
        debitTxn.setTxnTime(LocalDateTime.now());
        transactionRepo.save(debitTxn);

        // CREDIT transaction for receiver
        Transaction creditTxn = new Transaction();
        creditTxn.setFromAccount(from);
        creditTxn.setToAccount(to);
        creditTxn.setAmount(amount);
        creditTxn.setTxnType(Transaction.TxnType.CREDIT);
        creditTxn.setStatus(Transaction.TxnStatus.SUCCESS);
        creditTxn.setRemarks("Received from " + from.getAccountNumber() + ": " + dto.getRemarks());
        creditTxn.setTxnTime(LocalDateTime.now());
        transactionRepo.save(creditTxn);

        // Update balances
        from.setBalance(from.getBalance().subtract(amount));
        to.setBalance(to.getBalance().add(amount));
        accountRepo.save(from);
        accountRepo.save(to);

        // Return the debit txn (or credit, or both if needed)
        return debitTxn;
    }

    public Optional<Transaction> getTransactionById(Long txnId) {
        return transactionRepo.findById(txnId);
    }


}
