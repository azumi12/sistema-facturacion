const { pool } = require('./db');

class Producto {
  // Obtener todos los productos
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM productos ORDER BY descripcion');
      return rows;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  }

  // Obtener producto por ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error al obtener producto por ID:', error);
      throw error;
    }
  }

  // Buscar producto por código de barras
  static async getByCodigoBarras(codigoBarras) {
    try {
      const [rows] = await pool.query('SELECT * FROM productos WHERE codi_barra = ?', [codigoBarras]);
      return rows[0];
    } catch (error) {
      console.error('Error al buscar producto por código de barras:', error);
      throw error;
    }
  }

  // Crear nuevo producto
  static async create(productoData) {
    try {
      const { codi_barra, descripcion, precio, costo, stock } = productoData;
      
      const [result] = await pool.query(
        'INSERT INTO productos (codi_barra, descripcion, precio, costo, stock) VALUES (?, ?, ?, ?, ?)',
        [codi_barra, descripcion, precio, costo || 0, stock || 0]
      );
      
      return {
        id: result.insertId,
        ...productoData
      };
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  }

  // Actualizar producto
  static async update(id, productoData) {
    try {
      const { codi_barra, descripcion, precio, costo, stock } = productoData;
      
      await pool.query(
        'UPDATE productos SET codi_barra = ?, descripcion = ?, precio = ?, costo = ?, stock = ? WHERE id = ?',
        [codi_barra, descripcion, precio, costo || 0, stock || 0, id]
      );
      
      return {
        id,
        ...productoData
      };
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  }

  // Eliminar producto
  static async delete(id) {
    try {
      await pool.query('DELETE FROM productos WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  }

  // Buscar productos por descripción
  static async searchByDescription(searchTerm) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM productos WHERE descripcion LIKE ? ORDER BY descripcion',
        [`%${searchTerm}%`]
      );
      return rows;
    } catch (error) {
      console.error('Error al buscar productos por descripción:', error);
      throw error;
    }
  }

  // Actualizar stock de producto
  static async updateStock(id, cantidad) {
    try {
      await pool.query(
        'UPDATE productos SET stock = stock - ? WHERE id = ?',
        [cantidad, id]
      );
      return true;
    } catch (error) {
      console.error('Error al actualizar stock de producto:', error);
      throw error;
    }
  }
}

module.exports = Producto;
