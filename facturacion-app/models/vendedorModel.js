const { pool } = require('./db');

class Vendedor {
  // Obtener todos los vendedores
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT id, nombre, usuario, activo FROM vendedores ORDER BY nombre');
      return rows;
    } catch (error) {
      console.error('Error al obtener vendedores:', error);
      throw error;
    }
  }

  // Obtener vendedor por ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT id, nombre, usuario, activo FROM vendedores WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error al obtener vendedor por ID:', error);
      throw error;
    }
  }

  // Obtener vendedor por usuario
  static async getByUsuario(usuario) {
    try {
      const [rows] = await pool.query('SELECT id, nombre, usuario, activo FROM vendedores WHERE usuario = ?', [usuario]);
      return rows[0];
    } catch (error) {
      console.error('Error al obtener vendedor por usuario:', error);
      throw error;
    }
  }

  // Crear nuevo vendedor
  static async create(vendedorData) {
    try {
      const { nombre, usuario, password } = vendedorData;
      
      const [result] = await pool.query(
        'INSERT INTO vendedores (nombre, usuario, password) VALUES (?, ?, ?)',
        [nombre, usuario, password]
      );
      
      return {
        id: result.insertId,
        nombre,
        usuario,
        activo: true
      };
    } catch (error) {
      console.error('Error al crear vendedor:', error);
      throw error;
    }
  }

  // Actualizar vendedor
  static async update(id, vendedorData) {
    try {
      const { nombre, usuario, password, activo } = vendedorData;
      
      // Si se proporciona una nueva contraseña, actualizarla también
      if (password) {
        await pool.query(
          'UPDATE vendedores SET nombre = ?, usuario = ?, password = ?, activo = ? WHERE id = ?',
          [nombre, usuario, password, activo, id]
        );
      } else {
        await pool.query(
          'UPDATE vendedores SET nombre = ?, usuario = ?, activo = ? WHERE id = ?',
          [nombre, usuario, activo, id]
        );
      }
      
      return {
        id,
        nombre,
        usuario,
        activo
      };
    } catch (error) {
      console.error('Error al actualizar vendedor:', error);
      throw error;
    }
  }

  // Eliminar vendedor
  static async delete(id) {
    try {
      await pool.query('DELETE FROM vendedores WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Error al eliminar vendedor:', error);
      throw error;
    }
  }

  // Autenticar vendedor
  static async authenticate(usuario, password) {
    try {
      const [rows] = await pool.query(
        'SELECT id, nombre, usuario, password, activo FROM vendedores WHERE usuario = ?',
        [usuario]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      const vendedor = rows[0];
      
      // En un sistema real, aquí verificaríamos la contraseña con bcrypt
      // Por simplicidad, comparamos directamente
      if (vendedor.password === password) {
        // No devolver la contraseña
        delete vendedor.password;
        return vendedor;
      }
      
      return null;
    } catch (error) {
      console.error('Error al autenticar vendedor:', error);
      throw error;
    }
  }
}

module.exports = Vendedor;
