package com.bankingSystem.coreBanking.Repository;

import com.bankingSystem.coreBanking.Entity.SignUpUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
// This repo bydefault gives findAll() method which contains all the data present in table
@Repository
public interface UserSignUpRepo extends JpaRepository<SignUpUserEntity, Long> {
    SignUpUserEntity findByUsername (String username);
}
