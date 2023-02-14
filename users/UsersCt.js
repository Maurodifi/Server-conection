//controlador
const User = require("./UsersMd");
const bc = require("../utils/handlePassword");
const public_url = process.env.public_url;
const jwt= require("../utils/handeJWT");

//Obtener todos los usuarios
const getAllUsers = (req, res, next) => {
    User.find()
      .then((data) => {
        !data.length ? next() : res.status(200).json(data);
      })
      .catch((error) => {
        error.status = 500;
        next(error);
      });
  };
//Crear usuario
const createUser = async (req, res, next) => {
    const password = await bc.hashPassword(req.body.password);
    
    /* const profilePic = `${public_url}/storage/${req.file.profilePic}` */
    let pic = "";
  if (req.file) {
    pic = `${public_url}/storage/${req.file.filename}`;
  }

    //send to DB
    const newUser =  new User({...req.body, password, profilePic: pic });
    newUser.save((error, result) => {
        if (error) {
          error.status = 400;
          next(error);
        } else {
          res.status(200).json(newUser);
        }
      });
};

//Eliminar Usuario
const deleteUsersById = async (req, res, next) =>{
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ user: user.id, message: "usuario borrado "})
    }catch (error){
        next();
    }
}

//Actualizar Usuario
const updateUser = async (req, res) => {
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true})
        res.status(200).json({ user: user.id, message: "usuario actualizado "})
    }catch(error){
        next();
    }
}

// Login 
const loginUser = async (req, res, next) => {
  let error = new Error("Email or Password Invalid");
  const user = await User.find().where({email: req.body.email});
  if(!user.length){
    error.status = 401;
    return next(error);
  }
  const hashedPassword = user[0].password;
  const match = await bc.checkPassword(req.body.password, hashedPassword)
  if (!match){
    error.status = 401;
    return next(error);
  }

  //gestión de token
  const userForToken = {
    email: user[0].email,
    fullName: user[0].fullName,
    userName: user[0].userName,
  };

  const accessToken = await jwt.tokenSign(userForToken, "1h");
  res.status(200).json({
    message: "access granted",
    token: accessToken,
    userData: userForToken,
  });

}

module.exports = {getAllUsers, deleteUsersById, createUser, updateUser, loginUser};
