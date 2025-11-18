require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = 4000;

// THAY THÔNG TIN DB CHO ĐÚNG
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});


app.use(cors());
app.use(express.json());

// ✅ GET /api/jobs?q=&location=&page=&limit=
app.get("/api/jobs", async (req, res) => {
  let { q, location, page = 1, limit = 20 } = req.query;

  page = Number(page) || 1;
  limit = Number(limit) || 20;
  const offset = (page - 1) * limit;

  const params = [];
  const where = [];

  if (q && q.trim() !== "") {
    params.push(`%${q.trim().toLowerCase()}%`);
    where.push(
      `(LOWER(title) LIKE $${params.length} 
        OR LOWER(company) LIKE $${params.length}
        OR LOWER(category) LIKE $${params.length})`
    );
  }

  if (location && location !== "Tất cả Tỉnh/Thành phố") {
    params.push(`%${location.toLowerCase()}%`);
    where.push(`LOWER(location) LIKE $${params.length}`);
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

  try {
    // tổng số job
    const countResult = await pool.query(
      `SELECT COUNT(*) AS total FROM jobs ${whereClause}`,
      params
    );
    const total = Number(countResult.rows[0].total);

    // danh sách job (có phân trang)
    params.push(limit);
    params.push(offset);

    const jobsResult = await pool.query(
      `
      SELECT id, title, company, location, salary, category, level, type, posted_at
      FROM jobs
      ${whereClause}
      ORDER BY posted_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
      `,
      params
    );

    res.json({
      total,
      page,
      limit,
      items: jobsResult.rows,
    });
  } catch (err) {
    console.error("GET /api/jobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET /api/jobs/:id
app.get("/api/jobs/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const result = await pool.query(
      `SELECT id, title, company, location, salary, category, level, type, posted_at
       FROM jobs
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("GET /api/jobs/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST /api/jobs  (thêm job)
app.post("/api/jobs", async (req, res) => {
  const { title, company, location, salary, category, level, type, postedAt } =
    req.body;

  if (
    !title ||
    !company ||
    !location ||
    !salary ||
    !category ||
    !level ||
    !type
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO jobs (title, company, location, salary, category, level, type, posted_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id, title, company, location, salary, category, level, type, posted_at
      `,
      [
        title,
        company,
        location,
        salary,
        category,
        level,
        type,
        postedAt || new Date().toISOString().slice(0, 10), // nếu không gửi thì lấy ngày hôm nay
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /api/jobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ PUT /api/jobs/:id  (sửa job)
app.put("/api/jobs/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, company, location, salary, category, level, type, postedAt } =
    req.body;

  try {
    const result = await pool.query(
      `
      UPDATE jobs
      SET title = $1,
          company = $2,
          location = $3,
          salary = $4,
          category = $5,
          level = $6,
          type = $7,
          posted_at = $8
      WHERE id = $9
      RETURNING id, title, company, location, salary, category, level, type, posted_at
      `,
      [
        title,
        company,
        location,
        salary,
        category,
        level,
        type,
        postedAt || new Date().toISOString().slice(0, 10),
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("PUT /api/jobs/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE /api/jobs/:id  (xoá job)
app.delete("/api/jobs/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const result = await pool.query("DELETE FROM jobs WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job deleted" });
  } catch (err) {
    console.error("DELETE /api/jobs/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Job API running at http://localhost:${PORT}`);
});
