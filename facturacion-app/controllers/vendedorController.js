const Vendedor = require('../models/vendedorModel');
const bcrypt = require('bcryptjs');

// Obtener todos los vendedores
exports.getAllVendedores = async (req, res) => {
  try {
    const vendedores = await Vendedor.getAll();
    res.status(200).json({
      success: true,
      data: vendedores
    });
  } catch (error) {
    console.error('Error en controlador getAllVendedores:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener vendedores',
      error: error.message
    });
  }
};

// Obtener vendedor por ID
exports.getVendedorById = async (req, res) => {
  try {
    const { id } = req.params;
    const vendedor = await Vendedor.getById(id);
    
    if (!vendedor) {
      return res.status(404).json({
        success: false,
        message: 'Vendedor no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: vendedor
    });
  } catch (error) {
    console.error('Error en controlador getVendedorById:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener vendedor',
      error: error.message
    });
  }
};

// Crear nuevo vendedor
exports.createVendedor = async (req, res) => {
  try {
    const { nombre, usuario, password } = req.body;
    
    // Validaciones básicas
    if (!nombre || !usuario || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, usuario y contraseña son campos obligatorios'
      });
    }
    
    // Verificar si ya existe un vendedor con el mismo usuario
    const vendedorExistente = await Vendedor.getByUsuario(usuario);
    if (vendedorExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un vendedor con ese nombre de usuario'
      });
    }
    
    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const nuevoVendedor = await Vendedor.create({
      nombre,
      usuario,
      password: hashedPassword
    });
    
    res.status(201).json({
      success: true,
      message: 'Vendedor creado exitosamente',
      data: nuevoVendedor
    });
  } catch (error) {
    console.error('Error en controlador createVendedor:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear vendedor',
      error: error.message
    });
  }
};

// Actualizar vendedor
exports.updateVendedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, usuario, password, activo } = req.body;
    
    // Validaciones básicas
    if (!nombre || !usuario) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y usuario son campos obligatorios'
      });
    }
    
    // Verificar si el vendedor existe
    const vendedorExistente = await Vendedor.getById(id);
    if (!vendedorExistente) {
      return res.status(404).json({
        success: false,
        message: 'Vendedor no encontrado'
      });
    }
    
    // Verificar si el nuevo usuario ya está en uso por otro vendedor
    if (usuario !== vendedorExistente.usuario) {
      const vendedorUsuarioExistente = await Vendedor.getByUsuario(usuario);
      if (vendedorUsuarioExistente && vendedorUsuarioExistente.id !== parseInt(id)) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe otro vendedor con ese nombre de usuario'
        });
      }
    }
    
    // Preparar datos para actualización
    const vendedorData = {
      nombre,
      usuario,
      activo: activo !== undefined ? activo : true
    };
    
    // Si se proporciona una nueva contraseña, encriptarla
    if (password) {
      const salt = await bcrypt.genSalt(10);
      vendedorData.password = await bcrypt.hash(password, salt);
    }
    
    const vendedorActualizado = await Vendedor.update(id, vendedorData);
    
    res.status(200).json({
      success: true,
      message: 'Vendedor actualizado exitosamente',
      data: vendedorActualizado
    });
  } catch (error) {
    console.error('Error en controlador updateVendedor:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar vendedor',
      error: error.message
    });
  }
};

// Eliminar vendedor
exports.deleteVendedor = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el vendedor existe
    const vendedorExistente = await Vendedor.getById(id);
    if (!vendedorExistente) {
      return res.status(404).json({
        success: false,
        message: 'Vendedor no encontrado'
      });
    }
    
    await Vendedor.delete(id);
    
    res.status(200).json({
      success: true,
      message: 'Vendedor eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error en controlador deleteVendedor:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar vendedor',
      error: error.message
    });
  }
};

// Autenticar vendedor
exports.login = async (req, res) => {
  try {
    const { usuario, password } = req.body;
    
    // Validaciones básicas
    if (!usuario || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son campos obligatorios'
      });
    }
    
    // Buscar vendedor por usuario
    const [rows] = await pool.query(
      'SELECT id, nombre, usuario, password, activo FROM vendedores WHERE usuario = ?',
      [usuario]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    const vendedor = rows[0];
    
    // Verificar si el vendedor está activo
    if (!vendedor.activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo. Contacte al administrador.'
      });
    }
    
    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, vendedor.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // No devolver la contraseña
    delete vendedor.password;
    
    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: vendedor
    });
  } catch (error) {
    console.error('Error en controlador login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};
