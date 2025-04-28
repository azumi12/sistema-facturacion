const Producto = require('../models/productoModel');

// Obtener todos los productos
exports.getAllProductos = async (req, res) => {
  try {
    const productos = await Producto.getAll();
    res.status(200).json({
      success: true,
      data: productos
    });
  } catch (error) {
    console.error('Error en controlador getAllProductos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      error: error.message
    });
  }
};

// Obtener producto por ID
exports.getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.getById(id);
    
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: producto
    });
  } catch (error) {
    console.error('Error en controlador getProductoById:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto',
      error: error.message
    });
  }
};

// Buscar producto por código de barras
exports.getProductoByCodigoBarras = async (req, res) => {
  try {
    const { codigoBarras } = req.params;
    const producto = await Producto.getByCodigoBarras(codigoBarras);
    
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: producto
    });
  } catch (error) {
    console.error('Error en controlador getProductoByCodigoBarras:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar producto',
      error: error.message
    });
  }
};

// Crear nuevo producto
exports.createProducto = async (req, res) => {
  try {
    const { codi_barra, descripcion, precio, costo, stock } = req.body;
    
    // Validaciones básicas
    if (!codi_barra || !descripcion || !precio) {
      return res.status(400).json({
        success: false,
        message: 'Código de barras, descripción y precio son campos obligatorios'
      });
    }
    
    // Verificar si ya existe un producto con el mismo código de barras
    const productoExistente = await Producto.getByCodigoBarras(codi_barra);
    if (productoExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un producto con ese código de barras'
      });
    }
    
    const nuevoProducto = await Producto.create({
      codi_barra,
      descripcion,
      precio,
      costo,
      stock
    });
    
    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: nuevoProducto
    });
  } catch (error) {
    console.error('Error en controlador createProducto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear producto',
      error: error.message
    });
  }
};

// Actualizar producto
exports.updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { codi_barra, descripcion, precio, costo, stock } = req.body;
    
    // Validaciones básicas
    if (!codi_barra || !descripcion || !precio) {
      return res.status(400).json({
        success: false,
        message: 'Código de barras, descripción y precio son campos obligatorios'
      });
    }
    
    // Verificar si el producto existe
    const productoExistente = await Producto.getById(id);
    if (!productoExistente) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    // Verificar si el nuevo código de barras ya está en uso por otro producto
    if (codi_barra !== productoExistente.codi_barra) {
      const productoCodigoExistente = await Producto.getByCodigoBarras(codi_barra);
      if (productoCodigoExistente && productoCodigoExistente.id !== parseInt(id)) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe otro producto con ese código de barras'
        });
      }
    }
    
    const productoActualizado = await Producto.update(id, {
      codi_barra,
      descripcion,
      precio,
      costo,
      stock
    });
    
    res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: productoActualizado
    });
  } catch (error) {
    console.error('Error en controlador updateProducto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar producto',
      error: error.message
    });
  }
};

// Eliminar producto
exports.deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el producto existe
    const productoExistente = await Producto.getById(id);
    if (!productoExistente) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    await Producto.delete(id);
    
    res.status(200).json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error en controlador deleteProducto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto',
      error: error.message
    });
  }
};

// Buscar productos por descripción
exports.searchProductosByDescription = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Término de búsqueda requerido'
      });
    }
    
    const productos = await Producto.searchByDescription(searchTerm);
    
    res.status(200).json({
      success: true,
      data: productos
    });
  } catch (error) {
    console.error('Error en controlador searchProductosByDescription:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar productos',
      error: error.message
    });
  }
};
