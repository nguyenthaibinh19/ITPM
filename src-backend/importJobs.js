const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
require("dotenv").config();

const jobs = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "jobs.json"), "utf8")
);

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to Supabase DB");

    let count = 0;

    for (const job of jobs) {
      await client.query(
        `
        INSERT INTO jobs (title, company, location, salary, category, level, type, posted_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        `,
        [
          job.title,
          job.company,
          job.location,
          job.salary,
          job.category,
          job.level,
          job.type,
          job.postedAt, // "YYYY-MM-DD"
        ]
      );
      count++;
    }

    console.log("Imported", count, "jobs");
  } catch (err) {
    console.error("Error importing jobs:", err);
  } finally {
    await client.end();
    console.log("Done");
  }
}

run();
