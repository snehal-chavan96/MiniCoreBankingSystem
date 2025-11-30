package com.bankingSystem.coreBanking.Service.TransactionService;

import com.bankingSystem.coreBanking.DTO.TransactionDTOs.AdminTransactionDTO;
import com.bankingSystem.coreBanking.DTO.TransactionDTOs.FundTransferDTO;
import com.bankingSystem.coreBanking.DTO.TransactionDTOs.TransactionResponseDTO;
import com.bankingSystem.coreBanking.DTO.TransactionDTOs.TransferResponseDTO;
import com.bankingSystem.coreBanking.Entity.Accounts.Account;
import com.bankingSystem.coreBanking.Entity.Transaction.Transaction;
import com.bankingSystem.coreBanking.Repository.AccountRepository.AccountRepository;
import com.bankingSystem.coreBanking.Repository.TransactionRepo.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TransactionService {

    private final AccountRepository accountRepo;
    private final TransactionRepository transactionRepo;
    private final PasswordEncoder encoder; // if you want PIN validation

    String referenceId = "TXN" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 6);


    public TransactionService(AccountRepository accountRepo,
                              TransactionRepository transactionRepo,
                              PasswordEncoder encoder) {
        this.accountRepo = accountRepo;
        this.transactionRepo = transactionRepo;
        this.encoder = encoder;
    }

    @Transactional
    public TransferResponseDTO transferFunds(FundTransferDTO dto) {
        log.info("[TRANSFER] From={}, To={}, Amount={}", dto.getFromAccountNumber(), dto.getToAccountNumber(), dto.getAmount());

        Account from = accountRepo.findByAccountNumber(dto.getFromAccountNumber())
                .orElseThrow(() -> new IllegalArgumentException("Sender account not found"));
        Account to = accountRepo.findByAccountNumber(dto.getToAccountNumber())
                .orElseThrow(() -> new IllegalArgumentException("Receiver account not found"));

        BigDecimal amount = dto.getAmount();
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            log.warn("[TRANSFER] Invalid amount: {}", amount);
            throw new IllegalArgumentException("Amount must be greater than zero");
        }
        if (from.getAccountNumber().equals(to.getAccountNumber())) {
            log.warn("[TRANSFER] Same account transfer attempted: {}", from.getAccountNumber());
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }
        if (from.getBalance().compareTo(amount) < 0) {
            log.warn("[TRANSFER] Insufficient balance. From={}, Balance={}, Amount={}", from.getAccountNumber(), from.getBalance(), amount);
            throw new IllegalArgumentException("Insufficient balance");
        }

        // Generate a per-transfer reference id (shared by debit+credit)
        String referenceId = "TXN-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 6);

        LocalDateTime now = LocalDateTime.now();

        // Create DEBIT
        Transaction debitTxn = new Transaction();
        debitTxn.setFromAccount(from);
        debitTxn.setToAccount(to);
        debitTxn.setAmount(amount);
        debitTxn.setTxnType(Transaction.TxnType.DEBIT);
        debitTxn.setStatus(Transaction.TxnStatus.SUCCESS);
        debitTxn.setTransactionReferenceId(referenceId);
        debitTxn.setRemarks("Transferred to " + to.getAccountNumber() + ": " + dto.getRemarks());
        debitTxn.setTxnTime(now);
        transactionRepo.save(debitTxn);

        // Create CREDIT
        Transaction creditTxn = new Transaction();
        creditTxn.setFromAccount(from);
        creditTxn.setToAccount(to);
        creditTxn.setAmount(amount);
        creditTxn.setTxnType(Transaction.TxnType.CREDIT);
        creditTxn.setStatus(Transaction.TxnStatus.SUCCESS);
        creditTxn.setTransactionReferenceId(referenceId);
        creditTxn.setRemarks("Received from " + from.getAccountNumber() + ": " + dto.getRemarks());
        creditTxn.setTxnTime(now);
        transactionRepo.save(creditTxn);

        // Update balances
        from.setBalance(from.getBalance().subtract(amount));
        to.setBalance(to.getBalance().add(amount));
        accountRepo.save(from);
        accountRepo.save(to);

        log.info("[TRANSFER] Success. Ref={}, DebitTxnId={}, CreditTxnId={}", referenceId, debitTxn.getTxnId(), creditTxn.getTxnId());

        // Build safe response DTO (no nested accounts/users)
        return TransferResponseDTO.builder()
                .referenceId(referenceId)
                .status(debitTxn.getStatus().name())
                .amount(amount)
                .fromAccountNumber(from.getAccountNumber())
                .toAccountNumber(to.getAccountNumber())
                .debitTxnId(debitTxn.getTxnId())
                .creditTxnId(creditTxn.getTxnId())
                .txnTime(now)
                .build();
    }


    public Optional<Transaction> getTransactionById(Long txnId) {
        return transactionRepo.findById(txnId);
    }

    public List<TransactionResponseDTO> getTransactionsForAccount(String accountNumber) {
        List<Transaction> allRelatedTxns = transactionRepo.findRelevantTransactions(accountNumber);

        return allRelatedTxns.stream()
                .filter(txn -> {
                    if (txn.getFromAccount().getAccountNumber().equals(accountNumber)) {
                        return txn.getTxnType() == Transaction.TxnType.DEBIT;
                    } else if (txn.getToAccount().getAccountNumber().equals(accountNumber)) {
                        return txn.getTxnType() == Transaction.TxnType.CREDIT;
                    }
                    return false;
                })
                .map(txn -> {
                    TransactionResponseDTO dto = new TransactionResponseDTO();
                    dto.setTxnId(txn.getTxnId());
                    dto.setType(txn.getTxnType().name());
                    dto.setStatus(txn.getStatus().name());
                    dto.setAmount(txn.getAmount());
                    dto.setTxnTime(txn.getTxnTime());
                    dto.setRemarks(txn.getRemarks());
                    dto.setReferenceId(txn.getTransactionReferenceId());


                    if (txn.getTxnType() == Transaction.TxnType.DEBIT) {
                        dto.setCounterpartyAccount(txn.getToAccount().getAccountNumber());
                    } else {
                        dto.setCounterpartyAccount(txn.getFromAccount().getAccountNumber());
                    }

                    return dto;
                })
                .collect(Collectors.toList());

    }
}