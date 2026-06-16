# 💳 Mini Core Banking System

A full-stack banking application that simulates core banking operations such as account management, KYC verification, fund transfers, fixed deposits, loan processing, transaction analytics, and secure user authentication.

Built with a modern tech stack and designed to be deployment-ready using Docker and environment-based configuration.

---

## 🚀 Features

### 👤 User Management

* User Registration & Login
* JWT-based Authentication & Authorization
* Forgot Password & Account Recovery
* OTP Verification for Enhanced Security

### 🏦 Banking Operations

* Create and Manage Bank Accounts
* Fund Transfer Between Accounts
* View Transaction History
* Account Balance Tracking
* Monthly Statement Generation

### 📄 KYC Management

* KYC Form Submission
* Document Verification Workflow
* User Profile Management

### 💰 Fixed Deposits

* Create Fixed Deposits
* View FD Details & Statements
* Interest Calculation and Tracking

### 📈 Analytics & Reporting

* Transaction Analytics Dashboard
* User Financial Insights
* Admin Transaction Monitoring

### 🤖 Smart Features

* Banking Chatbot Assistance
* Online Payment Integration
* Automated Notifications & Email Services

### 🚢 Deployment & DevOps

* Dockerized Frontend & Backend
* Environment Variable (`.env`) Based Configuration
* Production-Ready Project Structure

---

## 🛠️ Tech Stack

### Backend

* Spring Boot
* Spring Security
* Spring Data JPA
* JWT Authentication
* MySQL
* Maven

### Frontend

* React.js
* Vite
* Axios
* React Router

### Database

* MySQL

### DevOps

* Docker
* Docker Compose
* Environment Variables (.env)

---

## 📂 Project Structure

```text
MiniCoreBankingSystem/
│
├── backend/
│   ├── Spring Boot APIs
│   ├── Security & Authentication
│   ├── Banking Services
│   └── Database Layer
│
├── frontend/
│   ├── React Application
│   ├── Banking Dashboard
│   ├── KYC & FD Modules
│   └── Analytics & Chatbot
│
└── Docker Configuration
```

## 🔒 Security Features

* JWT Authentication
* Protected API Endpoints
* Password Encryption
* OTP Verification
* Role-Based Access Control

---

## ⚙️ Getting Started

### Prerequisites

* Java 17+
* Node.js 18+
* MySQL
* Docker (Optional)

### Backend Setup

```bash
cd backend/coreBanking
mvn clean install
mvn spring-boot:run
```

### Frontend Setup

```bash
cd frontend/MiniCoreBankSystem
npm install
npm run dev
```

### Docker Setup

```bash
docker compose up --build
```

---

## 📸 Screenshots

Add screenshots of:

* Landing Page
* Dashboard
* KYC Module
* Fixed Deposit Module
* Analytics Dashboard
* Chatbot Interface

---

## 🎯 Future Enhancements

* Advanced Admin Dashboard
* SMS Notifications
* AI-Powered Financial Insights
* Multi-Bank Integration
* UPI Enhancements
* Automated Loan Approval Workflow

---

## 👨‍💻 Author

Developed as a full-stack banking application to demonstrate enterprise-level backend development, secure authentication, financial transaction handling, and modern deployment practices.
