const express = require("express");
const router = express.Router();
const db = require("../../db/db");
const crypto = require("crypto");

const generateTokenPair = () => {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const redacted = `${rawToken.substring(0, 4)}....${rawToken.slice(-4)}`;
    return { rawToken, hash, redacted };
};

router.put("/:tokenId", async (req, res) => {
    try {
        if (!req.user || !req.user.email) {
            return res.status(401).json({ error: "User session missing" });
        }

        const { rawToken, hash, redacted } = generateTokenPair();
        const tokenId = req.params.tokenId;

        const [result] = await db.restrictedQuery(
            "api_tokens",
            "UPDATE {{table}} SET token_hash = ?, redacted_token = ? WHERE id = ? AND user_email = ?",
            [hash, redacted, tokenId, req.user.email]
        );

        if (result.affectedRows === 0) {
            return res.status(400).send();
        }
        
        res.status(200).json({ token: rawToken });
    } catch (err) {
        res.status(500).send();
    }
});

module.exports = router;