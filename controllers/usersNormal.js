const db = require('../models/db');

module.exports.usersNormal = (req, res) => {
  try {
    db.query('SELECT * FROM empleado', (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error fetching users');
      } else {
        res.send(result);
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).send('Internal Server Error');
  }
};

// Función para convertir un usuario a empleado
module.exports.convertToUser = (req, res) => {
  const userId = req.params.id;

  // Transacción para asegurar que ambos pasos se completan correctamente
  db.beginTransaction((err) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Transaction Error');
    }

    // Paso 1: Insertar datos en la tabla `empleados`
    const insertQuery = 'INSERT INTO usuarios (nombre, apellido, codigopostal, estado, municipio, colonia, calle, telefono, numinterior, numexterior, email, username, passwords, rol) SELECT nombre, apellido, codigopostal, estado, municipio, colonia, calle, telefono, numinterior, numexterior, email, username, passwords FROM empleado WHERE id_usuario = ?';
    db.query(insertQuery, [userId], (err, results) => {
      if (err) {
        return db.rollback(() => {
          console.log(err);
          res.status(500).send('Error inserting into employees');
        });
      }

      // Paso 2: Eliminar el usuario de la tabla `usuarios`
      const deleteQuery = 'DELETE FROM empleado WHERE id_usuario = ?';
      db.query(deleteQuery, [userId], (err) => {
        if (err) {
          return db.rollback(() => {
            console.log(err);
            res.status(500).send('Error deleting user');
          });
        }

        // Confirmar la transacción
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              console.log(err);
              res.status(500).send('Transaction commit error');
            });
          }
          res.send('User converted to employee successfully');
        });
      });
    });
  });
};
