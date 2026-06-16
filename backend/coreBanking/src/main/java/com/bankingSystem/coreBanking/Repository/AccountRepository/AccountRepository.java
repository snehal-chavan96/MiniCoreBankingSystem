package com.bankingSystem.coreBanking.Repository.AccountRepository;

import com.bankingSystem.coreBanking.Entity.Accounts.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUser_UserId(Long userId);
    Optional<Account> findByAccountNumber(String accountNumber);

}
