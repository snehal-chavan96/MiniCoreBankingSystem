package com.bankingSystem.coreBanking.Service.AccountsService;

import com.bankingSystem.coreBanking.DTO.AccountDTO;
import com.bankingSystem.coreBanking.Entity.Accounts.Account;

import java.math.BigDecimal;
import java.util.List;

public interface AccountService {

    List<Account> getAccounts(Long userId);

    AccountDTO createAccount(AccountDTO accountDTO);

    BigDecimal getBalance(String accNo, String pin);  // <-- changed from Double to BigDecimal

}
