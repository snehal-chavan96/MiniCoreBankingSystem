package com.bankingSystem.coreBanking.repository;

import com.bankingSystem.coreBanking.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account,Long> {
}
