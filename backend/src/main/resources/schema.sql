CREATE SCHEMA IF NOT EXISTS HackGT;

SET NAMES 'UTF8MB4';

USE HackGT;

-- drop tables if they exist
DROP TABLE IF EXISTS Users;


-- create tables

CREATE TABLE Users (

       id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
       first_name VARCHAR(50) NOT NULL,
       last_name VARCHAR(50) NOT NULL,
       email VARCHAR(100) NOT NULL,
       password VARCHAR(255) NOT NULL,
       CONSTRAINT UQ_Users_EmailU UNIQUE (email)
);

















