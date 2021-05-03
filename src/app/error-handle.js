const errorTypes = require("../constants/error-types");

const errorHandler = (err, ctx) => {
  let status, message;
  switch (err.message) {
    case errorTypes.NAME_OR_PASSWORD_IS_REQUIRED:
      status = 400;
      message = "用户名和密码不能为空";
      break;
    case errorTypes.USER_ALREADEY_EXISTS:
      status = 409;
      message = "用户名已经存在";
      break;
    case errorTypes.USER_DOESNOT_EXISTS:
      status = 400;
      message = "用户名不存在";
      break;
    case errorTypes.PASSWORD_IS_INCORRENT:
      status = 400;
      message = "密码不正确";
      break;
    case errorTypes.UNAUTHERIZATION:
      status = 401;
      message = "无效token";
      break;
    case errorTypes.UNPERMISSION:
      status = 401;
      message = "您没有权限";
      break;
    case errorTypes.NORESOURCE:
      status = 410;
      message = "资源不存在";
      break;
    default:
      status = 404;
      message = "NOT FOUND";
  }

  ctx.status = status;
  ctx.body = message;
};

module.exports = { errorHandler };
