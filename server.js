const express = require("express");
const UserRouter = require("./routers/user.router");
const dotenv = require("dotenv");
const connectToDatabase = require("./src/database/connect");
dotenv.config();

connectToDatabase();

const app = express();

app.use(express.json());
app.use(UserRouter);

const port = 8080;

app.listen(port, () => console.log(`Server is running on port: ${port}!`));
