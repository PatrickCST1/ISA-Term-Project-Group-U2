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

router.post("/", async (req, res) => {
    try {
        const { rawToken, hash, redacted } = generateTokenPair();
        
        await db.restrictedQuery(
            "api_tokens",
            "INSERT INTO {{table}} (user_email, token_hash, redacted_token) VALUES (?, ?, ?)",
            [req.user.email, hash, redacted]
        );
        
        res.status(200).json({ token: rawToken });
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

module.exports = router;