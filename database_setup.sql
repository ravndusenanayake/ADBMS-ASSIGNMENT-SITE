/*
--------------------------------------------------------------------------------
Script Name    : database_setup.sql
Project        : LumiSmile Dental Care - Dental Management System
Expert Level   : Advanced Database Management Systems (3NF Normalized)
Target DBMS    : Microsoft SQL Server (T-SQL)
Description    : This script initializes the database schema, relationships, 
                 triggers, and dummy data for LumiSmile Dental Care.
--------------------------------------------------------------------------------
*/

-- 1. DATABASE INITIALIZATION
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'LumiSmileDB')
BEGIN
    CREATE DATABASE LumiSmileDB;
END
GO

USE LumiSmileDB;
GO

-- 2. TABLE CREATION (3NF NORMALIZED)

-- Table: Person (Base entity for subtyping Patients and Dentists)
IF OBJECT_ID('Person', 'U') IS NOT NULL DROP TABLE Person;
CREATE TABLE Person (
    Person_ID INT PRIMARY KEY IDENTITY(1,1),
    First_Name VARCHAR(50) NOT NULL,
    Last_Name VARCHAR(50) NOT NULL,
    NIC VARCHAR(15) UNIQUE NOT NULL,
    Contact_Number VARCHAR(15),
    Address VARCHAR(255),
    Person_Type VARCHAR(20) NOT NULL CHECK (Person_Type IN ('Patient', 'Dentist'))
);

-- Table: Patient (Specialization of Person)
IF OBJECT_ID('Patient', 'U') IS NOT NULL DROP TABLE Patient;
CREATE TABLE Patient (
    Patient_ID INT PRIMARY KEY,
    Date_of_Birth DATE NOT NULL,
    Blood_Group VARCHAR(5),
    Allergies VARCHAR(MAX),
    CONSTRAINT FK_Patient_Person FOREIGN KEY (Patient_ID) REFERENCES Person(Person_ID) ON DELETE CASCADE
);

-- Table: Dentist (Specialization of Person)
IF OBJECT_ID('Dentist', 'U') IS NOT NULL DROP TABLE Dentist;
CREATE TABLE Dentist (
    Dentist_ID INT PRIMARY KEY,
    SLMC_Reg_No VARCHAR(20) UNIQUE NOT NULL,
    Specialization VARCHAR(100),
    CONSTRAINT FK_Dentist_Person FOREIGN KEY (Dentist_ID) REFERENCES Person(Person_ID) ON DELETE CASCADE
);

-- Table: Appointment
IF OBJECT_ID('Appointment', 'U') IS NOT NULL DROP TABLE Appointment;
CREATE TABLE Appointment (
    Appointment_ID INT PRIMARY KEY IDENTITY(1,1),
    Date DATE NOT NULL,
    Time TIME NOT NULL,
    Status VARCHAR(20) DEFAULT 'Pending' CHECK (Status IN ('Pending', 'Completed', 'Cancelled')),
    Patient_ID INT NOT NULL,
    Dentist_ID INT NOT NULL,
    CONSTRAINT FK_Appointment_Patient FOREIGN KEY (Patient_ID) REFERENCES Patient(Patient_ID),
    CONSTRAINT FK_Appointment_Dentist FOREIGN KEY (Dentist_ID) REFERENCES Dentist(Dentist_ID)
);

-- Table: Treatment
IF OBJECT_ID('Treatment', 'U') IS NOT NULL DROP TABLE Treatment;
CREATE TABLE Treatment (
    Treatment_ID INT PRIMARY KEY IDENTITY(1,1),
    Treatment_Name VARCHAR(100) NOT NULL,
    Base_Price DECIMAL(10, 2) NOT NULL
);

-- Table: Appointment_Treatment (Junction table for M:N relation)
IF OBJECT_ID('Appointment_Treatment', 'U') IS NOT NULL DROP TABLE Appointment_Treatment;
CREATE TABLE Appointment_Treatment (
    Appointment_ID INT NOT NULL,
    Treatment_ID INT NOT NULL,
    PRIMARY KEY (Appointment_ID, Treatment_ID),
    CONSTRAINT FK_AppTreat_Appointment FOREIGN KEY (Appointment_ID) REFERENCES Appointment(Appointment_ID),
    CONSTRAINT FK_AppTreat_Treatment FOREIGN KEY (Treatment_ID) REFERENCES Treatment(Treatment_ID)
);

