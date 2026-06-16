package com.bankingSystem.coreBanking.controller.TransactionController;

import com.bankingSystem.coreBanking.DTO.TransactionDTOs.AdminTransactionDTO;
import com.bankingSystem.coreBanking.DTO.TransactionDTOs.FundTransferDTO;
import com.bankingSystem.coreBanking.DTO.TransactionDTOs.TransactionResponseDTO;
import com.bankingSystem.coreBanking.DTO.TransactionDTOs.TransferResponseDTO;
import com.bankingSystem.coreBanking.Entity.Transaction.Transaction;
import com.bankingSystem.coreBanking.Service.TransactionService.AdminTransactionService;
import com.bankingSystem.coreBanking.Service.TransactionService.TransactionAnalyticsService;
import com.bankingSystem.coreBanking.Service.TransactionService.TransactionService;
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
    private final AdminTransactionService adminTransactionService;

    public TransactionController(TransactionService transactionService, TransactionAnalyticsService transactionAnalyticsService, AdminTransactionService adminTransactionService) {
        this.transactionService = transactionService;
        this.transactionAnalyticsService = transactionAnalyticsService;
        this.adminTransactionService = adminTransactionService;
    }

    /*Transfer funds between accounts.
     */
    @PostMapping("/transfer")
    public ResponseEntity<?> transferFunds(@RequestBody FundTransferDTO dto) {
        try {
            log.info("[API] Initiating transfer DTO: from={}, to={}, amount={}",
                    dto.getFromAccountNumber(), dto.getToAccountNumber(), dto.getAmount());

            TransferResponseDTO resp = transactionService.transferFunds(dto);
            return ResponseEntity.ok(resp);

        } catch (IllegalArgumentException e) {
            log.warn("[API] Transfer failed (validation): {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "status", "failed",
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            log.error("[API] Unexpected error during transfer", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "failed",
                            "message", "Transfer failed due to server error."
                    ));
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


//    /* Fetch transactions for a specific account.
//     */
//    @GetMapping("/account/{accountNumber}")
//    public ResponseEntity<List<Transaction>> getTransactionsByAccount(@PathVariable String accountNumber) {
//        return ResponseEntity.ok(transactionAnalyticsService.getTransactionsForAccount(accountNumber));
//    }


    @GetMapping("/accounts/{accountNumber}")
    public List<TransactionResponseDTO> getTransactionsForAccount(@PathVariable String accountNumber) {
        return transactionService.getTransactionsForAccount(accountNumber);
    }

    @GetMapping("/admin/txnStmt")
    public ResponseEntity<List<AdminTransactionDTO>> listAll() {
        log.info("[API][ADMIN] List all admin transactions (DEBIT only)");
        return ResponseEntity.ok(adminTransactionService.getAdminTransactions());
    }
}
