const { Router } = require("express");

const UserModel = require("../src/models/user.model");
const bcrypt = require("bcrypt");
const userRouter = Router();
const jwt = require("jsonwebtoken");
const client = require("../redisConfig");

const authConfig = require("../src/config/auth");

userRouter.get("/home", (req, res) => {
  res.contentType("application/html");
  res.status(200).send("<h1>Home page/h1>");
});

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

userRouter.post("/users", async (req, res) => {
  const { email } = req.body;

  try {
    if (await UserModel.findOne({ email }))
      return res.status(400).send({ error: "User already exists" });

    const user = await UserModel.create(req.body);

    user.password = undefined;

    return res.send({
      user,
      token: generateToken({ id: user.id }),
    });
  } catch (error) {
    return res.status(400).send({ error: "Registration failed" });
  }
});

userRouter.get("/users", async (req, res) => {
  try {
    const cachedUsers = await client.get("users")
    if(cachedUsers) {
      return res.status(200).json({cached: true,
        data: cachedUsers});
    }
    const users = await UserModel.find({});
    client.set("users", JSON.stringify(users))
    res.status(200).json({cached: false, data: users});
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) return res.status(400).send({ error: "User not found" });

  if (!(await bcrypt.compare(password, user.password)))
    return res.status(400).send({ error: "Invalid password" });

  user.password = undefined;

  res.send({
    user,
    token: generateToken({ id: user.id }),
  });
});


module.exports = userRouter;
