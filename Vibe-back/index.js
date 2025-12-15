const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();
const mysql = require("mysql2/promise");

const app = express();
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.locals.db = pool;

app.get("/", (req, res) => {
  res.json({ ok: true });
});

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const usersInfoRouter = require("./routes/usersInfo");
app.use("/users", usersInfoRouter);

const postsRouter = require("./routes/posts");
app.use("/posts", postsRouter);

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {});
