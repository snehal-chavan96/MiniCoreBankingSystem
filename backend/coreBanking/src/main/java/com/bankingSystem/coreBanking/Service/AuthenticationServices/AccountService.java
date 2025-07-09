package com.bankingSystem.coreBanking.Service.AuthenticationServices;

import com.bankingSystem.coreBanking.DTO.AccountDTO;
import com.bankingSystem.coreBanking.Entity.Account;

import java.math.BigDecimal;

public interface AccountService {
    AccountDTO createAccount(AccountDTO accountDTO);
    boolean addFunds(String accountNumber, BigDecimal amount);
    BigDecimal viewBalance(String accNo);
}
