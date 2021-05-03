const errorType = require("../constants/error-types");
const userService = require("../services/user.service");
const md5password = require("../utils/password-handle");

const verifyUser = async (ctx, next) => {
  const { name, password } = ctx.request.body;
  //判断不能为空
  if (!name || !password) {
    const error = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit("error", error, ctx);
  }
  //判断不重复
  const result = await userService.getUserByName(name);
  if (result.length) {
    const error = new Error(errorType.USER_ALREADEY_EXISTS);
    return ctx.app.emit("error", error, ctx);
  }

  await next(); //防止提前返回 下一步可能是异步操作
};

const handlePassword = async (ctx, next) => {
  let { password } = ctx.request.body;
  ctx.request.body.password = md5password(password);
  await next();
};

module.exports = {
  verifyUser,
  handlePassword,
};
