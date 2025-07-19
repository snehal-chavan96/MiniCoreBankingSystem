-- Dropping table queries-- 
USE logindb;
DROP TABLE login_users;
DROP TABLE kyc_request;

-- Selecting table queries -- 
SELECT * FROM login_users;
SELECT * FROM kyc_request;

ALTER TABLE kyc_request MODIFY document_file LONGBLOB NOT NULL;

CREATE DATABASE LoginDB;