const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    return res.status(200).json({
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        daily_token_limit: req.user.daily_token_limit,
        daily_tokens_consumed: req.user.daily_tokens_consumed
    });
});

module.exports = router;