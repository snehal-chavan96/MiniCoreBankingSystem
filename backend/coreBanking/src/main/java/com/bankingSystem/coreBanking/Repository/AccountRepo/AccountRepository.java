package com.bankingSystem.coreBanking.Repository.AccountRepo;

import com.bankingSystem.coreBanking.DTO.AccountDTO;
import com.bankingSystem.coreBanking.Entity.Accounts.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUser_UserId(Long userId);
    Account findByAccountNumber(String accountNumber);
}
