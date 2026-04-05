const express = require("express");
const router = express.Router();
const db = require("../../db/db");

router.get("/", async (req, res) => {
    try {
        const rows = await db.restrictedQuery(
            "api_tokens",
            "SELECT id, name, redacted_token, created_at FROM {{table}} WHERE user_email = ?",
            [req.user.email]
        );
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

module.exports = router;