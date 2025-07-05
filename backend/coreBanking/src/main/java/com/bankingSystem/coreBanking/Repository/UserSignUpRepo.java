package com.bankingSystem.coreBanking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bankingSystem.coreBanking.entity.SignUpUserEntity;
// This repo bydefault gives findAll() method which contains all the data present in table
@Repository
public interface UserSignUpRepo extends JpaRepository<SignUpUserEntity, Long> {
    SignUpUserEntity findByUsername (String username);
}
