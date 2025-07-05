package com.bankingSystem.coreBanking.repository;

import com.bankingSystem.coreBanking.entity.SignUpUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserCredentialsCheckRepo extends JpaRepository<SignUpUserEntity, Long> {
    Boolean existsByUsername(String username);
}
