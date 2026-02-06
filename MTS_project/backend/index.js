import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* ================= EMPLOYEES ================= */

app.get("/employees", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, name, position, department, contact, employmentHistory
      FROM employees
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

app.post("/employees", async (req, res) => {
  try {
    const { name, position, department, employmentHistory, contact } = req.body;

    const [result] = await pool.query(
      `INSERT INTO employees
       (name, position, department, employmentHistory, contact)
       VALUES (?, ?, ?, ?, ?)`,
      [name, position, department, employmentHistory, contact]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      position,
      department,
      employmentHistory,
      contact
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add employee" });
  }
});

app.delete("/employees/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Deleting employee with id:", id);
    
    const [result] = await pool.query("DELETE FROM employees WHERE id = ?", [id]);
    
    console.log("Delete result:", result);
    
    if (result.affectedRows > 0) {
      res.json({ success: true, message: "Employee deleted", id: parseInt(id) });
    } else {
      res.status(404).json({ success: false, message: "Employee not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to delete employee" });
  }
});

/* ================= PAYROLL ================= */

app.get("/payroll", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        p.id,
        p.employee_id AS employeeId,
        e.name,
        p.salary,
        p.hours_worked AS hoursWorked,
        p.leave_deductions AS leaveDeductions,
        p.final_salary AS finalSalary
      FROM payroll p
      JOIN employees e ON p.employee_id = e.id
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch payroll" });
  }
});

/* ================= ATTENDANCE ================= */

app.get("/attendance", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.id, a.employee_id AS employeeId, e.name, a.date, a.status
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
    `);

    res.json(rows);
  } catch (err) {
    console.error("Attendance error:", err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

/* ================= LEAVE ================= */

app.get("/leave-requests", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT l.id, l.employee_id AS employeeId, e.name, l.date, l.reason, l.status
      FROM leave_requests l
      JOIN employees e ON l.employee_id = e.id
    `);

    res.json(rows);
  } catch (err) {
    console.error("Leave requests error:", err);
    res.status(500).json({ error: "Failed to fetch leave requests" });
  }
});

app.post("/leave-requests", async (req, res) => {
  try {
    const { employee_id, reason, date, status } = req.body;

    console.log("Adding leave request:", { employee_id, reason, date, status });

    const [result] = await pool.query(
      `INSERT INTO leave_requests (employee_id, reason, date, status)
       VALUES (?, ?, ?, ?)`,
      [employee_id, reason, date, status || "Pending"]
    );

    console.log("Insert result:", result);

    const [rows] = await pool.query(
      `SELECT l.id, l.employee_id AS employeeId, e.name, l.date, l.reason, l.status
       FROM leave_requests l
       JOIN employees e ON l.employee_id = e.id
       WHERE l.id = ?`,
      [result.insertId]
    );

    console.log("Fetched new leave request:", rows);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Leave request submit error:", err.message);
    res.status(500).json({ error: "Failed to add leave request: " + err.message });
  }
});

app.patch("/leave-requests/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log("=== PATCH /leave-requests/:id ===");
    console.log("ID:", id);
    console.log("Status:", status);

    // First check if the record exists
    const [check] = await pool.query("SELECT * FROM leave_requests WHERE id = ?", [id]);
    console.log("Record exists:", check.length > 0, "Record:", check);

    if (check.length === 0) {
      console.log("Leave request not found with ID:", id);
      return res.status(404).json({ error: "Leave request not found with ID: " + id });
    }

    // Update the record
    const [result] = await pool.query(
      "UPDATE leave_requests SET status = ? WHERE id = ?",
      [status, id]
    );

    console.log("Update result:", result);

    if (result.affectedRows > 0) {
      const [rows] = await pool.query(
        `SELECT l.id, l.employee_id AS employeeId, e.name, l.date, l.reason, l.status
         FROM leave_requests l
         LEFT JOIN employees e ON l.employee_id = e.id
         WHERE l.id = ?`,
        [id]
      );
      console.log("Updated leave request:", rows[0]);
      res.json(rows[0]);
    } else {
      res.status(500).json({ error: "Failed to update leave request" });
    }
  } catch (err) {
    console.error("Leave status update error:", err);
    res.status(500).json({ error: "Error: " + err.message });
  }
});

/* ================= REVIEWS ================= */

app.get("/performance-reviews", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, employee_id, rating, comments, date
      FROM performance_reviews
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

app.post("/performance-reviews", async (req, res) => {
  try {
    const { employee_id, rating, comments, date } = req.body;

    const [result] = await pool.query(
      `INSERT INTO performance_reviews
       (employee_id, rating, comments, date)
       VALUES (?, ?, ?, ?)`,
      [employee_id, rating, comments, date]
    );

    res.status(201).json({
      id: result.insertId,
      employee_id,
      rating,
      comments,
      date
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add review" });
  }
});

/* ================= LOGIN ================= */

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!rows.length) {
      return res.json({ success: false, message: "User not found" });
    }

    const user = rows[0];

    if (user.password !== password) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = "FAKE_TOKEN_" + user.id;

    res.json({
      success: true,
      token,
      user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* ================= START ================= */

// Initialize database on startup
const initializeDB = async () => {
  try {
    console.log("Checking database...");
    const [result] = await pool.query("SELECT COUNT(*) as count FROM employees");
    console.log(`✅ Database ready (${result[0].count} employees)`);
  } catch (err) {
    console.error("⚠️ Database error - make sure MySQL is running and database is initialized");
    console.error(err.message);
  }
};

await initializeDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
