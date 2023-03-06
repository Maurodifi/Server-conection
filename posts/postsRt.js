const postCt = require("./postsCt");
const isAuth = require("../middlewares/session");
const router = require("express").Router();
const uploadPic = require("../utils/handleStorage")
router.get("/", postCt.listAllPosts);
router.post("/", isAuth , uploadPic.single("postPic"),postCt.createNewPost);
router.get("/find/:query", postCt.findByRace);
router.delete("/:id", postCt.deletePost);
module.exports = router;
