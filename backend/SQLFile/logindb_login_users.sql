-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: logindb
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `login_users`
--

DROP TABLE IF EXISTS `login_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email_id` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `hash_password` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `selected_question` enum('MOTHERS_MIDDLE_NAME','FIRST_PET_NAME','FIRST_HIGHSCHOOL_NAME','CITY_YOU_GREW_UP','CHILDHOOD_BOOK_NAME') NOT NULL,
  `role` enum('ADMIN','USER') NOT NULL,
  `status` enum('INACTIVE','ACTIVE','BLOCKED') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `answer` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `question_lists` enum('MOTHERS_MIDDLE_NAME','FIRST_PET_NAME','FIRST_HIGHSCHOOL_NAME','CITY_YOU_GREW_UP','CHILDHOOD_BOOK_NAME') NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UK_7p4no4ol1yg2u71bxqme1fhre` (`email_id`),
  UNIQUE KEY `UK_5hhw3gx3td4k1gmmqk1emjgy0` (`phone_number`),
  UNIQUE KEY `UK_niit304xfekfcto33il61l7ok` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_users`
--

LOCK TABLES `login_users` WRITE;
/*!40000 ALTER TABLE `login_users` DISABLE KEYS */;
INSERT INTO `login_users` VALUES (1,'2025-07-19 14:14:53.893654','harisharmams9890@gmail.com','Hari Manojkumar Sharma','$2a$12$ch3lNGr8Vz8kPTYxyIKBIeWyb9x7q1fClRsmFZd828tjj94BLsPNm','9421083455','MOTHERS_MIDDLE_NAME','USER','ACTIVE','2025-07-19 14:15:44.541960','Shalini','HariSharma@9421','MOTHERS_MIDDLE_NAME'),(2,'2025-07-19 14:18:49.330477','demo@demo.com','Demo User','$2a$12$qomszCtUem7hPjWh5uInm.WEMBEqbo4SvIFn3jUgxA.WhFgf/P5ci','8888888888','MOTHERS_MIDDLE_NAME','USER','INACTIVE','2025-07-19 14:18:49.330477','demo pet','demo_123','FIRST_PET_NAME'),(3,'2025-07-19 14:22:44.474517','harrypotter@gmail.com','Harry Potter','$2a$12$nllIknSySPi92fR/wd9cvu919E5l5dwidN7wQaUwvLZFMC9mYB5wS','9954512144','MOTHERS_MIDDLE_NAME','USER','INACTIVE','2025-07-19 14:22:44.474517','Hogwarts','harry_potter45','FIRST_HIGHSCHOOL_NAME');
/*!40000 ALTER TABLE `login_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-19 17:52:47
