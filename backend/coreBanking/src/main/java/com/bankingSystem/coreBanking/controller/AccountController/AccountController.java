package com.bankingSystem.coreBanking.controller.AccountController;


import com.bankingSystem.coreBanking.DTO.AccountDTO;
import com.bankingSystem.coreBanking.Entity.Accounts.Account;
import com.bankingSystem.coreBanking.Service.AccountsService.AccountService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.logging.Logger;
@Slf4j
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/accounts")
public class AccountController {


    @Autowired
    private AccountService accountService;

    @PostMapping("/create")
    public ResponseEntity<AccountDTO> createAccount(@RequestBody AccountDTO accountDTO)
    {
        log.info("Creating an account!!");
        AccountDTO accountDTO1 = new AccountDTO();
        try {
            accountDTO.setOpenedAt(LocalDate.now());
            accountDTO.setClosedAt(LocalDate.now().plusYears(10));
            accountDTO.setAccountNumber("FCX"+System.currentTimeMillis());
            accountDTO1 = accountService.createAccount(accountDTO);
            log.info("Account Created!!");
        } catch (Exception e) {
            System.out.println(e);
            log.info("Failed to create an account!!");
        }

        return ResponseEntity.ok(accountDTO1);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<Account>> getAccounts(@PathVariable Long id)
    {
        List<Account> accounts = accountService.getAccounts(id);
        return ResponseEntity.ok(accounts);
    }

}
