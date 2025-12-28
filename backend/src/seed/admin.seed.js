import bcrypt from "bcrypt";
import pool from "../config/db.js";

const seedAdmin = async () => {
  try {
    const name = "Super Admin";
    const email = "admin@classroom.com";
    const plainPassword = "Admin@12345"; // change later
    const role = "ADMIN";

    // check if admin already exists
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      console.log("⚠️ Admin user already exists");
      process.exit(0);
    }

    // hash password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // insert user
    const [userResult] = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [name, email, hashedPassword, role]
    );

    const userId = userResult.insertId;

    // insert into teachers table
    await pool.query(
      `INSERT INTO teachers (user_id, qualification, phone)
       VALUES (?, ?, ?)`,
      [userId, "ADMINISTRATOR", null]
    );

    console.log("✅ Admin user & teacher profile seeded successfully");
    process.exit(0);

  } catch (error) {
    console.error("❌ Failed to seed admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
