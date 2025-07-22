package com.bankingSystem.coreBanking.controller;

import com.bankingSystem.coreBanking.Repository.AccountRepository1;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/account")
@CrossOrigin(origins = "http://localhost:5173")
public class AccountController1 {

    private final AccountRepository1 accountRepo;

    public AccountController1(AccountRepository1 accountRepo) {
        this.accountRepo = accountRepo;
    }

    @GetMapping("/{id}/balance")
    public ResponseEntity<Map<String, Object>> getBalance(@PathVariable Long id) {
        return accountRepo.findById(id)
                .map(acc -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("balance", acc.getBalance());
                    return ResponseEntity.ok(m);
                })
                .orElseGet(() -> {
                    Map<String, Object> err = new HashMap<>();
                    err.put("error", "Account not found");
                    return ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND)
                            .body(err);
                });
    }

}
