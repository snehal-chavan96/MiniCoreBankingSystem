package com.bankingSystem.coreBanking.Repository.AccountRepository;

import com.bankingSystem.coreBanking.Entity.Accounts.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUser_UserId(Long userId);
    Account findByAccountNumber(String accountNumber);
    
}
