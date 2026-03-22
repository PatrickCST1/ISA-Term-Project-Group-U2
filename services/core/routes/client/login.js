const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { restrictedQuery } = require('../../db/db');

router.post("/", async (req, res) => {
    const { email, password } = req.body;

    try {
        const rows = await restrictedQuery(
            "users",
            "SELECT password, salt FROM {{table}} WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(400).json({ error: "ERR_NO_USER" });
        }

        const { password: storedHash, salt: storedSalt } = rows[0];

        const hash = crypto
            .createHash("sha256")
            .update(password + storedSalt)
            .digest("hex");

        if (hash !== storedHash) {
            return res.status(401).json({ error: "ERR_BAD_PASSWORD" });
        }

        res.cookie("auth_email", email, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            signed: true,
            maxAge: 1000 * 60 * 60 * 24
        });

        const role = await restrictedQuery("users", "SELECT role FROM {{table}} WHERE email = ?", [email]);

        return res.status(200).json({ success: true, role: role[0].role });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "ERR_SERVER" });
    }
});

module.exports = router;