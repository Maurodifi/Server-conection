require("dotenv").config(); //cargi tidi lo de dotenv
require("./config/db"); //enlazo servidor con DB
const express = require (`express`);//Llamo a express con todas sus funciones
const server = express();//las cargo a nuestro servidor

server.get('/api/teams',(req, res)=>{
    res.send("accedemos a los equipos"); 
});

server.post('/api/teams',(req, res)=>{
    res.send("Agregamos un equipo");
});

server.delete('/api/teams/:id',(req, res)=>{
    res.send(`Borramos el equipo: ` + req.params.id);//pasamos el equipo por parametro (id)
});

server.use(express.static(`public`))

server.listen(3030, (err)=> {
    !err?
    console.log(`server Running: http://localhost:3030`)
    :
    console.log(`server ${err}`);
} ) //abro el puerto

