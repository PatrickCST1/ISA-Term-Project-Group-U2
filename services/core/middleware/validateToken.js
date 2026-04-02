const crypto = require("crypto");
const { restrictedQuery } = require("../db/db");

module.exports = async function (req, res, next) {
    // 1. Grab the raw token from the custom header
    const rawToken = req.header("x-api-key");

    if (!rawToken) {
        return res.status(401).json({ error: "API Key is required in x-api-key header" });
    }

    try {
        // 2. Hash the incoming raw token to match the database version
        const hash = crypto.createHash('sha256').update(rawToken).digest('hex');

        // 3. Search the api_tokens table for this hash
        // We join with users to get the user's limit/consumed info for the next steps
        const rows = await restrictedQuery(
            "api_tokens",
            `SELECT t.user_email, u.daily_token_limit, u.daily_tokens_consumed 
             FROM {{table}} t
             JOIN users u ON t.user_email = u.email
             WHERE t.token_hash = ?`,
            [hash]
        );

        if (rows.length === 0) {
            return res.status(403).json({ error: "Invalid API Key" });
        }

        const user = rows[0];

        // 4. (Optional but recommended) Check if they hit their daily limit
        if (user.daily_tokens_consumed >= user.daily_token_limit) {
            return res.status(429).json({ error: "Daily token limit exceeded" });
        }

        // 5. Attach the user info to the request so query.js knows who is calling
        req.user = {
            email: user.user_email,
            daily_limit: user.daily_token_limit,
            consumed: user.daily_tokens_consumed
        };

        // 6. Update last_used_at timestamp (Don't await to keep the response fast)
        restrictedQuery("api_tokens", "UPDATE {{table}} SET last_used_at = NOW() WHERE token_hash = ?", [hash]);

        next();
    } catch (err) {
        console.error("Token Validation Error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};