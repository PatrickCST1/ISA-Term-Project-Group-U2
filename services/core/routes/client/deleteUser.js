const express = require('express');
const router = express.Router();
const { adminQuery } = require("../../db/db");

router.delete('/',async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(401).json({error: "Not authorized"});
    }

    const result = await adminQuery("users",
        "DELETE FROM users WHERE email = ?",
        [req.body.selectedUserEmail]);

    return res.status(200).json(result);
})

module.exports = router;