const { pool } = require('./db');

class Cliente {
  // Obtener todos los clientes
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM clientes ORDER BY nombres');
      return rows;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    }
  }

  // Obtener cliente por ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM clientes WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error al obtener cliente por ID:', error);
      throw error;
    }
  }

  // Buscar cliente por DNI/RUC
  static async getByDniRuc(dniRuc) {
    try {
      const [rows] = await pool.query('SELECT * FROM clientes WHERE dni_ruc = ?', [dniRuc]);
      return rows[0];
    } catch (error) {
      console.error('Error al buscar cliente por DNI/RUC:', error);
      throw error;
    }
  }

  // Crear nuevo cliente
  static async create(clienteData) {
    try {
      const { dni_ruc, nombres, direccion, celular, email, cumple_dia, cumple_mes } = clienteData;
      
      const [result] = await pool.query(
        'INSERT INTO clientes (dni_ruc, nombres, direccion, celular, email, cumple_dia, cumple_mes) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [dni_ruc, nombres, direccion, celular, email, cumple_dia || 0, cumple_mes || 0]
      );
      
      return {
        id: result.insertId,
        ...clienteData
      };
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw error;
    }
  }

  // Actualizar cliente
  static async update(id, clienteData) {
    try {
      const { dni_ruc, nombres, direccion, celular, email, cumple_dia, cumple_mes } = clienteData;
      
      await pool.query(
        'UPDATE clientes SET dni_ruc = ?, nombres = ?, direccion = ?, celular = ?, email = ?, cumple_dia = ?, cumple_mes = ? WHERE id = ?',
        [dni_ruc, nombres, direccion, celular, email, cumple_dia || 0, cumple_mes || 0, id]
      );
      
      return {
        id,
        ...clienteData
      };
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      throw error;
    }
  }

  // Eliminar cliente
  static async delete(id) {
    try {
      await pool.query('DELETE FROM clientes WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      throw error;
    }
  }

  // Buscar clientes por nombre
  static async searchByName(searchTerm) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM clientes WHERE nombres LIKE ? ORDER BY nombres',
        [`%${searchTerm}%`]
      );
      return rows;
    } catch (error) {
      console.error('Error al buscar clientes por nombre:', error);
      throw error;
    }
  }
}

module.exports = Cliente;
