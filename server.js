require("dotenv").config(); //cargi tidi lo de dotenv
require("./config/db"); //enlazo servidor con DB
const cors = require (`cors`)
const express = require (`express`);//Llamo a express con todas sus funciones
const server = express();//las cargo a nuestro servidor

//express como middlewares
server.use(express.static(`public`));
server.use(express.json());
server.use(express.urlencoded({extended: true }));

//external middlewares
server.use(cors());

//users routing
server.use("/api/users", require ("./users/UsersRt"))
//Post routing
server.use("/api/posts", require("./posts/postsRt"));


server.listen(3030, (err)=> {
    !err?
    console.log(`server Running: http://localhost:3030`)
    :
    console.log(`server ${err}`);
} ) //abro el puerto

server.use(( req, res, next)=>{
    let error = new Error();
    error.message = "Resource not Found";
    error.status = 404;
    next(error);
});

server.use((error, req, res, next)=>{
    if (!error.status) error.status = 400;
    res.status(error.status)
    .json({status: error.status, message: error.message})
})