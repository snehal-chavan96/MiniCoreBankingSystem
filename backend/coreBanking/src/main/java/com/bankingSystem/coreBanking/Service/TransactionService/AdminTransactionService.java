package com.bankingSystem.coreBanking.Service.TransactionService;

import com.bankingSystem.coreBanking.DTO.TransactionDTOs.AdminTransactionDTO;
import com.bankingSystem.coreBanking.Entity.Transaction.Transaction;
import com.bankingSystem.coreBanking.Repository.TransactionRepo.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminTransactionService {

    private final TransactionRepository transactionRepo;

    // --- Simple list (no paging) ---
    public List<AdminTransactionDTO> getAdminTransactions() {
        log.info("[ADMIN] Fetching all DEBIT transactions for admin view");
        List<Transaction> txns =
                transactionRepo.findAllForAdmin(Transaction.TxnType.DEBIT);

        return txns.stream().map(t -> AdminTransactionDTO.builder()
                .referenceId(t.getTransactionReferenceId())
                .fromAccount(t.getFromAccount().getAccountNumber())
                .toAccount(t.getToAccount().getAccountNumber())
                .amount(t.getAmount())
                .status(t.getStatus().name())
                .txnTime(t.getTxnTime())
                .build()
        ).toList();
    }


}
