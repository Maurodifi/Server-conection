const jwt = require("jsonwebtoken");
const jwt_secret = process.env.jwt_secret

/* Crea el token y recibe el objeto usuario */
const tokenSign = async (user, time) => {
    const sign = jwt.sign(user, jwt_secret, {expiresIn: time})
    return sign;
}

/* Verificamos si el token es valido */

const tokenVerify = async (tokenJWT) =>{
    try{
        return jwt.verify (tokenJWT, jwt_secret);
    } catch(error){
        return error;
    }
}

module.exports = {tokenSign, tokenVerify}