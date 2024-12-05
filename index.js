const express = require("express");
const app = express();
const mysql = require("mysql");
const axios = require('axios');
const routes = require('./api/endPoint');

// Permitir todos los orígenes con CORS
const cors = require('cors');

// Permitir solicitudes desde un dominio específico
const corsOptions = {
origin: (origin, callback) => {
        callback(null, true); // Permite cualquier origen
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Si necesitas enviar cookies o credenciales
};

app.use(cors(corsOptions));


// Middleware para analizar solicitudes JSON y codificadas en URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar el servidor en el puerto 3001
app.listen(3001, () => {
    console.log("El servidor está corriendo en el puerto 3001");
});

// Endpoint para obtener datos de código postal
app.get('/codigo_postal', (req, res) => {
    const { cp } = req.query;
    axios.get(`https://api.tau.com.mx/dipomex/v1/codigo_postal?cp=${cp}`, {
        headers: {
            'APIKEY': '25c492cbb417541887d5e55769f370f6fb775efc'
        }
    })
    .then(response => {
        res.json(response.data);
    })
    .catch(error => {
        res.status(500).send(error.message);
    });
});

// Endpoint para obtener productos con descuento (ejemplo)
app.get('/discounted-products', async (req, res) => {
    try {
        // Obtén los productos de la base de datos (este es un ejemplo simplificado)
        const products = await getProductsFromDatabase(); // Implementa esta función

        // Envía cada producto al servidor Flask para determinar si merece descuento
        const discountedProducts = [];

        for (let product of products) {
            const prediction = await axios.post('http://localhost:5000/predict_discount', product);
            if (prediction.data.descuento) {
                discountedProducts.push(product);
            }

            // Limita el número de productos a 10
            if (discountedProducts.length >= 10) {
                break;
            }
        }

        res.json(discountedProducts);
    } catch (error) {
        console.error('Error al obtener productos con descuento:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Agregar las rutas adicionales
app.use('/', routes);

/* 
// Si usas autenticación o necesitas bitácoras, descomenta y ajusta este bloque
app.post("/login", (req, res) => {
    const loginUsuario = req.body.loginUsuario;
    const loginContrasena = req.body.loginContrasena;

    const ipAddress = req.ip;

    db.query('SELECT * FROM usuarios WHERE username = ? && passwords = ?', [loginUsuario, loginContrasena],
    (err, result) => {
        if (err) {
            res.send({ error: err });
        }
        if (result.length > 0) {
            const usuarios = result[0];
            const loginTime = new Date().toISOString();
            const insertQuery = `INSERT INTO bitacora_logins (ip, tipo, date, username, email) VALUES (?, ?, ?, ?, ?)`;
            db.query(insertQuery, [ipAddress, 'Login', loginTime, usuarios.username, usuarios.email], (err) => {
                if (err) {
                    res.status(500).send('Error al registrar inicio de sesión');
                    return;
                }
            });
            res.send(result);
        } else {
            console.log("Los datos no coinciden");
            res.send({ message: "Los datos no coinciden" });
        }
    });
});
*/
