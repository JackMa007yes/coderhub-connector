const Router = require("koa-router");
const { create, avaterInfo } = require("../controller/user.controller");
const { verifyUser, handlePassword } = require("../middleware/user.middleware");

const userRouter = new Router({ prefix: "/users" });

userRouter.post("/", verifyUser, handlePassword, create);
userRouter.get("/:userId/avatar", avaterInfo);

module.exports = userRouter;
