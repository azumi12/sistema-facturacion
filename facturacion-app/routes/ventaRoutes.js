const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');

// Rutas para ventas
router.get('/', ventaController.getAllVentas);
router.get('/search/date', ventaController.searchVentasByDate);
router.get('/cliente/:clienteId', ventaController.searchVentasByCliente);
router.get('/:id', ventaController.getVentaById);
router.post('/', ventaController.createVenta);
router.delete('/:id', ventaController.anularVenta);
router.get('/:id/comprobante', ventaController.generarComprobantePDF);

module.exports = router;
