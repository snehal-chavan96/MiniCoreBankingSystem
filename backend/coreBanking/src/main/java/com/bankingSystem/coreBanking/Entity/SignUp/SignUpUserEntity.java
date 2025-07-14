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

    @Column(name = "Answer", nullable = false)
    private String userAnswer;

    @Enumerated(EnumType.STRING)
    @Column(name = "SelectedQuestion", nullable = false)
    private QuestionLists questionLists;

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
    @Getter
    public enum QuestionLists{
        MOTHERS_MIDDLE_NAME("What is your mother's middle name?"),
        FIRST_PET_NAME("What is the name of your first pet?"),
        FIRST_HIGHSCHOOL_NAME("Where did you attend your first high school?"),
        CITY_YOU_GREW_UP("Where is the city where you grew up?"),
        CHILDHOOD_BOOK_NAME("What is your favourite childhood book title?");

        private final String question;

        QuestionLists(String question){
            this.question = question;
        }

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