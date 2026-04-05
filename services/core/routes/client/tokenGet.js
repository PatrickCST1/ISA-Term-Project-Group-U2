const express = require("express");
const router = express.Router();
const db = require("../../db/db");

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const rows = await db.restrictedQuery(
            "api_tokens",
            "SELECT id, name, redacted_token, created_at, last_used_at FROM {{table}} WHERE id = ? AND user_email = ?",
            [id, req.user.email]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Token not found" });
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send({error: "Couldn't connect to the server"});
    }
});

module.exports = router;