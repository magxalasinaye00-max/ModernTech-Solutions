# ModernTech-Solutions-Module-2

# ModernTech HR System

Full-stack HR management app: Vue.js frontend, Express backend, MySQL database.

## Run It

**1. Database:**
```bash
mysql -u root -p < database.sql
```

**2. Backend (Terminal 1):**
```bash
cd backend
npm install
npm run dev
```
Runs on http://localhost:3000

**3. Frontend (Terminal 2):**
```bash
cd MTS_project
npm install
npm run dev
```
Runs on http://localhost:5173

## Login
Email: `admin@example.com`  
Password: `password123`

## Features
- Employee Management
- Attendance Tracking
- Leave Requests
- Payroll Processing
- Performance Reviews
- Authentication

## Tech
Vue.js 3 | Express.js | MySQL | Vuex | Bootstrap 5

## Docs
- `PROJECT_PRESENTATION.md` - Code explanation
- `TEAM_ROLES_CONTRIBUTION.md` - Team roles
- Protected routes (only logged-in users access dashboard)
- Logout functionality

---

## 🛠 Technology Stack

### Frontend (MTS_project folder)
| Technology | Purpose |
|-----------|---------|
| Vue.js 3 | Reactive UI framework |
| Vue Router 4 | Client-side routing & navigation |
| Vuex 4 | Centralized state management |
| Vite | Fast build tool & dev server |
| Bootstrap 5 | Responsive CSS framework |
| Axios | HTTP client for API calls |
| Chart.js | Data visualization for reviews |

### Backend (backend folder)
| Technology | Purpose |
|-----------|---------|
| Node.js | JavaScript runtime environment |
| Express.js 5 | Web server framework |
| MySQL 2/Promise | Database driver with async support |
| CORS | Enable cross-origin requests |
| dotenv | Environment variable management |
| Nodemon (dev) | Auto-restart during development |

### Database
| Component | Details |
|-----------|---------|
| Database | MySQL 8.0+ |
| Tables | 6 tables (employees, payroll, attendance, leave_requests, performance_reviews, users) |
| Relationships | Foreign keys with ON DELETE/UPDATE CASCADE |
| Constraints | Data integrity enforcement |

### Step 1: Prepare the Database

Before starting the application, create and populate the MySQL database:

**Option A: Using MySQL Workbench or CLI**
1. Open MySQL Workbench or MySQL Command Line
2. Run the `database.sql` file from the project root:
   ```sql
   SOURCE /path/to/ModernTech-Solutions/database.sql;
   ```
   Or copy the entire contents of `database.sql` and execute in your MySQL client.

3. Verify the database was created:
   ```sql
   SHOW DATABASES;
   USE moderntech_hr;
   SHOW TABLES;
   SELECT COUNT(*) FROM employees;  -- Should show 10 employees
   ```

**Option B: Command Line (if MySQL is in PATH)**
```bash
mysql -u root -p < database.sql
```
(Will prompt for MySQL root password)

### Step 2: Backend Setup

```bash
# 1. Navigate to backend folder
cd backend

# 2. Install Node dependencies
npm install

# 3. Create .env file with database credentials
# Create a file named .env with the following content:
```

**Create `.backend/.env` file:**
```
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=moderntech_hr
PORT=3000
```

**Note:** Replace `your_mysql_password` with your actual MySQL root password.

```bash
# 4. Start the backend server
npm run dev
```

**Expected output:**
```
🚀 Server running on port 3000
✅ Database ready (10 employees)
```

The backend is now running at: **http://localhost:3000**

### Step 3: Frontend Setup

**In a NEW terminal window:**

```bash
# 1. Navigate to frontend folder (from project root)
cd MTS_project

# 2. Install Node dependencies
npm install

# 3. Start the development server
npm run dev
```

**Expected output:**
```
Local:   http://localhost:5173/
```

The frontend is now running at: **http://localhost:5173**

### Step 4: Access the Application

1. Open your browser
2. Go to: **http://localhost:5173**
3. You will be redirected to the login page

**Test Credentials:**
```
Email:    admin@example.com
Password: password123
```

## 📂 Project Structure

```
ModernTech-Solutions/
│
├── database.sql                    ← Database schema & test data (RUN THIS FIRST)
├── README.md                       ← This file
├── PROJECT_PRESENTATION.md         ← Detailed code explanation & architecture
├── TEAM_ROLES_CONTRIBUTION.md      ← How each role contributed to the project
│
├── backend/                        ← Express.js REST API Server
│   ├── index.js                   ← Main server file (all API endpoints)
│   ├── db.js                      ← MySQL connection pool
│   ├── package.json               ← Dependencies
│   ├── .env                       ← Database credentials (CREATE THIS)
│   └── node_modules/              ← Dependencies (auto-created by npm install)
│
└── MTS_project/                   ← Vue.js Frontend Application
    ├── src/
    │   ├── main.js                ← Entry point
    │   ├── App.vue                ← Root component
    │   ├── api.js                 ← Axios API configuration
    │   ├── components/            ← Vue components (Login, Dashboard, etc.)
    │   ├── layouts/               ← Layout wrapper components
    │   ├── router/                ← Vue Router configuration
    │   ├── store/                 ← Vuex state management
    │   └── assets/                ← Static assets
    ├── package.json               ← Dependencies
    ├── vite.config.js             ← Vite configuration
    └── node_modules/              ← Dependencies (auto-created by npm install)
```

