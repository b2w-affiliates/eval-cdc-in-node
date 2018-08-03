#!/bin/bash

CREATE DATABASE testdb CHARACTER SET utf8 COLLATE utf8_bin


CREATE TABLE `testdb`.`companies` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  `cnpj` VARCHAR(45) NULL);
)


CREATE USER 'events'@'localhost' IDENTIFIED BY 'events';

GRANT ALL PRIVILEGES ON * . * TO 'events'@'localhost';