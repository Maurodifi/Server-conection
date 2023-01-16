//Mongo DB atlas cloud connections

const { default: mongoose } = require("mongoose");

const db_uri = process.env.db_uri;
mongoose.set(`strictQuery`, false)
mongoose.connect(db_uri, (err)=>{
    err? console.log(err):
    console.log("Mongo atlas conectado")
} )
