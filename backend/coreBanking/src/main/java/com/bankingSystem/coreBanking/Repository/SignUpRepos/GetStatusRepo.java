package com.bankingSystem.coreBanking.Repository.SignUpRepos;

import com.bankingSystem.coreBanking.Entity.SignUp.SignUpUserEntity;
import com.bankingSystem.coreBanking.Entity.SignUp.SignUpUserEntity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GetStatusRepo extends JpaRepository<SignUpUserEntity, Long> {

    @Query("SELECT s.status FROM SignUpUserEntity s WHERE s.username = :username")
    Status getStatusByUsername(@Param("username") String username);
}
