const { Router } = require("express");
const userRouter = Router();
const authMiddleware = require("../middlewares/auth");

userRouter.use(authMiddleware);


userRouter.get("/projects", (req, res) => {
    res.send({ ok: true});
  });
  

  module.exports = userRouter;
  