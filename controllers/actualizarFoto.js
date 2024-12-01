const path = require('path');
const fs = require('fs');
const db = require('../models/db');

// Función para manejar la subida de archivos
module.exports.uploadFile = async (req, res) => {
  const { user } = req.body;
  const file = req.file;

  if (!file || !user) {
    return res.status(400).json({ done: false, message: `Archivo o usuario no proporcionado: usuario ${user} archivo ${file}` });
  }

  const targetDir = path.join(__dirname, '../assets/imagenes/');
  const targetFilePath = path.join(targetDir, file.originalname);

  try {
    // Renombrar el archivo al nombre original
    fs.renameSync(file.path, targetFilePath);

    // Buscar al usuario en la base de datos
    const [alumno] = await db.query(
      'SELECT vchFotoPerfil FROM usuarios WHERE username = ?',
      [user]
    );

    if (alumno.length > 0) {
      const oldFileName = alumno[0].vchFotoPerfil;

      // Actualizar la base de datos con la nueva imagen
      await db.query(
        'UPDATE usuarios SET vchFotoPerfil = ? WHERE username = ?',
        [file.originalname, user]
      );

      // Eliminar el archivo anterior si existe
      if (oldFileName && fs.existsSync(path.join(targetDir, oldFileName))) {
        fs.unlinkSync(path.join(targetDir, oldFileName));
      }

      return res.json({ done: true, message: 'Imagen subida exitosamente', name: file.originalname });
    }

    // Usuario no encontrado
    return res.status(404).json({ done: false, message: 'Usuario no encontrado' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ done: false, message: 'Error en el servidor: ' + err.message });
  }
};
