const Router = require("koa-router");

const { verifyAuth } = require("../middleware/auth.middleware");
const {
  avatarHandler,
  pictureHandler,
  pictureResize,
} = require("../middleware/file.middleware");
const {
  saveAvatarInfo,
  savePictureInfo,
} = require("../controller/file.controller");

const filerouter = new Router({ prefix: "/upload" });

filerouter.post("/avatar", verifyAuth, avatarHandler, saveAvatarInfo);
filerouter.post(
  "/picture",
  verifyAuth,
  pictureHandler,
  pictureResize,
  savePictureInfo
);

module.exports = filerouter;