---

## 🔄 How the Application Works

### Complete Data Flow Example:

**User Action:** Lecturer clicks "Add Employee"

```
1. Frontend (UI)
   └─> Form: name="John Doe", position="Manager"
   └─> Clicks "Submit"

2. Frontend (Vuex Action)
   └─> this.addEmployee(formData)
   └─> Action calls: api.post("/employees", { name, position, ... })

3. Frontend (Axios HTTP Request)
   └─> POST http://localhost:3000/employees
   └─> Sends: { "name": "John Doe", "position": "Manager" }

4. Backend (Express Route Handler)
   └─> app.post("/employees", async (req, res) => { ... })
   └─> Extracts: name, position from request body

5. Backend (Database Query)
   └─> pool.query("INSERT INTO employees (name, position) VALUES (?, ?)")
   └─> SQL: INSERT INTO employees (name, position) VALUES ('John Doe', 'Manager')

6. Database (MySQL)
   └─> Creates new row
   └─> AUTO_INCREMENT generates id = 11
   └─> Returns: { insertId: 11, affectedRows: 1 }

7. Backend (Response)
   └─> res.status(201).json({ id: 11, name: "John Doe", position: "Manager" })

8. Frontend (Vuex Store Update)
   └─> Mutation: ADD_EMPLOYEE commits
   └─> state.employees.push(newEmployee)

9. Frontend (UI Re-render)
   └─> Component observes state change
   └─> Template re-renders
   └─> User sees "John Doe" in employee list ✓
```

---

## 🧪 Testing the Application

### Test Data Pre-loaded:
The `database.sql` file includes:
- **10 sample employees** from different departments
- **10 payroll records** with salary calculations
- **50+ attendance records** for testing
- **15+ leave requests** with various statuses
- **3 performance reviews** with ratings

### Manual Testing Steps:

1. **Test Login**
   - Use credentials: `admin@example.com` / `password123`
   - Verify you're redirected to Dashboard

2. **Test Employee Management**
   - View all employees on Dashboard
   - Add a new employee via the form
   - Delete an employee (verify payroll/attendance are also deleted)

3. **Test Attendance**
   - Navigate to Attendance page
   - View sample attendance records
   - Add a new attendance record

4. **Test Leave Requests**
   - Navigate to Leave Requests
   - Submit a new leave request
   - Approve or deny a pending request

5. **Test Payroll**
   - Navigate to Payroll
   - Verify salary data is displayed correctly
   - Check final salary calculation

6. **Test Performance Reviews**
   - Navigate to Performance Reviews
   - Add a new review with rating 1-5
   - Verify the chart updates with average ratings

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to MySQL database"
**Solution:**
- Verify MySQL is running: `mysql -u root -p` (test login)
- Check `.env` file credentials match your MySQL setup
- Ensure `database.sql` has been executed

### Issue: "Frontend not connecting to backend"
**Solution:**
- Verify backend is running: Check http://localhost:3000 in browser (should show blank or error, confirming server is live)
- Check frontend `src/api.js` has correct baseURL: `http://localhost:3000`
- Verify both are running in separate terminals

### Issue: "Port 3000 or 5173 already in use"
**Solution:**
```bash
# Kill process on port 3000 (backend)
lsof -ti:3000 | xargs kill -9    # macOS/Linux
netstat -ano | findstr :3000     # Windows (then taskkill /PID <pid> /F)

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9    # macOS/Linux
```

### Issue: "npm install fails"
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## 🎓 Project Highlights

### Architecture
✅ **Full-stack MVC pattern** - Models (Database), Views (Vue Components), Controllers (Express Routes)
✅ **Separation of concerns** - Frontend, backend, and database are independent and scalable
✅ **State management** - Vuex keeps UI in sync with data across components
✅ **RESTful API design** - Standard HTTP methods (GET, POST, PATCH, DELETE)

### Security Features
✅ **Parameterized queries** - Prevents SQL injection attacks
✅ **Authentication** - Token-based login system
✅ **Protected routes** - Only authenticated users can access sensitive pages
✅ **CORS enabled** - Secure cross-origin communication

### Database
✅ **Relational design** - Proper normalization and relationships
✅ **Referential integrity** - Foreign keys with CASCADE constraints
✅ **Indexes** - Optimized for fast queries
✅ **Sample data** - Pre-loaded for immediate testing

---

## 👥 Team Roles

This project was built by a team with three specialized roles:

1. **Database Developer**
   - Designed MySQL schema with 6 tables
   - Implemented relationships and constraints
   - Added test data

2. **Frontend Developer**
   - Built Vue.js components and UI
   - Implemented Vuex state management
   - Set up client-side routing

