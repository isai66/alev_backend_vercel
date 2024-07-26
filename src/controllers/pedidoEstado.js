const db = require('../models/db');

module.exports.pedidoEstado = (req, res) => {
    try {
        db.query('SELECT Estado FROM estado_pedido', (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error fetching data');
            } else {
                res.json(result);
            }
        });
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};
