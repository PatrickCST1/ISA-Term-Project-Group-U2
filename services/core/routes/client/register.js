const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { query } = require("../../db/db");

router.post("/", async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: "Missing username, email, or password" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    try {
        const rows = await query(
            "users",
            "SELECT email FROM {{table}} WHERE email = ?",
            [email]
        );

        if (rows.length > 0) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const salt = crypto.randomBytes(16).toString("hex");
        const hash = crypto.createHash("sha256").update(password + salt).digest("hex");

        await query(
            "users",
            "INSERT INTO {{table}} (username, email, password, salt) VALUES (?, ?, ?, ?)",
            [username, email, hash, salt]
        );

        res.cookie("auth_email", email, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            signed: true,
            maxAge: 1000 * 60 * 60 * 24
        });

        return res.status(201).json({ success: true });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "ERR_SERVER" });
    }
});

module.exports = router;