package com.bankingSystem.coreBanking.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
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

    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @Pattern(regexp = "^\\d{10}$", message = "Invalid phone number")
    @Column(nullable = false)
    private String phoneNo;


    public enum Role {
        ADMIN, USER
    }

    public enum Status {
        ACTIVE, BLOCKED
    }
}
