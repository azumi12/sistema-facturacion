const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Rutas para productos
router.get('/', productoController.getAllProductos);
router.get('/search', productoController.searchProductosByDescription);
router.get('/:id', productoController.getProductoById);
router.get('/codigo/:codigoBarras', productoController.getProductoByCodigoBarras);
router.post('/', productoController.createProducto);
router.put('/:id', productoController.updateProducto);
router.delete('/:id', productoController.deleteProducto);

module.exports = router;
