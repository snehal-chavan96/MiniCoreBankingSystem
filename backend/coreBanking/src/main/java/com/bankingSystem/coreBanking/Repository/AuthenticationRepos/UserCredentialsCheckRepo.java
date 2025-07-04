package com.bankingSystem.coreBanking.Repository.AuthenticationRepos;

import com.bankingSystem.coreBanking.Entity.SignUpUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserCredentialsCheckRepo extends JpaRepository<SignUpUserEntity, Long> {
    Boolean existsByUsername(String username);
}
