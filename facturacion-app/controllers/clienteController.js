const Cliente = require('../models/clienteModel');

// Obtener todos los clientes
exports.getAllClientes = async (req, res) => {
  try {
    const clientes = await Cliente.getAll();
    res.status(200).json({
      success: true,
      data: clientes
    });
  } catch (error) {
    console.error('Error en controlador getAllClientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener clientes',
      error: error.message
    });
  }
};

// Obtener cliente por ID
exports.getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.getById(id);
    
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: cliente
    });
  } catch (error) {
    console.error('Error en controlador getClienteById:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener cliente',
      error: error.message
    });
  }
};

// Buscar cliente por DNI/RUC
exports.getClienteByDniRuc = async (req, res) => {
  try {
    const { dniRuc } = req.params;
    const cliente = await Cliente.getByDniRuc(dniRuc);
    
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: cliente
    });
  } catch (error) {
    console.error('Error en controlador getClienteByDniRuc:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar cliente',
      error: error.message
    });
  }
};

// Crear nuevo cliente
exports.createCliente = async (req, res) => {
  try {
    const { dni_ruc, nombres, direccion, celular, email, cumple_dia, cumple_mes } = req.body;
    
    // Validaciones básicas
    if (!dni_ruc || !nombres) {
      return res.status(400).json({
        success: false,
        message: 'DNI/RUC y nombres son campos obligatorios'
      });
    }
    
    // Verificar si ya existe un cliente con el mismo DNI/RUC
    const clienteExistente = await Cliente.getByDniRuc(dni_ruc);
    if (clienteExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un cliente con ese DNI/RUC'
      });
    }
    
    const nuevoCliente = await Cliente.create({
      dni_ruc,
      nombres,
      direccion,
      celular,
      email,
      cumple_dia,
      cumple_mes
    });
    
    res.status(201).json({
      success: true,
      message: 'Cliente creado exitosamente',
      data: nuevoCliente
    });
  } catch (error) {
    console.error('Error en controlador createCliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear cliente',
      error: error.message
    });
  }
};

// Actualizar cliente
exports.updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { dni_ruc, nombres, direccion, celular, email, cumple_dia, cumple_mes } = req.body;
    
    // Validaciones básicas
    if (!dni_ruc || !nombres) {
      return res.status(400).json({
        success: false,
        message: 'DNI/RUC y nombres son campos obligatorios'
      });
    }
    
    // Verificar si el cliente existe
    const clienteExistente = await Cliente.getById(id);
    if (!clienteExistente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }
    
    // Verificar si el nuevo DNI/RUC ya está en uso por otro cliente
    if (dni_ruc !== clienteExistente.dni_ruc) {
      const clienteDniRucExistente = await Cliente.getByDniRuc(dni_ruc);
      if (clienteDniRucExistente && clienteDniRucExistente.id !== parseInt(id)) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe otro cliente con ese DNI/RUC'
        });
      }
    }
    
    const clienteActualizado = await Cliente.update(id, {
      dni_ruc,
      nombres,
      direccion,
      celular,
      email,
      cumple_dia,
      cumple_mes
    });
    
    res.status(200).json({
      success: true,
      message: 'Cliente actualizado exitosamente',
      data: clienteActualizado
    });
  } catch (error) {
    console.error('Error en controlador updateCliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar cliente',
      error: error.message
    });
  }
};

// Eliminar cliente
exports.deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el cliente existe
    const clienteExistente = await Cliente.getById(id);
    if (!clienteExistente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }
    
    await Cliente.delete(id);
    
    res.status(200).json({
      success: true,
      message: 'Cliente eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error en controlador deleteCliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar cliente',
      error: error.message
    });
  }
};

// Buscar clientes por nombre
exports.searchClientesByName = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Término de búsqueda requerido'
      });
    }
    
    const clientes = await Cliente.searchByName(searchTerm);
    
    res.status(200).json({
      success: true,
      data: clientes
    });
  } catch (error) {
    console.error('Error en controlador searchClientesByName:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar clientes',
      error: error.message
    });
  }
};
