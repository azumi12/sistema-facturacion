-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS facturacion_db;
USE facturacion_db;

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dni_ruc VARCHAR(20) UNIQUE,
    nombres VARCHAR(100),
    direccion VARCHAR(200),
    celular VARCHAR(20),
    email VARCHAR(100),
    cumple_dia INT,
    cumple_mes INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codi_barra VARCHAR(20) UNIQUE,
    descripcion VARCHAR(200),
    precio DECIMAL(10,2),
    costo DECIMAL(10,2),
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de vendedores
CREATE TABLE IF NOT EXISTS vendedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    usuario VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comprob VARCHAR(20),
    serie VARCHAR(10),
    numero INT,
    fecha DATE,
    vendedor_id INT,
    cliente_id INT,
    formato VARCHAR(10),
    moneda VARCHAR(10),
    subtotal DECIMAL(10,2),
    descuento_global DECIMAL(10,2) DEFAULT 0,
    igv DECIMAL(10,2),
    total DECIMAL(10,2),
    credito BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (vendedor_id) REFERENCES vendedores(id)
);

-- Tabla de detalle de ventas
CREATE TABLE IF NOT EXISTS detalle_ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT,
    producto_id INT,
    cantidad INT,
    precio_unitario DECIMAL(10,2),
    descuento DECIMAL(10,2) DEFAULT 0,
    importe DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Insertar datos de ejemplo para vendedores
INSERT INTO vendedores (nombre, usuario, password) VALUES
('KATHERINE', 'katherine', '$2a$10$1qAz2wSx3eDc4rFv5tGb5t');

-- Insertar datos de ejemplo para productos
INSERT INTO productos (codi_barra, descripcion, precio, costo, stock) VALUES
('000002', 'DISCO 4 1/2 PARA METAL M/3M', 6.56, 4.50, 100);

-- Insertar datos de ejemplo para clientes
INSERT INTO clientes (dni_ruc, nombres, direccion, celular, email, cumple_dia, cumple_mes) VALUES
('46142984', 'VARIOS', 'Huanuco', '', '', 0, 0);
