const db = require('../models/db')

module.exports.productosPred = (req, res) =>{
    const query = 'SELECT * FROM productos_pry';
  
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener productos' });
      }
      res.json(results);
    });
  };
  