3. **Backend Developer**
   - Created Express.js REST API
   - Implemented database queries
   - Added error handling and validation

**Happy reviewing! Thank you for evaluating our project.** 🎉

Create a MySQL database and run the schema. Here's an example schema:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS moderntech_hr;
USE moderntech_hr;

-- Create employees table
CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100),
  department VARCHAR(100),
  contact VARCHAR(20),
  employmentHistory VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create attendance table
CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  date DATE,
  status VARCHAR(50),
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Create leave_requests table
CREATE TABLE leave_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  date DATE,
  reason VARCHAR(255),
  status VARCHAR(50),
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Create payroll table
CREATE TABLE payroll (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  salary DECIMAL(10, 2),
  hours_worked INT,
  leave_deductions DECIMAL(10, 2),
  final_salary DECIMAL(10, 2),
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Create performance_reviews table
CREATE TABLE performance_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  rating INT,
  comments TEXT,
  date DATE,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Create users table for login
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users
INSERT INTO users (email, password) VALUES ('admin@moderntech.com', 'password123');
```

### 5. Configure Backend Environment

Create a `.env` file in the `backend` directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=moderntech_hr
PORT=3000
```

## 🏃 Running the Project

### Start Backend Server

```bash
cd backend

# Install dependencies (if not done)
npm install

# Start the server
npm start

# Server will run on http://localhost:3000
```

### Start Frontend Development Server

In a new terminal:

```bash
cd MTS_project

# Install dependencies (if not done)
npm install

# Start the development server
npm run dev

# Frontend will run on http://localhost:5173
```

### Build for Production

```bash
cd MTS_project

# Build the project
npm run build

# Preview the build
npm run preview
```

## 📁 Project Structure

```
ModernTech-Solutions/
├── backend/
│   ├── index.js              # Main server file
│   ├── db.js                 # Database configuration
│   ├── package.json
│   └── node_modules/
├── MTS_project/              # Vue.js frontend
│   ├── src/
│   │   ├── components/       # Vue components
│   │   │   ├── Dashboard.vue
│   │   │   ├── Attendance.vue
│   │   │   ├── LeaveRequests.vue
│   │   │   ├── Payroll.vue
│   │   │   ├── PerfomanceReviews.vue
│   │   │   └── Log-in.vue
│   │   ├── layouts/
│   │   │   └── MainLayout.vue
│   │   ├── store/            # Vuex state management
│   │   │   ├── hrStore.js
│   │   │   └── modules/
│   │   ├── router/
│   │   │   └── index.js
│   │   ├── api.js            # Axios configuration
│   │   ├── App.vue
│   │   └── main.js
│   ├── package.json
│   └── node_modules/
└── README.md
```

## 🔌 API Endpoints

### Employees
- `GET /employees` - Get all employees
- `POST /employees` - Add a new employee
- `DELETE /employees/:id` - Delete an employee

### Attendance
- `GET /attendance` - Get all attendance records

### Leave Requests
- `GET /leave-requests` - Get all leave requests
- `POST /leave-requests` - Submit a new leave request
- `PATCH /leave-requests/:id` - Update leave request status

### Payroll
- `GET /payroll` - Get payroll information for all employees

### Performance Reviews
- `GET /performance-reviews` - Get all performance reviews
- `POST /performance-reviews` - Add a new performance review

### Authentication
- `POST /login` - User login

## 🔐 Default Login

```
Email: admin@moderntech.com
Password: password123
```

*Note: Change this in production!*

## 🎨 Features Guide

### Dashboard
- View all employees in a sortable table
- Search employees by name, position, or department
- Add new employees with complete information
- Delete employee records

### Attendance
- View attendance records organized by employee
- See attendance status (Present, Absent, Late, Leave)
- Track attendance dates

### Leave Requests
- Submit leave requests with reason and date
- View all leave requests
- Approve or deny pending requests
- See request status (Pending, Approved, Denied)

### Payroll
- View salary information
- Track hours worked and deductions
- Calculate final salary
- Detailed breakdown per employee

### Performance Reviews
- Add performance reviews for employees
- Rate employee performance (1-5 stars)
- Add detailed comments
- View review history

## 🐛 Troubleshooting

### Backend won't start
- Make sure MySQL is running
- Check your `.env` file configuration
- Verify database credentials
- Check if port 3000 is available

### Frontend shows "Loading..." forever
- Check if backend is running
- Open browser console (F12) for error messages
- Check backend logs for error detail
- Verify API endpoint in `src/api.js`

### Database connection error
- Ensure MySQL service is running
- Check host, user, and password in `.env`
- Verify database exists
- Run the SQL schema to create tables

### Attendance/Leave not showing data
- Verify tables exist in database
- Check if employee IDs match
- Look at backend console for SQL errors

## 📝 Notes

- The sidebar navigation is available on all pages
- Click the toggle button (⟨/⟩) to collapse/expand the sidebar
- All timestamps are stored in the database automatically
- Employee IDs are auto-incremented
- Leave requests default to "Pending" status
