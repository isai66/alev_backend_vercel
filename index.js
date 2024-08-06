const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require('cors');
const axios = require('axios');
const routes = require('./api/endPoint')



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


  app.get('/codigo_postal', (req, res) => {
    const { cp } = req.query;
    axios.get(`https://api.tau.com.mx/dipomex/v1/codigo_postal?cp=${cp}`, {
        headers: {
            'APIKEY': '25c492cbb417541887d5e55769f370f6fb775efc'
        }
    })
    .then(response => {
        res.json(response.data);
    })
    .catch(error => {
        res.status(500).send(error.message);
    });
});


  
app.use('/', routes);




/*app.post("/login",(req,res)=>{

    const loginUsuario = req.body.loginUsuario;
    const loginContrasena = req.body.loginContrasena;

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
});*/
