const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require('cors');
const axios = require('axios');
const routes = require('./api/endPoint')

const allowedOrigins = ['https://alevosia-vercel.vercel.app', 'https://alevosia.host8b.me'];

const corsOptions = {
  origin: (origin, callback) => {
    // Verificar si el origen de la solicitud está en la lista de permitidos
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// Usar CORS con las opciones configuradas
app.use(cors(corsOptions));

//app.use(cors());
/*app.use(cors({
    origin: ["https://alevosia-vercel.vercel.app"], // Permitir todos los orígenes
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permitir ciertos métodos HTTP
   allowedHeaders: ['Content-Type', 'Authorization'] // Permitir ciertos encabezados personalizados
  }));*/

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.listen(3001,()=>{
    console.log("El servidor esta corriendo en el puerto 3001")
})




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
  


  
app.use('/', routes);




/*app.post("/login",(req,res)=>{

    const loginUsuario = req.body.loginUsuario;
    const loginContrasena = req.body.loginContrasena;

    const ipAddress = req.ip;

    db.query('SELECT * FROM usuarios WHERE username = ? && passwords = ?',[loginUsuario,loginContrasena],
    (err,result)=>{
        if(err){
            res.send({error: err});
        }
        if(result.length > 0){

            const usuarios = result[0];
            const loginTime = new Date().toISOString();
            const insertQuery = `INSERT INTO bitacora_logins (ip, tipo, date, username, email) VALUES (?, ?, ?, ?, ?)`;
            db.query(insertQuery, [ipAddress,'Login', loginTime, usuarios.username, usuarios.email], (err) => {
                if (err) {
                res.status(500).send('Error al registrar inicio de sesión');
                return;
                }})

            res.send(result)

            
        }
        else{
            console.log("Los datos no coinciden");
            res.send({message:"Los datos no coinciden"});
        }
    })
});*/
