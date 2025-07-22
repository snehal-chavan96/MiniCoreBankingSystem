package com.bankingSystem.coreBanking.controller.TransactionController;

import com.bankingSystem.coreBanking.DTO.FundTransferDTO;
import com.bankingSystem.coreBanking.Entity.Transactions.Transaction;
import com.bankingSystem.coreBanking.Service.TransactionsService.TransactionAnalyticsService;
import com.bankingSystem.coreBanking.Service.TransactionsService.TransactionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService transactionService;
    private final TransactionAnalyticsService transactionAnalyticsService;

    public TransactionController(TransactionService transactionService, TransactionAnalyticsService transactionAnalyticsService) {
        this.transactionService = transactionService;
        this.transactionAnalyticsService = transactionAnalyticsService;
    }

    /*Transfer funds between accounts.
     */
    @PostMapping("/transfer")
    public ResponseEntity<?> transferFunds(@RequestBody FundTransferDTO dto) {
        try {
            log.info("Initiating transfer: {}", dto);
            Transaction txn = transactionService.transferFunds(dto);
            return ResponseEntity.ok(txn);
        } catch (IllegalArgumentException e) {
            log.error("Transfer failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "status", "failed",
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            log.error("Unexpected error during transfer", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Transfer failed due to server error.");
        }
    }

    /* Fetch all transactions.
     */
    @GetMapping("/all")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionAnalyticsService.getAllTransactions());
    }

    /* Fetch a specific transaction by ID.
     */
    @GetMapping("/{txnId}")
    public ResponseEntity<?> getTransactionById(@PathVariable Long txnId) {
        var optTxn = transactionService.getTransactionById(txnId); // Optional<Transaction>
        if (optTxn.isPresent()) {
            return ResponseEntity.ok(optTxn.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Transaction not found.");
    }


     /* Fetch transactions for a specific account.
     */
    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<List<Transaction>> getTransactionsByAccount(@PathVariable String accountNumber) {
        return ResponseEntity.ok(transactionAnalyticsService.getTransactionsForAccount(accountNumber));
    }
}
