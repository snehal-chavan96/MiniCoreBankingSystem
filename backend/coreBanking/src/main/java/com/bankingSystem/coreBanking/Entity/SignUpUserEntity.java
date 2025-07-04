package com.bankingSystem.coreBanking.Entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "loginUsers")
public class SignUpUserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userId;

    @Column(nullable = false, unique = true)
    private String PhoneNumber;

    @Column(nullable = false, unique = true)
    private String EmailId;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String hashPassword;

    @Column(name = "FullName", nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    public enum Role {
        ADMIN, USER
    }

    public enum Status {
        ACTIVE, BLOCKED
    }
}



//{
// This is JSON to hit the AP request in postman for signup page
//        "phoneNumber": "9421083455",
//        "emailId": "harisharmams9890@gmail.com",
//        "username": "HariSharma@9421",
//        "hashPassword": "password",
//        "fullName": "Hari Manojkumar Sharma",
//        "role": "USER",
//        "status": "ACTIVE"
//}


// For Login Page
//{
//  "username" : "Username",
//  "password" : "Password"
// }