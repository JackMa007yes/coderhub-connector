const fileService = require("../services/file.service");
const userService = require("../services/user.service");
const { AVATAR_PATH } = require("../constants/file-path");

const fs = require("fs");

class UserController {
  async create(ctx, next) {
    //获取用户请求传递的参数
    const user = ctx.request.body;
    //查询参数
    const result = await userService.create(user);

    //返回参数
    ctx.body = result;
  }

  async avaterInfo(ctx, next) {
    const { userId } = ctx.params;
    const avatarInfo = await fileService.getAvatarByUserId(userId);
    ctx.response.set("content-type", avatarInfo.mimetype);
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`);
  }
}

module.exports = new UserController();
