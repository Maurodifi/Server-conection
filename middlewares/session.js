const {tokenVerify} = require("../utils/handeJWT");

const isAuth = async (req, res, next) => {
    let error = new Error("Forbidden access | Invalid token");
    if (!req.headers.authorization) {
        let error = new Error("No token provided");
        error.status = 403;
        return next(error);
    }
    const token = req.headers.authorization.split(" ").pop();

    
    const verifiedToken = await tokenVerify(token);
    if (verifiedToken instanceof Error) { //pregunto si es un objeto de error
        error.status = 401;
        error.message = "Invalid token";
        return next(error);
    }
    next();
}

module.exports = isAuth