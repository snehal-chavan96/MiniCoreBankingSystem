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
  `full_name` varchar(255) NOT NULL,
  `hash_password` varchar(255) NOT NULL,
  `role` enum('ADMIN','USER') NOT NULL,
  `status` enum('ACTIVE','BLOCKED') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UK_niit304xfekfcto33il61l7ok` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_users`
--

LOCK TABLES `login_users` WRITE;
/*!40000 ALTER TABLE `login_users` DISABLE KEYS */;
INSERT INTO `login_users` VALUES (3,'2025-07-03 01:55:25.128856','Krushna Purushottam Sharma','$2a$12$/X1WyqXZPgvBjk0wendwauuZ2mvOS5r5FQtNG3WVGx5t9WSXrCMq6','USER','ACTIVE','2025-07-03 01:55:25.129862','KrushnaSharma921'),(4,'2025-07-03 11:28:05.364179','Nakshatra Ravindra Patil','$2a$12$xPdkxUOPan7CEAyx/pM/ke4JBb0c23BOBB8ZWHRQI.7Y18xIQq2Dm','USER','ACTIVE','2025-07-03 11:28:05.364179','NakshatraPatil934'),(5,'2025-07-03 12:25:56.949548','Hari Manojkumar Sharma','$2a$12$adzc.Ws/NrpoXQGJj27JWuzpqlpiSNEAImPksnUWdzxRqWGT51sKK','ADMIN','ACTIVE','2025-07-03 12:25:56.949548','HarrySharma9421'),(6,'2025-07-03 18:13:36.342365','Hari Sharma','$2a$12$8wBVrGE6MD7XY/jOKbDtJOPSFhkWkW0DSZX5/rI/3o2jKCyIG3QuG','USER','ACTIVE','2025-07-03 18:13:36.342365','ha'),(7,'2025-07-03 18:15:06.820355','Bhagyalaxmi Manojkumar Sharma','$2a$12$5olJmxc/woSBSXeI5dQEuuDoKoc.F.Yf3sJOTWV7m2rHy6Ia6VpR.','USER','ACTIVE','2025-07-03 18:15:06.820355','bhagyalaxmiSharma9890'),(10,'2025-07-03 19:01:09.660745','Krishna Vasudev Hare','$2a$12$MKxRX.5qURQVihVxEmfINu/doBT.MCmishqUkbCqwcgT8hEGP.5fu','USER','ACTIVE','2025-07-03 19:01:09.660745','NarayanLaxmi@24'),(11,'2025-07-03 22:49:17.202536','Vinay Meet Baviskar','$2a$12$7oZKf1UPDSAmvoW4/uY.puhlenYB8R3Djd50SwNuFdqPzhADRxl2S','USER','BLOCKED','2025-07-03 22:49:17.202536','VinayBaviskar88');
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

-- Dump completed on 2025-07-03 23:01:22
