const express = require('express');
const router = express.Router();

const {ping} = require('../controllers/pingController')
const {login} = require('../controllers/loginController')
const {bitacora} = require('../controllers/bitacora')
const {bitacora_logins} = require('../controllers/bitacora_logins')
const {signup} = require('../controllers/signup')
const {producto, TraerHombre, InsertarCarro, TraerCarrito, Mas, Menos, EliminarCarro, TraerMujeres, CompraRealizada} = require('../controllers/producto')
const {productosGeneral} = require('../controllers/productosGeneral')
const {consultaCarroUsuario} = require('../controllers/consultaCarroUsuario')
const {pedidoEstado} = require('../controllers/pedidoEstado')
const {usuarioExiste} = require('../controllers/usuarioExiste')

router.get('/ping', ping);
router.get('/hombres', TraerHombre);
router.get('/mujeres', TraerMujeres);
router.post('/login', login);
router.post('/signup', signup);
router.get('/bitacora', bitacora);
router.get('/bitacora_logins', bitacora_logins);
router.get('/producto', producto);
router.get('/productosGeneral', productosGeneral);
router.get('/consultaCarroUsuario',consultaCarroUsuario);
router.get('/pedidoEstado', pedidoEstado);
router.get('/usuarioExiste', usuarioExiste);

//insertar carrito
router.post('/InsertarCarro', InsertarCarro);
//traer carrito
router.get('/TraerCarrito/:idUser', TraerCarrito);

//funciones ya sabes mas, menos y eliminar 
router.post('/AumentarCarro', Mas)
router.post('/QuirtarCarro', Menos)
router.post('/EliminarCarro', EliminarCarro)

//compra
router.post('/compra', CompraRealizada)


module.exports = router;