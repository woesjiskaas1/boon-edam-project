CREATE DATABASE IF NOT EXISTS test_db;
USE test_db;

CREATE TABLE IF NOT EXISTS employee (
    employee_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_number VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    country VARCHAR(100),
    location VARCHAR(100),
    department VARCHAR(100),
    employment_status VARCHAR(50),
    hire_date DATE,
    adress VARCHAR(255),
    phone VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS certificate_type (
    certificate_type_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    validity_period_months INT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS skill (
    skill_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS employee_certificate (
    employee_certificate_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    certificate_type_id BIGINT UNSIGNED NOT NULL,
    certificate_number VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    status VARCHAR(50),
    notes TEXT,
    UNIQUE (employee_id, certificate_type_id, certificate_number),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (certificate_type_id) REFERENCES certificate_type(certificate_type_id)
);

CREATE TABLE IF NOT EXISTS training (
    training_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    provider VARCHAR(255),
    completion_date DATE,
    valid_until DATE,
    status VARCHAR(50),
    UNIQUE (employee_id, name, provider),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

CREATE TABLE IF NOT EXISTS employee_skill (
    employee_skill_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    skill_id BIGINT UNSIGNED NOT NULL,
    skill_level INT CHECK (skill_level BETWEEN 1 AND 5),
    origin VARCHAR(100),
    assigned_date DATE,
    certification_date DATE,
    valid_until DATE,
    notes TEXT,
    UNIQUE (employee_id, skill_id),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (skill_id) REFERENCES skill(skill_id)
);

CREATE TABLE IF NOT EXISTS `file` (
    file_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    employee_certificate_id BIGINT UNSIGNED NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_location VARCHAR(500),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (employee_certificate_id) REFERENCES employee_certificate(employee_certificate_id)
);

INSERT INTO employee (
    employee_number, first_name, last_name, email, country,
    location, department, employment_status, hire_date, adress, phone
)
SELECT 'EMP001', 'John', 'Doe', 'john.doe@example.com', 'USA',
       'New York', 'Engineering', 'Full-time', '2023-01-15', '123 Main St', '555-1234'
WHERE NOT EXISTS (
    SELECT 1 FROM employee WHERE employee_number = 'EMP001'
);

INSERT INTO employee (
    employee_number, first_name, last_name, email, country,
    location, department, employment_status, hire_date, adress, phone
)
SELECT 'EMP002', 'Jane', 'Smith', 'jane.smith@example.com', 'USA',
       'Los Angeles', 'Marketing', 'Full-time', '2023-02-20', '456 Oak Ave', '555-5678'
WHERE NOT EXISTS (
    SELECT 1 FROM employee WHERE employee_number = 'EMP002'
);

INSERT INTO employee (
    employee_number, first_name, last_name, email, country,
    location, department, employment_status, hire_date, adress, phone
)
SELECT 'EMP003', 'Bob', 'Johnson', 'bob.johnson@example.com', 'USA',
       'Chicago', 'Sales', 'Part-time', '2023-03-10', '789 Pine Rd', '555-9012'
WHERE NOT EXISTS (
    SELECT 1 FROM employee WHERE employee_number = 'EMP003'
);

INSERT INTO certificate_type (
    name, description, validity_period_months, is_active
)
SELECT 'Safety Training', 'Workplace safety training', 12, TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM certificate_type WHERE name = 'Safety Training'
);

INSERT INTO certificate_type (
    name, description, validity_period_months, is_active
)
SELECT 'First Aid Certification', 'First aid certification', 24, TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM certificate_type WHERE name = 'First Aid Certification'
);

INSERT INTO certificate_type (
    name, description, validity_period_months, is_active
)
SELECT 'Project Management Professional', 'Project management certification', 36, TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM certificate_type WHERE name = 'Project Management Professional'
);

INSERT INTO skill (name, description)
SELECT 'Safety Protocols', 'Knowledge of workplace safety procedures'
WHERE NOT EXISTS (
    SELECT 1 FROM skill WHERE name = 'Safety Protocols'
);

INSERT INTO skill (name, description)
SELECT 'First Aid', 'Knowledge of first aid procedures'
WHERE NOT EXISTS (
    SELECT 1 FROM skill WHERE name = 'First Aid'
);

INSERT INTO skill (name, description)
SELECT 'Project Management', 'Knowledge of project management'
WHERE NOT EXISTS (
    SELECT 1 FROM skill WHERE name = 'Project Management'
);

INSERT INTO employee_certificate (
    employee_id, certificate_type_id, certificate_number,
    issue_date, expiry_date, status, notes
)
SELECT
    e.employee_id, ct.certificate_type_id, 'ST-001',
    '2023-01-20', '2024-01-20', 'Active', NULL
FROM employee e
JOIN certificate_type ct ON ct.name = 'Safety Training'
WHERE e.employee_number = 'EMP001'
AND NOT EXISTS (
    SELECT 1
    FROM employee_certificate ec
    WHERE ec.employee_id = e.employee_id
    AND ec.certificate_type_id = ct.certificate_type_id
    AND ec.certificate_number = 'ST-001'
);

INSERT INTO employee_certificate (
    employee_id, certificate_type_id, certificate_number,
    issue_date, expiry_date, status, notes
)
SELECT
    e.employee_id, ct.certificate_type_id, 'FA-002',
    '2023-02-25', '2025-02-25', 'Active', NULL
FROM employee e
JOIN certificate_type ct ON ct.name = 'First Aid Certification'
WHERE e.employee_number = 'EMP002'
AND NOT EXISTS (
    SELECT 1
    FROM employee_certificate ec
    WHERE ec.employee_id = e.employee_id
    AND ec.certificate_type_id = ct.certificate_type_id
    AND ec.certificate_number = 'FA-002'
);

INSERT INTO employee_certificate (
    employee_id, certificate_type_id, certificate_number,
    issue_date, expiry_date, status, notes
)
SELECT
    e.employee_id, ct.certificate_type_id, 'PMP-003',
    '2023-03-15', NULL, 'Active', NULL
FROM employee e
JOIN certificate_type ct ON ct.name = 'Project Management Professional'
WHERE e.employee_number = 'EMP003'
AND NOT EXISTS (
    SELECT 1
    FROM employee_certificate ec
    WHERE ec.employee_id = e.employee_id
    AND ec.certificate_type_id = ct.certificate_type_id
    AND ec.certificate_number = 'PMP-003'
);

INSERT INTO training (
    employee_id, name, description, provider,
    completion_date, valid_until, status
)
SELECT
    e.employee_id, 'Safety Training', 'Workplace safety training',
    'Safety First Inc.', '2023-01-20', '2024-01-20', 'Completed'
FROM employee e
WHERE e.employee_number = 'EMP001'
AND NOT EXISTS (
    SELECT 1 FROM training t
    WHERE t.employee_id = e.employee_id
    AND t.name = 'Safety Training'
    AND t.provider = 'Safety First Inc.'
);

INSERT INTO training (
    employee_id, name, description, provider,
    completion_date, valid_until, status
)
SELECT
    e.employee_id, 'First Aid Certification', 'First aid certification',
    'Health & Safety Org.', '2023-02-25', '2025-02-25', 'Completed'
FROM employee e
WHERE e.employee_number = 'EMP002'
AND NOT EXISTS (
    SELECT 1 FROM training t
    WHERE t.employee_id = e.employee_id
    AND t.name = 'First Aid Certification'
    AND t.provider = 'Health & Safety Org.'
);

INSERT INTO training (
    employee_id, name, description, provider,
    completion_date, valid_until, status
)
SELECT
    e.employee_id, 'Project Management Professional',
    'Project management training', 'PMI Institute',
    NULL, NULL, 'In Progress'
FROM employee e
WHERE e.employee_number = 'EMP003'
AND NOT EXISTS (
    SELECT 1 FROM training t
    WHERE t.employee_id = e.employee_id
    AND t.name = 'Project Management Professional'
    AND t.provider = 'PMI Institute'
);

INSERT INTO employee_skill (
    employee_id, skill_id, skill_level, origin,
    assigned_date, certification_date, valid_until, notes
)
SELECT
    e.employee_id, s.skill_id, 4, 'Internal Training',
    '2023-01-15', NULL, NULL, NULL
FROM employee e
JOIN skill s ON s.name = 'Safety Protocols'
WHERE e.employee_number = 'EMP001'
AND NOT EXISTS (
    SELECT 1 FROM employee_skill es
    WHERE es.employee_id = e.employee_id
    AND es.skill_id = s.skill_id
);

INSERT INTO employee_skill (
    employee_id, skill_id, skill_level, origin,
    assigned_date, certification_date, valid_until, notes
)
SELECT
    e.employee_id, s.skill_id, 5, 'External Certification',
    '2023-02-20', '2023-02-25', '2025-02-25', NULL
FROM employee e
JOIN skill s ON s.name = 'First Aid'
WHERE e.employee_number = 'EMP002'
AND NOT EXISTS (
    SELECT 1 FROM employee_skill es
    WHERE es.employee_id = e.employee_id
    AND es.skill_id = s.skill_id
);

INSERT INTO employee_skill (
    employee_id, skill_id, skill_level, origin,
    assigned_date, certification_date, valid_until, notes
)
SELECT
    e.employee_id, s.skill_id, 3, 'Self-taught',
    '2023-03-10', NULL, NULL, NULL
FROM employee e
JOIN skill s ON s.name = 'Project Management'
WHERE e.employee_number = 'EMP003'
AND NOT EXISTS (
    SELECT 1 FROM employee_skill es
    WHERE es.employee_id = e.employee_id
    AND es.skill_id = s.skill_id
);

INSERT INTO `file` (
    employee_id, employee_certificate_id, file_name,
    file_type, file_location, description
)
SELECT
    e.employee_id, ec.employee_certificate_id,
    'safety_training_certificate.pdf', 'application/pdf',
    '/files/safety_training_certificate.pdf',
    'Safety Training certificate'
FROM employee e
JOIN employee_certificate ec ON ec.employee_id = e.employee_id
WHERE e.employee_number = 'EMP001'
AND ec.certificate_number = 'ST-001'
AND NOT EXISTS (
    SELECT 1 FROM `file` f
    WHERE f.employee_id = e.employee_id
    AND f.file_name = 'safety_training_certificate.pdf'
);

INSERT INTO `file` (
    employee_id, employee_certificate_id, file_name,
    file_type, file_location, description
)
SELECT
    e.employee_id, ec.employee_certificate_id,
    'first_aid_certificate.pdf', 'application/pdf',
    '/files/first_aid_certificate.pdf',
    'First Aid certificate'
FROM employee e
JOIN employee_certificate ec ON ec.employee_id = e.employee_id
WHERE e.employee_number = 'EMP002'
AND ec.certificate_number = 'FA-002'
AND NOT EXISTS (
    SELECT 1 FROM `file` f
    WHERE f.employee_id = e.employee_id
    AND f.file_name = 'first_aid_certificate.pdf'
);

INSERT INTO `file` (
    employee_id, employee_certificate_id, file_name,
    file_type, file_location, description
)
SELECT
    e.employee_id, ec.employee_certificate_id,
    'pmp_certificate.pdf', 'application/pdf',
    '/files/pmp_certificate.pdf',
    'Project Management Professional certificate'
FROM employee e
JOIN employee_certificate ec ON ec.employee_id = e.employee_id
WHERE e.employee_number = 'EMP003'
AND ec.certificate_number = 'PMP-003'
AND NOT EXISTS (
    SELECT 1 FROM `file` f
    WHERE f.employee_id = e.employee_id
    AND f.file_name = 'pmp_certificate.pdf'
);