-- Table: Payment
IF OBJECT_ID('Payment', 'U') IS NOT NULL DROP TABLE Payment;
CREATE TABLE Payment (
    Payment_ID INT PRIMARY KEY IDENTITY(1,1),
    Amount DECIMAL(10, 2) NOT NULL,
    Date DATE NOT NULL DEFAULT GETDATE(),
    Payment_Method VARCHAR(50),
    Appointment_ID INT UNIQUE NOT NULL, -- Unique constraint enforces 1:1 relationship
    CONSTRAINT FK_Payment_Appointment FOREIGN KEY (Appointment_ID) REFERENCES Appointment(Appointment_ID)
);
GO

-- 3. ADVANCED PROCESS: TRIGGER
/*
TRIGGER: trg_UpdateAppointmentStatus
Business Rule: When a payment is recorded for an appointment, the appointment 
status must automatically transition from 'Pending' to 'Completed'.
*/
IF OBJECT_ID('trg_UpdateAppointmentStatus', 'TR') IS NOT NULL DROP TRIGGER trg_UpdateAppointmentStatus;
GO
CREATE TRIGGER trg_UpdateAppointmentStatus
ON Payment
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Appointment
    SET Status = 'Completed'
    FROM Appointment A
    INNER JOIN inserted I ON A.Appointment_ID = I.Appointment_ID;
    
    PRINT 'Trigger Executed: Appointment status updated to Completed.';
END;
GO

-- 4. DUMMY DATA SEEDING (Functionality Proof)

-- I. Insert Persons
INSERT INTO Person (First_Name, Last_Name, NIC, Contact_Number, Address, Person_Type)
VALUES 
('John', 'Doe', '199012345678', '0771234567', 'No 45, Main Street, Colombo', 'Patient'),
('Jane', 'Smith', '199598765432', '0719876543', 'No 12, Kandy Road, Gampaha', 'Patient'),
('Dr. Amal', 'Perera', '198011223344', '0751122334', 'No 8, Ward Place, Colombo 7', 'Dentist');

-- II. Insert Specialized Data (Linking to Person IDs 1, 2, and 3)
INSERT INTO Patient (Patient_ID, Date_of_Birth, Blood_Group, Allergies)
VALUES 
(1, '1990-05-15', 'O+', 'Penicillin'),
(2, '1995-10-20', 'A-', 'None');

INSERT INTO Dentist (Dentist_ID, SLMC_Reg_No, Specialization)
VALUES 
(3, 'SLMC-98765', 'Orthodontist');

-- III. Insert Treatments
INSERT INTO Treatment (Treatment_Name, Base_Price)
VALUES 
('Dental Cleaning', 2500.00),
('Tooth Extraction', 5000.00),
('Root Canal', 15000.00);

-- IV. Insert 1 Appointment (Initial Status: 'Pending')
INSERT INTO Appointment (Date, Time, Status, Patient_ID, Dentist_ID)
VALUES 
(CAST(GETDATE() AS DATE), '10:00:00', 'Pending', 1, 3);

-- V. Link Treatment to Appointment
INSERT INTO Appointment_Treatment (Appointment_ID, Treatment_ID)
VALUES (1, 1);

-- VERIFICATION: Check status before payment
SELECT 'BEFORE PAYMENT' AS Test_Phase, Appointment_ID, Status FROM Appointment WHERE Appointment_ID = 1;

-- VI. Insert Payment (This triggers trg_UpdateAppointmentStatus)
INSERT INTO Payment (Amount, Date, Payment_Method, Appointment_ID)
VALUES (2500.00, CAST(GETDATE() AS DATE), 'Cash', 1);

-- FINAL VERIFICATION: Check if status updated to 'Completed'
SELECT 'AFTER PAYMENT' AS Test_Phase, Appointment_ID, Status FROM Appointment WHERE Appointment_ID = 1;
GO
