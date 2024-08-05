const db = require('../models/db')

module.exports.signup = (req,res) =>  {
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

    try{
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

    }
    catch(e){

    }

}