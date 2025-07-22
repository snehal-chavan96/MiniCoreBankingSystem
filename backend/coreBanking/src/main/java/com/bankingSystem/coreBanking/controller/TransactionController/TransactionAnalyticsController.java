package com.bankingSystem.coreBanking.controller.TransactionController;

import com.bankingSystem.coreBanking.Entity.Transaction.Transaction;
import com.bankingSystem.coreBanking.Service.TransactionService.TransactionAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/transactions/analytics")
@CrossOrigin(origins = "*")
public class TransactionAnalyticsController {

    private final TransactionAnalyticsService analyticsService;

    public TransactionAnalyticsController(TransactionAnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Long>> getTransactionSummary() {
        return ResponseEntity.ok(analyticsService.getTransactionSummary());
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getTotalTransactionsCount() {
        return ResponseEntity.ok(Map.of("totalTransactions", analyticsService.getTotalTransactionCount()));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Map<String, Long>> getTransactionCountByStatus(@PathVariable Transaction.TxnStatus status) {
        return ResponseEntity.ok(Map.of(status.name(), analyticsService.getTransactionCountByStatus(status)));
    }
}
