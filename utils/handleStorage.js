//Para almacenar archivos en nuestra api
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, callback) =>{
        const pathStorage = `${__dirname}/../public/storage`;
        callback(null,pathStorage);
    },
    filename: (req, file, callback) =>{
        const ext = file.originalname.split(".").pop();
        const filename = `usrPic_${Date.now()}.${ext}`;
        callback(null, filename)
    }
})
const uploadPic = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        !file
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(
          new Error("Files allowed: .png, .jpg and .jpeg format allowed!")
        );
      }
    },
  });

module.exports = uploadPic;