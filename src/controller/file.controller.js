const fileService = require("../services/file.service");
const { AVATAR_PATH } = require("../constants/file-path");
const userService = require("../services/file.service");
const { APP_HOST, APP_PORT } = require("../app/config");

class FileController {
  async saveAvatarInfo(ctx, next) {
    const { mimetype, filename, size } = ctx.req.file;
    const { id } = ctx.user;
    const result = await fileService.createAvatar(filename, mimetype, size, id);

    const avatarUrl = `${APP_HOST}:${APP_PORT}/user/${id}/avatar`;
    await userService.updataAvatarUrlById(avatarUrl, id);
    ctx.body = "上传头像成功";
  }

  async savePictureInfo(ctx, next) {
    const files = ctx.req.files;
    const { momentId } = ctx.query;
    const { id } = ctx.user;
    for (let file of files) {
      const { mimetype, filename, size } = file;
      await fileService.creatPicture(filename, mimetype, size, id, momentId);
    }
    ctx.body = "图片上传完成";
  }
}

module.exports = new FileController();
