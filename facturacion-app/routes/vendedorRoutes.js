const express = require('express');
const router = express.Router();
const vendedorController = require('../controllers/vendedorController');

// Rutas para vendedores
router.get('/', vendedorController.getAllVendedores);
router.get('/:id', vendedorController.getVendedorById);
router.post('/', vendedorController.createVendedor);
router.post('/login', vendedorController.login);
router.put('/:id', vendedorController.updateVendedor);
router.delete('/:id', vendedorController.deleteVendedor);

module.exports = router;
