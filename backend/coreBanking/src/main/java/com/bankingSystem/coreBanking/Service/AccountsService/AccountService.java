package com.bankingSystem.coreBanking.Service.AccountsService;

import com.bankingSystem.coreBanking.DTO.AccountDTO;
import com.bankingSystem.coreBanking.Entity.Accounts.Account;

import java.util.List;

public interface AccountService {

    List<Account> getAccounts(Long userId);
    AccountDTO createAccount(AccountDTO accountDTO);
    Double getBalance(String accNo, String pin);

}
