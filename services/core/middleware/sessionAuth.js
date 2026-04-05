const jwt = require("jsonwebtoken");
const { restrictedQuery } = require("../db/db");

module.exports = async function (req, res, next) {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        const rows = await restrictedQuery(
            "users",
            "SELECT email, username, role, daily_token_limit, daily_tokens_consumed FROM {{table}} WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            res.clearCookie("auth_token");
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
        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            res.clearCookie("auth_token");
            return res.status(401).json({ error: "Unauthorized" });
        }
        console.error(err);
        return res.status(500).json({ error: "ERR_SERVER" });
    }
};