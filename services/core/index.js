require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path');


const BASE_PATH = process.env.BASE_PATH || "";
const port = process.env.PORT || 3000;

const loginRouter = require("./routes/client/login");
const registerRouter = require("./routes/client/register");
const userRouter = require("./routes/client/user");
const usersRouter = require("./routes/client/users");
const updateUserRouter = require("./routes/client/updateUser");
const deleteUserRouter = require("./routes/client/deleteUser");
const logoutRouter = require("./routes/client/logout");

const modelQueryRouter = require("./routes/api/query");

const auth = require("./middleware/auth");

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(`${BASE_PATH}/client/login`, loginRouter);
app.use(`${BASE_PATH}/client/register`, registerRouter);
app.use(`${BASE_PATH}/client/logout`, logoutRouter);

app.use(`${BASE_PATH}/client/user`, auth, userRouter);
app.use(`${BASE_PATH}/client/users`, auth, usersRouter);
app.use(`${BASE_PATH}/client/updateUsers`, auth, updateUserRouter);
app.use(`${BASE_PATH}/client/deleteUser`, auth, deleteUserRouter);

app.use(`${BASE_PATH}/api/query`, modelQueryRouter);


app.use(BASE_PATH, express.static(path.join(__dirname, '../dist')));
app.get(`${BASE_PATH}/*path`, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});