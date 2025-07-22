package com.bankingSystem.coreBanking.controller;

import com.bankingSystem.coreBanking.DTO.FundTransferDTO;
import com.bankingSystem.coreBanking.Service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    private final TransactionService txnService;

    public TransactionController(TransactionService txnService) {
        this.txnService = txnService;
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transferFunds(@RequestBody FundTransferDTO dto) {
        try {
            BigDecimal remainingBalance = txnService.transferFunds(dto);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Transfer successful",
                    "remainingBalance", remainingBalance
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }


}
