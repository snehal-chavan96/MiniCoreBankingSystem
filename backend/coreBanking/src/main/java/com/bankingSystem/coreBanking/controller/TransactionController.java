package com.bankingSystem.coreBanking.controller;

import com.bankingSystem.coreBanking.dto.FundTransferDTO;
import com.bankingSystem.coreBanking.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService txnService;

    public TransactionController(TransactionService txnService) {
        this.txnService = txnService;
    }

    @PostMapping("/transfer")
    public ResponseEntity<String> transferFunds(@RequestBody FundTransferDTO dto) {
        try {
            txnService.transferFunds(dto);
            return ResponseEntity.ok("Transfer successful");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Transfer failed: " + e.getMessage());
        }
    }
}
