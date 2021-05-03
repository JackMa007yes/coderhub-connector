const fs = require("fs");

const fileService = require("../services/file.service");
const momentService = require("../services/moment.service");
const { PICTURE_PATH } = require("../constants/file-path");

class MomentController {
  async create(ctx, next) {
    //获取数据（id,content)
    const userID = ctx.user.id;
    const content = ctx.request.body.content;
    //存入数据库
    const result = await momentService.create(userID, content);
    ctx.body = result;
  }
  async detail(ctx, next) {
    const momentId = ctx.params.momentId;
    const result = await momentService.getMomentById(momentId);

    ctx.body = result;
  }

  async list(ctx, next) {
    const { offset, size } = ctx.query;
    const result = await momentService.getMomentList(offset, size);
    ctx.body = result;
  }

  async update(ctx, next) {
    const { momentId } = ctx.params;
    const { content } = ctx.request.body;
    const result = await momentService.update(content, momentId);

    ctx.body = result;
  }

  async remove(ctx, next) {
    const { momentId } = ctx.params;
    const result = await momentService.remove(momentId);
    ctx.body = result;
  }

  async addLabels(ctx, next) {
    const { labels } = ctx;
    const { momentId } = ctx.params;
    for (let label of labels) {
      const isExist = await momentService.hasLabel(momentId, label.id);
      if (!isExist) {
        await momentService.addLabel(momentId, label.id);
      }
    }
    ctx.body = "动态添加标签成功";
  }

  async fileInfo(ctx, next) {
    let { filename } = ctx.params;
    const fileInfo = await fileService.getFileInfoByName(filename);
    const { type } = ctx.query;
    const types = ["small", "middle", "large"];
    if (types.some((item) => item === type)) {
      filename = filename + "-" + type;
    }
    ctx.response.set("content-type", fileInfo.mimetype);
    ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`);
  }
}

module.exports = new MomentController();
