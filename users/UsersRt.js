//routes
const router = require("express").Router();
const userCt = require("./UsersCt")
const uploadPic = require("../utils/handleStorage")
const validator = require("../validators/users")
router.get("/", userCt.getAllUsers)
router.post("/", uploadPic.single("profilePic"), validator.createUser,userCt.createUser)
router.put("/:id", userCt.updateUser)
router.delete("/:id",  userCt.deleteUsersById)
router.post ("/login",userCt.loginUser)



module.exports = router;