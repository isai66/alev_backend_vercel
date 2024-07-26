const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require('cors');
//const bodyParser = require('body-parser');
//const routes = require('./api/endPoint')
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.listen(3001,()=>{
    console.log("El servidor esta corriendo en el puerto 3001")
})

app.use(cors());
/*app.use(cors({
    origin: ["http://localhost:5173"], // Permitir todos los orígenes
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permitir ciertos métodos HTTP
   allowedHeaders: ['Content-Type', 'Authorization'] // Permitir ciertos encabezados personalizados
  }));*/
//app.use('/', routes);

//app.use(bodyParser.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'alevosia'
});

app.post("/signup",(req,res)=>{
    const usuario = req.body.usuario;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const codigoPostal = req.body.codigoPostal;
    const estado = req.body.estado;
    const municipio = req.body.municipio;
    const colonia = req.body.colonia;
    const calle = req.body.calle;
    const numint = req.body.numint;
    const numext = req.body.numext;
    const contrasena = req.body.contrasena;
    const correo = req.body.correo;
    const telefono = req.body.telefono;

    db.query('INSERT INTO usuarios(username, nombre, apellido, codigopostal, estado, municipio, colonia, calle, numinterior, numexterior, passwords, email, telefono) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',[usuario,nombre,apellido,codigoPostal,estado,municipio,colonia,calle,numint,numext,contrasena,correo,telefono],
    (err,result)=>{
        if(err){
            res.send(err);
            console.log(err);
        }
        else{
            console.log("Usuario registrado con éxito");
            res.send({message:"Usuario registrado con éxito"});
        }
    })
});

app.post("/login",(req,res)=>{

    const loginUsuario = req.body.loginUsuario;
    const loginContrasena = req.body.loginContrasena;

    console.log(loginUsuario);

    const ipAddress = req.ip;

    db.query('SELECT * FROM usuarios WHERE username = ? && passwords = ?',[loginUsuario,loginContrasena],
    (err,result)=>{
        if(err){
            res.send({error: err});
        }
        if(result.length > 0){

            const usuarios = result[0];
            const loginTime = new Date().toISOString();
            const insertQuery = `INSERT INTO bitacora_logins (ip, tipo, date, username, email) VALUES (?, ?, ?, ?, ?)`;
            db.query(insertQuery, [ipAddress,'Login', loginTime, usuarios.username, usuarios.email], (err) => {
                if (err) {
                res.status(500).send('Error al registrar inicio de sesión');
                return;
                }})

            res.send(result)

            
        }
        else{
            console.log("Los datos no coinciden");
            res.send({message:"Los datos no coinciden"});
        }
    })
});

app.get("/bitacora",(req,res)=>{

    db.query('SELECT * FROM bitacora',
    (err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result);
        }
    })
});

app.get("/bitacora_logins",(req,res)=>{

    db.query('SELECT * FROM bitacora_logins',
    (err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result);
        }
    })
});

