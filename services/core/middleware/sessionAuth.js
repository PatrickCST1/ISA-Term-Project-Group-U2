// services/middleware/auth.js
const { restrictedQuery } = require("../db/db");

module.exports = async function (req, res, next) {
    const email = req.signedCookies.auth_email;

    if (!email) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const rows = await restrictedQuery(
            "users",
            "SELECT email, username, role, daily_token_limit, daily_tokens_consumed FROM {{table}} WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            res.clearCookie("auth_email");
            return res.status(401).json({ error: "Unauthorized" });
        }

        req.user = {
            email: rows[0].email,
            username: rows[0].username,
            role: rows[0].role,
            daily_token_limit: rows[0].daily_token_limit,
            daily_tokens_consumed: rows[0].daily_tokens_consumed,
        };

        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "ERR_SERVER" });
    }
};