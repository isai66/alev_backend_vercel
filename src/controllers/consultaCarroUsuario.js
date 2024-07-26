const db = require('../models/db')

module.exports.consultaCarroUsuario = (req, res) =>{

    const {loginUsuario} = {'username' : 'lams99'};
    
    console.log(loginUsuario);

    try{
        db.query('SELECT u.nombre AS nombreUsuario, p.Nombre AS nombreProducto, p.Precio AS precioProducto, p.Imagen AS imagenProducto, c.cantidad_producto AS cantidadProductoCarrito, i.Stock AS stockProducto FROM carritos AS c INNER JOIN usuarios AS u ON c.id_usuario = u.id_usuario INNER JOIN tblprenda AS p ON c.id_producto = p.ID_Prenda INNER JOIN inventario AS i ON p.ID_Prenda = i.id_prenda WHERE u.username = ?',[loginUsuario],
    (err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result);
        }
    });
    } catch (e){

    }
}