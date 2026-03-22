const express = require('express');
const router = express.Router();
const { restrictedQuery } = require("../../db/db");

router.get("/", async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(401).json({error: "Not authorized"});
    }

    const users = await restrictedQuery("users", "SELECT username, email, role, daily_token_limit, daily_tokens_consumed FROM {{table}}");

    return res.status(200).json({ users });
});

module.exports = router;