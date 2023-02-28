require("dotenv").config(); //cargi tidi lo de dotenv
require("./config/db"); //enlazo servidor con DB
const cors = require (`cors`)
const express = require (`express`);//Llamo a express con todas sus funciones
const server = express();//las cargo a nuestro servidor
const exphbs = require("express-handlebars"); //llamo al handlebars
const path = require("path");


//Cargo bootstrap
server.use(
    "/css",
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
  );
  server.use(
    "/js",
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
  ); 
//Configuro Handlebars
const hbs = exphbs.create({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"), 
    partialsDir: path.join(__dirname, "views/partials"),
    helpers: {
      errBelowInput: function (arr, inputName) {
        if (!arr) return null;
        const warning = arr.find((el) => el.param === inputName);
        if (warning == undefined) {
          return null;
        } else {
          return `
          <div class="alert alert-danger" role="alert">
              ${warning.msg}
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
              ></button>
            </div>
          `;
        }
      },
    },
  });
  server.set("views", "./views");
  server.engine("handlebars", hbs.engine);
  server.set("view engine", "handlebars");



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