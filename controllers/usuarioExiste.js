const db = require('../models/db')

module.exports.usuarioExiste = (req, res) => {
    const { usuario } = req.query;

    if (!usuario) {
        return res.status(400).json({ error: true, message: 'El parámetro usuario es requerido.' });
    }

    // Verificar en la tabla de usuarios
    const queryUsuarios = 'SELECT COUNT(*) as count FROM usuarios WHERE username = ?';

    db.query(queryUsuarios, [usuario], (err, result) => {
        if (err) {
            console.error('Error querying usuarios:', err);
            return res.status(500).json({ error: true, message: 'Error en el servidor al consultar usuarios.' });
        }

        if (result[0].count > 0) {
            return res.json({ exists: true });
        }

        // Si no se encuentra en la tabla de usuarios, verificar en la tabla de empleados
        const queryEmpleados = 'SELECT COUNT(*) as count FROM empleado WHERE username = ?';

        db.query(queryEmpleados, [usuario], (err, result) => {
            if (err) {
                console.error('Error querying empleados:', err);
                return res.status(500).json({ error: true, message: 'Error en el servidor al consultar empleados.' });
            }

            if (result[0].count > 0) {
                return res.json({ exists: true });
            } else {
                return res.json({ exists: false });
            }
        });
    });
}