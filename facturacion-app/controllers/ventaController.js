const Venta = require('../models/ventaModel');
const Cliente = require('../models/clienteModel');
const Producto = require('../models/productoModel');
const { pool } = require('../models/db');

// Obtener todas las ventas
exports.getAllVentas = async (req, res) => {
  try {
    const ventas = await Venta.getAll();
    res.status(200).json({
      success: true,
      data: ventas
    });
  } catch (error) {
    console.error('Error en controlador getAllVentas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ventas',
      error: error.message
    });
  }
};

// Obtener venta por ID
exports.getVentaById = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await Venta.getById(id);
    
    if (!venta) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      data: venta
    });
  } catch (error) {
    console.error('Error en controlador getVentaById:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener venta',
      error: error.message
    });
  }
};

// Crear nueva venta
exports.createVenta = async (req, res) => {
  try {
    const { 
      comprob, serie, numero, fecha, vendedor_id, cliente_id, 
      formato, moneda, subtotal, descuento_global, igv, total, 
      credito, detalles 
    } = req.body;
    
    // Validaciones básicas
    if (!comprob || !serie || !fecha || !vendedor_id || !cliente_id || !detalles || detalles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios para la venta'
      });
    }
    
    // Verificar si el cliente existe
    const cliente = await Cliente.getById(cliente_id);
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }
    
    // Obtener último número de comprobante si no se proporciona
    let numeroComprobante = numero;
    if (!numeroComprobante) {
      const ultimoNumero = await Venta.getUltimoNumero(comprob, serie);
      numeroComprobante = ultimoNumero + 1;
    }
    
    // Validar detalles de venta
    for (const detalle of detalles) {
      const { producto_id, cantidad, precio_unitario } = detalle;
      
      if (!producto_id || !cantidad || !precio_unitario) {
        return res.status(400).json({
          success: false,
          message: 'Faltan campos obligatorios en los detalles de venta'
        });
      }
      
      // Verificar si el producto existe
      const producto = await Producto.getById(producto_id);
      if (!producto) {
        return res.status(404).json({
          success: false,
          message: `Producto con ID ${producto_id} no encontrado`
        });
      }
      
      // Verificar stock disponible
      if (producto.stock < cantidad) {
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para el producto ${producto.descripcion}`
        });
      }
    }
    
    // Crear venta
    const nuevaVenta = await Venta.create({
      comprob,
      serie,
      numero: numeroComprobante,
      fecha,
      vendedor_id,
      cliente_id,
      formato,
      moneda,
      subtotal,
      descuento_global: descuento_global || 0,
      igv,
      total,
      credito: credito || false,
      detalles
    });
    
    res.status(201).json({
      success: true,
      message: 'Venta creada exitosamente',
      data: nuevaVenta
    });
  } catch (error) {
    console.error('Error en controlador createVenta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear venta',
      error: error.message
    });
  }
};

// Anular venta
exports.anularVenta = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si la venta existe
    const venta = await Venta.getById(id);
    if (!venta) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada'
      });
    }
    
    await Venta.anular(id);
    
    res.status(200).json({
      success: true,
      message: 'Venta anulada exitosamente'
    });
  } catch (error) {
    console.error('Error en controlador anularVenta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al anular venta',
      error: error.message
    });
  }
};

// Buscar ventas por fecha
exports.searchVentasByDate = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        success: false,
        message: 'Fechas de inicio y fin son requeridas'
      });
    }
    
    const ventas = await Venta.searchByDate(fechaInicio, fechaFin);
    
    res.status(200).json({
      success: true,
      data: ventas
    });
  } catch (error) {
    console.error('Error en controlador searchVentasByDate:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar ventas por fecha',
      error: error.message
    });
  }
};

// Buscar ventas por cliente
exports.searchVentasByCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    
    // Verificar si el cliente existe
    const cliente = await Cliente.getById(clienteId);
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }
    
    const ventas = await Venta.searchByCliente(clienteId);
    
    res.status(200).json({
      success: true,
      data: ventas
    });
  } catch (error) {
    console.error('Error en controlador searchVentasByCliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar ventas por cliente',
      error: error.message
    });
  }
};

// Generar comprobante PDF
exports.generarComprobantePDF = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si la venta existe
    const venta = await Venta.getById(id);
    if (!venta) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada'
      });
    }
    
    // Aquí se implementaría la generación del PDF con pdfkit
    // Por simplicidad, solo devolvemos un mensaje de éxito
    
    res.status(200).json({
      success: true,
      message: 'Comprobante generado exitosamente',
      // En una implementación real, aquí se devolvería la URL del PDF generado
      data: {
        ventaId: id,
        pdfUrl: `/api/ventas/${id}/comprobante.pdf`
      }
    });
  } catch (error) {
    console.error('Error en controlador generarComprobantePDF:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar comprobante PDF',
      error: error.message
    });
  }
};
