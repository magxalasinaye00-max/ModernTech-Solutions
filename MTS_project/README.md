# ModernTech HR Management System (Frontend Prototype)

## Overview
ModernTech HR Management System is a **front-end prototype** of an HR web application designed for ModernTech Solutions.  
The app demonstrates basic HR functionalities including:

- Employee management
- Payroll processing
- Attendance and leave tracking
- Performance reviews with charts
- User authentication (login/logout)

> This project is a **proof-of-concept** using Vue 3, Vuex, and Bootstrap. All data is stored locally (dummy data and localStorage).

---

## Features

### Employee Management
- View all employees
- Search employees by name, position, or department
- Add or delete employee records

### Payroll
- Display payroll data with hours worked, leave deductions, and final salary
- Automates calculations (based on dummy data)

### Attendance & Leave Requests
- Track employee attendance
- Submit and approve/deny leave requests
- Data persists in localStorage

### Performance Reviews
- Add reviews for employees (rating + comments)
- View review history
- Average rating chart (bar chart)

### Authentication
- Simple login/logout system
- Access control for dashboard and routes

---

## Technologies Used
- **Vue 3** – frontend framework  
- **Vuex** – state management  
- **Bootstrap 5** – responsive design  
- **Chart.js** – data visualization for performance reviews  
- **LocalStorage** – simulate persistent storage

## Installation
1. Clone the repository:
  bash
git clone <your-repo-url>
cd ModernTech-Solutions
cd MTS_project

2. Install dependencies:
npm install

3. Run the app locally:
npm run dev

4. Open in browser:
http://localhost:5173


## USAGE

1.LOGIN

Email: lungile.moyo@moderntech.com

Password: 2468

2.DASHBOARD

Navigate using the sidebar

View employees, payroll, attendance, leave requests, and performance reviews

3.ADD RECORDS

Add employees, leave requests, attendance records, and performance reviews

Charts update automatically for performance reviews

## NOTES

This is a front-end only application (no backend server)

All data is stored in localStorage for demonstration purposes

Designed for responsive use on desktop, tablets, and mobile devices

Code is commented for clarity and future development