package com.bankingSystem.coreBanking.Entity.SignUp;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "login_users") // better SQL naming convention
public class SignUpUserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userId;

    @Column(name = "phone_number", nullable = false, unique = true)
    private String phoneNumber;

    @Column(name = "email_id", nullable = false, unique = true)
    private String emailId;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(name = "hash_password", nullable = false)
    private String hashPassword;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "answer", nullable = false)
    private String userAnswer;

    @Enumerated(EnumType.STRING)
    @Column(name = "questionLists", nullable = false)
    private QuestionLists questionLists;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Set default status to INACTIVE on object creation
    public SignUpUserEntity() {
        this.status = Status.INACTIVE;
    }

    public enum Role {
        ADMIN, USER
    }

    public enum Status {
        INACTIVE, ACTIVE, BLOCKED
    }

    @Getter
    public enum QuestionLists {
        MOTHERS_MIDDLE_NAME("What is your mother's middle name?"),
        FIRST_PET_NAME("What is the name of your first pet?"),
        FIRST_HIGHSCHOOL_NAME("Where did you attend your first high school?"),
        CITY_YOU_GREW_UP("Where is the city where you grew up?"),
        CHILDHOOD_BOOK_NAME("What is your favourite childhood book title?");

        private final String question;

        QuestionLists(String question) {
            this.question = question;
        }
    }
}
