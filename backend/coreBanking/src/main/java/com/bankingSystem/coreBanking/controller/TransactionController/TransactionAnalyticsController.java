package com.bankingSystem.coreBanking.controller.TransactionController;

import com.bankingSystem.coreBanking.Entity.Transaction.Transaction;
import com.bankingSystem.coreBanking.Service.TransactionService.TransactionAnalyticsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/transactions/analytics")
@CrossOrigin(origins = "*")
public class TransactionAnalyticsController {

    private static final Logger logger = LoggerFactory.getLogger(TransactionAnalyticsController.class);

    private final TransactionAnalyticsService analyticsService;

    public TransactionAnalyticsController(TransactionAnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Long>> getTransactionSummary() {
        logger.info("Fetching transaction summary");
        Map<String, Long> summary = analyticsService.getTransactionSummary();
        logger.info("Transaction summary fetched: {}", summary);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getTotalTransactionsCount() {
        logger.info("Fetching total transactions count");
        long totalCount = analyticsService.getTotalTransactionCount();
        logger.info("Total transactions count: {}", totalCount);
        return ResponseEntity.ok(Map.of("totalTransactions", totalCount));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Map<String, Long>> getTransactionCountByStatus(@PathVariable Transaction.TxnStatus status) {
        logger.info("Fetching transaction count for status: {}", status);
        long countByStatus = analyticsService.getTransactionCountByStatus(status);
        logger.info("Transaction count for status {}: {}", status, countByStatus);
        return ResponseEntity.ok(Map.of(status.name(), countByStatus));
    }
}
