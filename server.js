
const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "registration_db"
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err);
    } else {
        console.log("MySQL Connected!");
    }
});

db.on("error", (err) => {
    console.error("MySQL Error:", err);
});

// Serve HTML file
app.use(express.static(path.join(__dirname, "public")));

// Registration API
app.post("/register", (req, res) => {

    const { name, email, password } = req.body;

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, password], (err, result) => {

        if (err) {
            console.error("Registration error:", err);
            return res.status(500).send("Registration failed!");
        }

        res.send("Registration successful!");
    });
});

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        const altPort = Number(PORT) + 1;
        console.log(`Port ${PORT} is in use, trying port ${altPort}...`);
        app.listen(altPort, () => {
            console.log(`Server running at http://localhost:${altPort}`);
        });
    } else {
        console.error(err);
    }
});
