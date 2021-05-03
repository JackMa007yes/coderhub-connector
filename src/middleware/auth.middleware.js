const jwt = require("jsonwebtoken");

const errorTypes = require("../constants/error-types");
const userService = require("../services/user.service");
const authService = require("../services/auth.service");
const md5password = require("../utils/password-handle");
const { PUBLIC_KEY } = require("../app/config");

const verifyLogin = async (ctx, next) => {
  const { name, password } = ctx.request.body;
  //是否为空
  if (!name || !password) {
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit("error", error, ctx);
  }

  //是否存在
  const result = await userService.getUserByName(name);
  const user = result[0];

  if (!user) {
    const error = new Error(errorTypes.USER_DOESNOT_EXISTS);
    return ctx.app.emit("error", error, ctx);
  }
  //密码错误（加密后对比）
  if (md5password(password) !== user.password) {
    const error = new Error(errorTypes.PASSWORD_IS_INCORRENT);
    return ctx.app.emit("error", error, ctx);
  }

  ctx.user = user;

  await next();
};

const verifyAuth = async (ctx, next) => {
  const authorization = ctx.headers.authorization;
  if (!authorization) {
    const error = new Error(errorTypes.UNAUTHERIZATION);
    ctx.app.emit("error", error, ctx);
    return;
  }
  const token = authorization.replace("Bearer ", "");
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    ctx.user = result;
    await next();
  } catch (err) {
    const error = new Error(errorTypes.UNAUTHERIZATION);
    ctx.app.emit("error", error, ctx);
  }
};

const verifyPermission = async (ctx, next) => {
  const [resourceKey] = Object.keys(ctx.params);
  const tableName = resourceKey.replace("Id", "");
  const resourceId = ctx.params[resourceKey];
  const id = ctx.user.id;
  try {
    const isPermission = await authService.checkResource(
      tableName,
      resourceId,
      id
    );
    if (!isPermission) throw new Error();
    await next();
  } catch (err) {
    const error = new Error(errorTypes.UNPERMISSION);
    return ctx.app.emit("error", error, ctx);
  }

  //查询数据库 验证是否具备权限
};

module.exports = { verifyLogin, verifyAuth, verifyPermission };
