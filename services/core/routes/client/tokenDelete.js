const express = require("express");
const router = express.Router();
const db = require("../../db/db");

router.delete("/:tokenId", async (req, res) => {
    try {
        const [result] = await db.restrictedQuery(
            "api_tokens",
            "DELETE FROM {{table}} WHERE id = ? AND user_email = ?",
            [req.params.tokenId, req.user.email]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Token not found" });
        }
        res.status(200).send();
    } catch (err) {
        res.status(500).send();
    }
});

module.exports = router;