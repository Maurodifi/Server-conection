//controlador
const User = require("./UsersMd");
const bc = require("../utils/handlePassword");
const public_url = process.env.public_url;
const jwt= require("../utils/handeJWT");
const transporter = require("../utils/handleMail");

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

// LLoguearse
const loginUser = async (req, res, next) => {
  let error = new Error("Contraseña o Email invalido");
  const user = await User.find().where({email: req.body.email});
  if(!user.length){
    error.status = 401;
    return next(error);
  }
  const password = req.body.password;
  const hashedPassword = user[0].password;
  const match = await bc.checkPassword(password, hashedPassword)
  
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
    message: "Acceso valido",
    token: accessToken,
    userData: userForToken,
  });

}

//Reseteo de contraseña
const forgot = async (req, res, next) => {
  let error = new Error("No existe un usuario con este mail");
  const user = await User.find().where({ email: req.body.email });
  if (!user.length) {
    error.status = 404;
    return next(error);
  }
  const userForToken = {
    id: user[0].id,
    name: user[0].fullName,
    email: user[0].email,
  };
  const token = await jwt.tokenSign(userForToken, "15m");
  const link = `${process.env.public_url}/api/users/reset/${token}`;
  const mailDetails = {
    from: "PetApi@gmail.com",
    to: userForToken.email,
    subject: "Recupero de contraseña",
    html: `<h2>Recupera tu contraseña</h2>
        <p>Para recuperar tu contraseña por favor hace click en el siguiente link y segui las instrucciones</p>
        <a href="${link}">click</a>
        `,
  };
  transporter.sendMail(mailDetails, (error, data) => {
    if (error) {
      error.message = error.code;
      next(error);
    } else {
      res.status(200).json({
        message: `Hola ${userForToken.name}, Enviamos las instrucciones de recupero al siguiente link ${userForToken.email}`,
      });
    }
  });
};
//Formulario para resetear contraseña
const reset = async (req, res, next) => {
  const { token } = req.params;
  const tokenStatus = jwt.tokenVerify(token);
  if (tokenStatus instanceof Error) {
    return next(tokenStatus);
  }
  res.render("reset", { tokenStatus, token });
};

//Formulario para guardar nueva contraseña
const saveNewPass = async (req, res, next) => {
  const { token } = req.params;
  const tokenStatus = await jwt.tokenVerify(token);

  if (tokenStatus instanceof Error) return next(tokenStatus);
  const newPassword = await bc.hashPassword(req.body.password_1);
  try {
    const updatedUser = await User.findByIdAndUpdate(tokenStatus.id, {
      password: newPassword,
    });
    res
      .status(200)
      .json({ message: `Contraseña cambiada para ${tokenStatus.name}` });
  } catch (error) {
    next(error);
  }
};

module.exports = {getAllUsers, deleteUsersById, createUser, updateUser, 
  loginUser, forgot, reset, saveNewPass};
