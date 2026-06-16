-- Dropping table queries-- 
USE logindb;
DROP TABLE login_users;
DROP TABLE kyc_request;

-- Selecting table queries -- 
SELECT * FROM login_users;
SELECT * FROM kyc_request;
ALTER TABLE login_users DROP COLUMN selected_question;
DELETE selected_question FROM login_users;
SELECT * FROM account;
ALTER TABLE kyc_request MODIFY document_file LONGBLOB NOT NULL;
SELECT document_file FROM kyc_request WHERE kyc_id = 2;
CREATE DATABASE LoginDB;
CREATE DATABASE MergeDb;
CREATE DATABASE MergeSecondDB;
USE MergeDb;
SHOW CREATE TABLE login_users;
