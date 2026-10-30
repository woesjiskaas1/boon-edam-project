-- Active: 1756798286170@@127.0.0.1@3306@bit_lyceum
USE test_db;

CREATE TABLE IF NOT EXISTS employee (
    employee_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_number VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NULL,
    country VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    department VARCHAR(150) NOT NULL,
    employment_status VARCHAR(50) NOT NULL,
    hire_date DATE NOT NULL,
    adress VARCHAR(255) NULL,
    phone VARCHAR(20) NULL
);

CREATE TABLE IF NOT EXISTS certificate_type (
    certificate_type_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NULL,
    validity_period_months INT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS employee_certificate (
    employee_certificate_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    certificate_type_id BIGINT UNSIGNED NOT NULL,
    certificate_number VARCHAR(100) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (certificate_type_id) REFERENCES certificate_type(certificate_type_id)
);

CREATE TABLE IF NOT EXISTS training (
    training_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT NULL,
    provider VARCHAR(200) NULL,
    completion_date DATE NULL,
    valid_until DATE NULL,
    status VARCHAR(50) NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

CREATE TABLE IF NOT EXISTS employee_skill (
    employee_skill_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    skill_id BIGINT UNSIGNED NOT NULL,
    skill_level SMALLINT NOT NULL CHECK (skill_level BETWEEN 1 AND 5),
    origin VARCHAR(50) NOT NULL,
    assigned_date DATE NOT NULL,
    certification_date DATE NULL,
    valid_until DATE NULL,
    notes TEXT NULL,
    UNIQUE (employee_id, skill_id),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

CREATE TABLE IF NOT EXISTS `file` (
    file_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    employee_certificate_id BIGINT UNSIGNED NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_location VARCHAR(500) NOT NULL,
    upload_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description TEXT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (employee_certificate_id)
        REFERENCES employee_certificate(employee_certificate_id)
);


INSERT INTO employee (employee_number, first_name, last_name, email, country, location, department, employment_status, hire_date, adress, phone) VALUES
('1', 'John', 'Doe', 'john.doe@example.com', 'USA', 'New York', 'Engineering', 'Full-time', '2023-01-15', '123 Main St', '555-1234'),
('2', 'Jane', 'Smith', 'jane.smith@example.com', 'USA', 'Los Angeles', 'Marketing', 'Full-time', '2023-02-20', '456 Oak Ave', '555-5678')
ON DUPLICATE KEY UPDATE
    adress = COALESCE(adress, VALUES(adress)),
    phone = COALESCE(phone, VALUES(phone));