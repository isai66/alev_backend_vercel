const db = require('../models/db')

module.exports.getUserData = (req, res) => {
    try {
        const usuario = req.params.id;
        db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [usuario], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'Error al obtener los datos del usuario' });
            } else if (result.length === 0) {
                res.status(404).json({ error: 'Usuario no encontrado' });
            } else {
                res.status(200).json(result[0]); // Asegúrate de enviar el objeto correcto
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

module.exports.updateUser = (req, res) => {
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
    const id = req.params.id;

    // Query para actualizar la información del usuario
    try{
        db.query('UPDATE usuarios SET username = ?, nombre = ?, apellido = ?, codigopostal = ?,  estado = ?, municipio = ?, colonia = ?, calle = ?, numinterior = ?, numexterior = ?, passwords = ?, email = ?, telefono = ? WHERE id_usuario = ?',[usuario,nombre,apellido,codigoPostal,estado,municipio,colonia,calle,numint,numext,contrasena,correo,telefono,id],
        (err,result)=>{
            if(err){
                res.send(err);
                console.log(err);
            }
            else{
                console.log("Usuario actualizado con éxito");
                res.send({message:"Usuario actualzado con éxito"});
            }
        })

    }
    catch(e){

    }
};

module.exports.deleteUser = (req, res) => {
    const id = req.params.id;
    console.log(id)

    // Query para actualizar la información del usuario
    try{
        db.query('DELETE FROM usuarios WHERE id_usuario = ?',[id],
        (err,result)=>{
            if(err){
                res.send(err);
                console.log(err);
            }
            else{
                console.log("Usuario ELIMINADO con éxito");
                res.send({message:"Usuario ELIMINADO con éxito"});
            }
        })

    }
    catch(e){

    }
};