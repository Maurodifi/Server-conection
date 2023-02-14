const isAuth = require("../middlewares/session");
const postCt = require ("./postsCt")
const router = require("express").Router();
router.get("/", postCt.listAllPosts);
router.get("/find/:query", postCt.findByTitle);
router.post("/", isAuth ,postCt.createNewPost);
module.exports = router;
