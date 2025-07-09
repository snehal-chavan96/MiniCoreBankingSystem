package com.bankingSystem.coreBanking.controller.AccountController;

import com.bankingSystem.coreBanking.DTO.AccountDTO;
import com.bankingSystem.coreBanking.Configuration.AddFundsRequest;
import com.bankingSystem.coreBanking.Entity.Account;
import com.bankingSystem.coreBanking.Service.AuthenticationServices.AccountService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/account")
//@AllArgsConstructor
@NoArgsConstructor
public class AccountController {
    @Autowired
    private AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/create")
    public ResponseEntity<AccountDTO> createAccount(@RequestBody AccountDTO accountDTO)
    {
        accountDTO.setAccountNumber("SBI"+System.currentTimeMillis());
        AccountDTO accountDTO1 = accountService.createAccount(accountDTO);
        return ResponseEntity.ok(accountDTO1);
    }

    @PutMapping("/addFunds")
    public ResponseEntity<Boolean> addFunds(@RequestBody AddFundsRequest addFundsRequest)
    {

        boolean x = accountService.addFunds(addFundsRequest.getAccountNumber(),addFundsRequest.getAmount());
        return ResponseEntity.ok(x);
    }

    @GetMapping("/viewbalance")
    public ResponseEntity<BigDecimal> viewBalance(@RequestBody Account account)
    {
        BigDecimal bal = accountService.viewBalance(account.getAccountNumber());
        return ResponseEntity.ok(bal);
    }

}