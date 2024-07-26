const db = require('../models/db')

module.exports.producto = (req, res) =>{
    try{
        db.query('SELECT * FROM tblprenda WHERE ID_Prenda = 18',
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

//Traer productos hombres
module.exports.TraerHombre = (req,res) =>{
    try {
        db.query('SELECT * FROM tblprenda WHERE ID_Categoria = 1 OR ID_Categoria = 4',
        (err,result)=>{
            if(err){
                console.log(err);
                res.status(500).json(['No se pudieron traer los productos de hombre'])
            }
            else{
                res.send(result);
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(['No se pudieron traer los productos de hombre'])
    }
}

module.exports.TraerMujeres = (req,res) =>{
    try {
        db.query('SELECT * FROM tblprenda WHERE ID_Categoria = 2 OR ID_Categoria = 4',
        (err,result)=>{
            if(err){
                console.log(err);
                res.status(500).json(['No se pudieron traer los productos de hombre'])
            }
            else{
                res.send(result);
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(['No se pudieron traer los productos de hombre'])
    }
}

module.exports.InsertarCarro = (req,res) =>{
    try {
        const {usuario, producto} = req.body
        console.log(usuario)
        db.query('SELECT * FROM carritos WHERE id_usuario = ? AND id_producto = ?', [usuario, producto], (err,result)=>{
            if(err){
                console.log(err);
                res.status(500).json(['No se pudo agregar el producto'])
            }
            if(result.length > 0){
                db.query('UPDATE carritos SET cantidad_producto = cantidad_producto + 1 WHERE id_usuario = ? AND id_producto = ?', [usuario,producto])
                res.status(200).json(['Se actualizo el producto al carro'])
            }
            else if(result.length === 0){
                db.query('INSERT INTO carritos (id_producto, id_usuario, cantidad_producto) VALUES(?,?,?)',[producto,usuario,1])
                res.status(200).json(['Se agrego el producto al carro'])
            }
        })
    } catch (error) {
        
    }
}

module.exports.TraerCarrito = (req,res) =>{
    try {
        const usuario = req.params.idUser
        db.query('SELECT c.id_carrito, c.id_producto, c.id_usuario, c.cantidad_producto, p.Nombre AS Nombre_Prenda, p.Descripcion AS Descripcion_Prenda, p.Imagen AS Imagen_Prenda, P.Precio AS Precio FROM carritos c JOIN tblprenda p ON c.id_producto = p.ID_Prenda WHERE c.id_usuario = ?', [usuario], (err,result)=>{
            if(err){
                console.log(err);
                res.status(500).json(['Error'])
            }
            else{
                res.status(200).json(result)
            }
        })
    } catch (error) {
        
    }
}


module.exports.Mas = (req,res) =>{
    try {
        const {carrito} = req.body
        db.query('UPDATE carritos SET cantidad_producto = cantidad_producto + 1 WHERE id_carrito = ?', [carrito])
        res.status(200).json(['Se agrego el producto al carro'])
    } catch (error) {
        
    }
}

module.exports.Menos = (req,res) =>{
    try {
        const {carrito} = req.body
        db.query('UPDATE carritos SET cantidad_producto = cantidad_producto - 1 WHERE id_carrito = ?', [carrito])
        res.status(200).json(['Se quito el producto del carro'])
    } catch (error) {
        
    }
}

module.exports.EliminarCarro = (req,res) =>{
    try {
        const {carrito} = req.body
        db.query('DELETE FROM carritos WHERE id_carrito = ?', [carrito])
        res.status(200).json(['Se elimino el carro'])
    } catch (error) {
        
    }
}
module.exports.CompraRealizada = (req, res) => {
    try {
        const { id_usuario, total } = req.body;
        // Paso 1: Obtener detalles de la compra del carrito del usuario
        db.query('SELECT * FROM carritos WHERE id_usuario = ?', [id_usuario], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json(['Error']);
            }
            if (result.length === 0) {
                return res.status(400).json(['No hay productos en el carrito']);
            }
            // Paso 2: Insertar una nueva entrada en la tabla ventas
            const fecha = new Date();
            const ventaInsertQuery = 'INSERT INTO ventas (Fecha, TotalVent, ID_TipoPago, ID_Envio, ID_Cliente, Estado, ID_Repartidor, Total) VALUES(?,?,?,?,?,?,?,?)';
            const ventaParams = [fecha, total, 8, 9, id_usuario, 'Realizado', 1, (total + 15)];
            db.query(ventaInsertQuery, ventaParams, (err, ventaResult) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json(['Error al insertar la venta']);
                }
                const ventaId = ventaResult.insertId; // Obtener el ID de la venta insertada


                // Paso 3: Insertar una entrada en la tabla tblVentadetalle para cada artículo en el carrito
                
                db.query(`SELECT c.*, v.* FROM carritos c INNER JOIN ventas v ON v.ID_Cliente = v.ID_Cliente WHERE v.ID_Cliente = ${[id_usuario]} GROUP BY c.id_carrito`), (err, result2) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json(['Error']);
                    }
                    if (result.length === 0) {
                        return res.status(400).json(['No hay productos en el carrito']);
                    }
                    const resultString = JSON.stringify(result2);
                    console.log(resultString);

                }

                result.forEach(item => {
                    const precioPrenda = parseFloat(item.id_producto);
                    const cantidad = parseInt(item.cantidad_producto);
                
                    // Agregar registros de depuración
                    console.log(`PrecioPrenda: ${precioPrenda}, Cantidad: ${cantidad}`);
                
                    // Validar si los valores son números válidos
                    if (!isNaN(precioPrenda) && !isNaN(cantidad)) {
                        const subtotal = precioPrenda * cantidad;
                        const detalleInsertQuery = 'INSERT INTO tblventadetalle (ID_Ventas, ID_Prenda, PrecioPrenda, Cantidad, Subtotal) VALUES(?,?,?,?,?)';
                        const detalleParams = [ventaId, item.id_producto, precioPrenda, cantidad, subtotal];
                        db.query(detalleInsertQuery, detalleParams, (err, detalleResult) => {
                            if (err) {
                                console.log(err);
                                return res.status(500).json(['Error al insertar detalle de la venta']);
                            }
                        });
                    } else {
                        // Registro de depuración para identificar el problema
                        console.error(`Precio de prenda o cantidad no es un número válido para el producto con ID ${item.id_producto}`);
                    }
                });
                // Paso 4: Eliminar los productos del carrito del usuario
                db.query('DELETE FROM carritos WHERE id_usuario = ?', [id_usuario], (err, deleteResult) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json(['Error al eliminar productos del carrito']);
                    }
                    return res.status(200).json(['Compra realizada con éxito']);
                });
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(['Error interno']);
    }
};
