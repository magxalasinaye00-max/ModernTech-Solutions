CREATE SCHEMA `moderntech_hr` ;

USE moderntech_hr;

CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255),
  department VARCHAR(255),
  contact VARCHAR(255),
  employmentHistory TEXT
);

CREATE TABLE payroll (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  name VARCHAR(255),
  salary INT,
  hours_worked INT,
  leave_deductions INT,
  final_salary INT,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  date DATE,
  status VARCHAR(50),
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE leave_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  reason TEXT,
  date DATE,
  status VARCHAR(50) DEFAULT 'Pending',
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE performance_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  rating INT,
  comments TEXT,
  date DATE,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

INSERT INTO employees (id, name, position, department, contact, employmentHistory)
VALUES
(1, 'Sibongile Nkosi', 'Software Engineer', 'Development', 'sibongile.nkosi@moderntech.com', 'Joined in 2015, promoted to Senior in 2018'),
(2, 'Lungile Moyo', 'HR Manager', 'HR', 'lungile.moyo@moderntech.com', 'Joined in 2013, promoted to Manager in 2017'),
(3, 'Thabo Molefe', 'Quality Analyst', 'QA', 'thabo.molefe@moderntech.com', 'Joined in 2018'),
(4, 'Keshav Naidoo', 'Sales Representative', 'Sales', 'keshav.naidoo@moderntech.com', 'Joined in 2020'),
(5, 'Zanele Khumalo', 'Marketing Specialist', 'Marketing', 'zanele.khumalo@moderntech.com', 'Joined in 2019'),
(6, 'Sipho Zulu', 'UI/UX Designer', 'Design', 'sipho.zulu@moderntech.com', 'Joined in 2016'),
(7, 'Naledi Moeketsi', 'DevOps Engineer', 'IT', 'naledi.moeketsi@moderntech.com', 'Joined in 2017'),
(8, 'Farai Gumbo', 'Content Strategist', 'Marketing', 'farai.gumbo@moderntech.com', 'Joined in 2021'),
(9, 'Karabo Dlamini', 'Accountant', 'Finance', 'karabo.dlamini@moderntech.com', 'Joined in 2018'),
(10, 'Fatima Patel', 'Customer Support Lead', 'Support', 'fatima.patel@moderntech.com', 'Joined in 2016');

INSERT INTO payroll (employee_id, name, salary, hours_worked, leave_deductions, final_salary)
VALUES
(1, 'Sibongile Nkosi', 70000, 160, 8, 69500),
(2, 'Lungile Moyo', 80000, 150, 10, 79000),
(3, 'Thabo Molefe', 55000, 170, 4, 54800),
(4, 'Keshav Naidoo', 60000, 165, 6, 59700),
(5, 'Zanele Khumalo', 58000, 158, 5, 57850),
(6, 'Sipho Zulu', 65000, 168, 2, 64800),
(7, 'Naledi Moeketsi', 72000, 175, 3, 71800),
(8, 'Farai Gumbo', 56000, 160, 0, 56000),
(9, 'Karabo Dlamini', 62000, 155, 5, 61500),
(10, 'Fatima Patel', 58000, 162, 4, 57750);

-- Attendance records for Sibongile Nkosi (Employee 1)
INSERT INTO attendance (employee_id, date, status) VALUES
(1, '2025-07-25', 'Present'),
(1, '2025-07-26', 'Absent'),
(1, '2025-07-27', 'Present'),
(1, '2025-07-28', 'Present'),
(1, '2025-07-29', 'Present');

-- Attendance records for Lungile Moyo (Employee 2)
INSERT INTO attendance (employee_id, date, status) VALUES
(2, '2025-07-25', 'Present'),
(2, '2025-07-26', 'Present'),
(2, '2025-07-27', 'Absent'),
(2, '2025-07-28', 'Present'),
(2, '2025-07-29', 'Present');

-- Attendance records for Thabo Molefe (Employee 3)
INSERT INTO attendance (employee_id, date, status) VALUES
(3, '2025-07-25', 'Present'),
(3, '2025-07-26', 'Present'),
(3, '2025-07-27', 'Present'),
(3, '2025-07-28', 'Absent'),
(3, '2025-07-29', 'Present');

-- Attendance records for Keshav Naidoo (Employee 4)
INSERT INTO attendance (employee_id, date, status) VALUES
(4, '2025-07-25', 'Absent'),
(4, '2025-07-26', 'Present'),
(4, '2025-07-27', 'Present'),
(4, '2025-07-28', 'Present'),
(4, '2025-07-29', 'Present');

-- Attendance records for Zanele Khumalo (Employee 5)
INSERT INTO attendance (employee_id, date, status) VALUES
(5, '2025-07-25', 'Present'),
(5, '2025-07-26', 'Present'),
(5, '2025-07-27', 'Absent'),
(5, '2025-07-28', 'Present'),
(5, '2025-07-29', 'Present');

-- Attendance records for Sipho Zulu (Employee 6)
INSERT INTO attendance (employee_id, date, status) VALUES
(6, '2025-07-25', 'Present'),
(6, '2025-07-26', 'Present'),
(6, '2025-07-27', 'Absent'),
(6, '2025-07-28', 'Present'),
(6, '2025-07-29', 'Present');

-- Attendance records for Naledi Moeketsi (Employee 7)
INSERT INTO attendance (employee_id, date, status) VALUES
(7, '2025-07-25', 'Present'),
(7, '2025-07-26', 'Present'),
(7, '2025-07-27', 'Present'),
(7, '2025-07-28', 'Absent'),
(7, '2025-07-29', 'Present');

-- Attendance records for Farai Gumbo (Employee 8)
INSERT INTO attendance (employee_id, date, status) VALUES
(8, '2025-07-25', 'Present'),
(8, '2025-07-26', 'Absent'),
(8, '2025-07-27', 'Present'),
(8, '2025-07-28', 'Present'),
(8, '2025-07-29', 'Present');

-- Attendance records for Karabo Dlamini (Employee 9)
INSERT INTO attendance (employee_id, date, status) VALUES
(9, '2025-07-25', 'Present'),
(9, '2025-07-26', 'Present'),
(9, '2025-07-27', 'Present'),
(9, '2025-07-28', 'Absent'),
(9, '2025-07-29', 'Present');

-- Attendance records for Fatima Patel (Employee 10)
INSERT INTO attendance (employee_id, date, status) VALUES
(10, '2025-07-25', 'Present'),
(10, '2025-07-26', 'Present'),
(10, '2025-07-27', 'Absent'),
(10, '2025-07-28', 'Present'),
(10, '2025-07-29', 'Present');

-- Leave requests for Sibongile Nkosi (Employee 1)
INSERT INTO leave_requests (employee_id, reason, date, status) VALUES
(1, 'Sick Leave', '2025-07-22', 'Approved'),
(1, 'Personal', '2024-12-01', 'Pending');

-- Leave requests for Lungile Moyo (Employee 2)
INSERT INTO leave_requests (employee_id, reason, date, status) VALUES
(2, 'Family Responsibility', '2025-07-15', 'Denied'),
(2, 'Vacation', '2024-12-02', 'Approved');

-- Leave requests for Thabo Molefe (Employee 3)
INSERT INTO leave_requests (employee_id, reason, date, status) VALUES
(3, 'Medical Appointment', '2025-07-10', 'Approved'),
(3, 'Personal', '2024-12-05', 'Pending');

-- Leave requests for Keshav Naidoo (Employee 4)
INSERT INTO leave_requests (employee_id, reason, date, status) VALUES
(4, 'Bereavement', '2025-07-20', 'Approved');

-- Leave requests for Zanele Khumalo (Employee 5)
INSERT INTO leave_requests (employee_id, reason, date, status) VALUES
(5, 'Childcare', '2024-12-01', 'Pending');

-- Leave requests for Sipho Zulu (Employee 6)
INSERT INTO leave_requests (employee_id, reason, date, status) VALUES
(6, 'Sick Leave', '2025-07-18', 'Approved');

-- Leave requests for Naledi Moeketsi (Employee 7)
INSERT INTO leave_requests (employee_id, reason, date, status) VALUES
(7, 'Vacation', '2025-07-22', 'Pending');

-- Leave requests for Farai Gumbo (Employee 8)
INSERT INTO leave_requests (employee_id, reason, date, status) VALUES
(8, 'Medical Appointment', '2024-12-02', 'Approved');

-- Leave requests for Karabo Dlamini (Employee 9)
INSERT INTO leave_requests (employee_id, reason, date, status) VALUES
(9, 'Childcare', '2025-07-19', 'Denied');

-- Leave requests for Fatima Patel (Employee 10)
INSERT INTO leave_requests (employee_id, reason, date, status) VALUES
(10, 'Vacation', '2024-12-03', 'Pending');

INSERT INTO performance_reviews (employee_id, rating, comments, date)
VALUES
(1, 5, 'Excellent work on project delivery', '2025-07-30'),
(2, 4, 'Strong leadership in HR team', '2025-07-30'),
(3, 3, 'Needs improvement in QA documentation', '2025-07-30');

-- Create a users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Insert a default admin user
INSERT INTO users (email, password)
VALUES ('admin@example.com', 'password123');

ALTER TABLE `moderntech_hr`.`payroll`
DROP FOREIGN KEY `payroll_ibfk_1`;
ALTER TABLE `moderntech_hr`.`payroll`
ADD CONSTRAINT `payroll_ibfk_1`
  FOREIGN KEY (`employee_id`)
  REFERENCES `moderntech_hr`.`employees` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE `moderntech_hr`.`attendance`
DROP FOREIGN KEY `attendance_ibfk_1`;
ALTER TABLE `moderntech_hr`.`attendance`
ADD CONSTRAINT `attendance_ibfk_1`
  FOREIGN KEY (`employee_id`)
  REFERENCES `moderntech_hr`.`employees` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE `moderntech_hr`.`leave_requests`
DROP FOREIGN KEY `leave_requests_ibfk_1`;
ALTER TABLE `moderntech_hr`.`leave_requests`
ADD CONSTRAINT `leave_requests_ibfk_1`
  FOREIGN KEY (`employee_id`)
  REFERENCES `moderntech_hr`.`employees` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE `moderntech_hr`.`performance_reviews`
DROP FOREIGN KEY `performance_reviews_ibfk_1`;
ALTER TABLE `moderntech_hr`.`performance_reviews`
ADD CONSTRAINT `performance_reviews_ibfk_1`
  FOREIGN KEY (`employee_id`)
  REFERENCES `moderntech_hr`.`employees` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

DELETE FROM employees WHERE id > 10