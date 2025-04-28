const { pool } = require('./db');

class Venta {
  // Obtener todas las ventas
  static async getAll() {
    try {
      const [rows] = await pool.query(`
        SELECT v.*, c.nombres as cliente_nombre, vd.nombre as vendedor_nombre
        FROM ventas v
        LEFT JOIN clientes c ON v.cliente_id = c.id
        LEFT JOIN vendedores vd ON v.vendedor_id = vd.id
        ORDER BY v.fecha DESC, v.id DESC
      `);
      return rows;
    } catch (error) {
      console.error('Error al obtener ventas:', error);
      throw error;
    }
  }

  // Obtener venta por ID
  static async getById(id) {
    try {
      // Obtener datos de la venta
      const [ventaRows] = await pool.query(`
        SELECT v.*, c.nombres as cliente_nombre, c.dni_ruc, c.direccion, c.celular, c.email,
               vd.nombre as vendedor_nombre
        FROM ventas v
        LEFT JOIN clientes c ON v.cliente_id = c.id
        LEFT JOIN vendedores vd ON v.vendedor_id = vd.id
        WHERE v.id = ?
      `, [id]);
      
      if (ventaRows.length === 0) {
        return null;
      }
      
      const venta = ventaRows[0];
      
      // Obtener detalles de la venta
      const [detallesRows] = await pool.query(`
        SELECT dv.*, p.codi_barra, p.descripcion
        FROM detalle_ventas dv
        JOIN productos p ON dv.producto_id = p.id
        WHERE dv.venta_id = ?
      `, [id]);
      
      venta.detalles = detallesRows;
      
      return venta;
    } catch (error) {
      console.error('Error al obtener venta por ID:', error);
      throw error;
    }
  }

  // Crear nueva venta
  static async create(ventaData) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const { 
        comprob, serie, numero, fecha, vendedor_id, cliente_id, 
        formato, moneda, subtotal, descuento_global, igv, total, 
        credito, detalles 
      } = ventaData;
      
      // Insertar venta
      const [ventaResult] = await connection.query(
        `INSERT INTO ventas (
          comprob, serie, numero, fecha, vendedor_id, cliente_id, 
          formato, moneda, subtotal, descuento_global, igv, total, credito
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          comprob, serie, numero, fecha, vendedor_id, cliente_id, 
          formato, moneda, subtotal, descuento_global || 0, igv, total, 
          credito || false
        ]
      );
      
      const ventaId = ventaResult.insertId;
      
      // Insertar detalles de venta
      for (const detalle of detalles) {
        const { producto_id, cantidad, precio_unitario, descuento, importe } = detalle;
        
        await connection.query(
          `INSERT INTO detalle_ventas (
            venta_id, producto_id, cantidad, precio_unitario, descuento, importe
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [ventaId, producto_id, cantidad, precio_unitario, descuento || 0, importe]
        );
        
        // Actualizar stock del producto
        await connection.query(
          'UPDATE productos SET stock = stock - ? WHERE id = ?',
          [cantidad, producto_id]
        );
      }
      
      await connection.commit();
      
      return {
        id: ventaId,
        ...ventaData
      };
    } catch (error) {
      await connection.rollback();
      console.error('Error al crear venta:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Anular venta
  static async anular(id) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Obtener detalles de la venta para restaurar stock
      const [detallesRows] = await connection.query(
        'SELECT producto_id, cantidad FROM detalle_ventas WHERE venta_id = ?',
        [id]
      );
      
      // Restaurar stock de productos
      for (const detalle of detallesRows) {
        await connection.query(
          'UPDATE productos SET stock = stock + ? WHERE id = ?',
          [detalle.cantidad, detalle.producto_id]
        );
      }
      
      // Eliminar detalles de venta
      await connection.query('DELETE FROM detalle_ventas WHERE venta_id = ?', [id]);
      
      // Eliminar venta
      await connection.query('DELETE FROM ventas WHERE id = ?', [id]);
      
      await connection.commit();
      
      return true;
    } catch (error) {
      await connection.rollback();
      console.error('Error al anular venta:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Obtener último número de comprobante por tipo y serie
  static async getUltimoNumero(comprob, serie) {
    try {
      const [rows] = await pool.query(
        'SELECT MAX(numero) as ultimo FROM ventas WHERE comprob = ? AND serie = ?',
        [comprob, serie]
      );
      
      return rows[0].ultimo || 0;
    } catch (error) {
      console.error('Error al obtener último número de comprobante:', error);
      throw error;
    }
  }

  // Buscar ventas por fecha
  static async searchByDate(fechaInicio, fechaFin) {
    try {
      const [rows] = await pool.query(`
        SELECT v.*, c.nombres as cliente_nombre, vd.nombre as vendedor_nombre
        FROM ventas v
        LEFT JOIN clientes c ON v.cliente_id = c.id
        LEFT JOIN vendedores vd ON v.vendedor_id = vd.id
        WHERE v.fecha BETWEEN ? AND ?
        ORDER BY v.fecha DESC, v.id DESC
      `, [fechaInicio, fechaFin]);
      
      return rows;
    } catch (error) {
      console.error('Error al buscar ventas por fecha:', error);
      throw error;
    }
  }

  // Buscar ventas por cliente
  static async searchByCliente(clienteId) {
    try {
      const [rows] = await pool.query(`
        SELECT v.*, c.nombres as cliente_nombre, vd.nombre as vendedor_nombre
        FROM ventas v
        LEFT JOIN clientes c ON v.cliente_id = c.id
        LEFT JOIN vendedores vd ON v.vendedor_id = vd.id
        WHERE v.cliente_id = ?
        ORDER BY v.fecha DESC, v.id DESC
      `, [clienteId]);
      
      return rows;
    } catch (error) {
      console.error('Error al buscar ventas por cliente:', error);
      throw error;
    }
  }
}

module.exports = Venta;
