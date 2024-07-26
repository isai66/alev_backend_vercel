const db = require('../models/db')
const jwt = require('jsonwebtoken');

module.exports.login = (req,res) =>  {
    const {loginUsuario,loginContrasena} = req.body;
    console.log(loginUsuario);
    console.log(loginContrasena);   
    const consult = 'SELECT * FROM usuarios WHERE username = ? && passwords = ?';
    const consult2 = 'SELECT * FROM empleado WHERE username = ? && contrasenia = ?';

    try{
        const ipAddress = req.ip;
        db.query(consult,[loginUsuario,loginContrasena], (err,result)=>{
            if(err){
                res.send({error: err});
            }
            if(result.length > 0){
                console.log("soy cliente");
                const usuarios = result[0];
                console.log(usuarios);
                const loginTime = new Date().toISOString();
                const insertQuery = `INSERT INTO bitacora_logins (ip, tipo, date, username, email) VALUES (?, ?, ?, ?, ?)`;
                db.query(insertQuery, [ipAddress,'Login', loginTime, usuarios.username, usuarios.email], (err) => {
                    if (err) {
                    res.status(500).send('Error al registrar inicio de sesión');
                    return;
                    }})

                const token = jwt.sign({loginUsuario},"Stack",{
                    expiresIn: '1m'
                });
                res.send({token,data: result[0]});
                
            }
            else{
                db.query(consult2,[loginUsuario,loginContrasena],
                (err,result)=>{
                    if(err){
                        res.send({error: err});
                        return;
                    }
                    if(result.length > 0){
                        console.log("soy empleado");
                        const usuarios = result[0];
                        console.log(usuarios);
                        const token = jwt.sign({loginUsuario},"Stack",{
                            expiresIn: '10s'
                        });
                        res.send({token,data: result[0]});
                    }
                    else{
                        console.log("Los datos no coinciden");
                        res.send({message:"Los datos no coinciden"});
                    }
                })
            }
        })
    }
    catch(e){

    }



    /*
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
    })*/
}