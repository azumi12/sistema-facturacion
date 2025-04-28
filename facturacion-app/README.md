# Sistema de Facturación con Node.js y MySQL

Este proyecto implementa un sistema de facturación completo basado en Node.js con Express para el backend y MySQL como base de datos, utilizando Bootstrap para el frontend.

## Características

- Gestión de clientes (CRUD completo)
- Gestión de productos (CRUD completo)
- Gestión de vendedores (CRUD completo)
- Registro de ventas (boletas y facturas)
- Búsqueda de clientes y productos
- Cálculo automático de subtotales, IGV y totales
- Interfaz responsiva para dispositivos móviles y escritorio

## Estructura del Proyecto

```
facturacion-app/
├── controllers/        # Controladores para la lógica de negocio
├── models/             # Modelos para interactuar con la base de datos
├── routes/             # Rutas de la API
├── public/             # Archivos estáticos (CSS, JS, imágenes)
│   ├── css/
│   ├── js/
│   └── img/
├── views/              # Plantillas EJS para el frontend
├── app.js              # Archivo principal de la aplicación
├── database.sql        # Script SQL para crear la base de datos
├── .env.example        # Ejemplo de variables de entorno
└── package.json        # Dependencias del proyecto
```

## Requisitos

- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- XAMPP (opcional, para gestionar MySQL fácilmente)

## Instalación

1. Clonar el repositorio o descargar los archivos

2. Instalar dependencias:
   ```
   cd facturacion-app
   npm install
   ```

3. Configurar la base de datos:
   - Iniciar MySQL (a través de XAMPP o directamente)
   - Crear la base de datos ejecutando el script SQL:
     ```
     mysql -u root -p < database.sql
     ```

4. Configurar variables de entorno:
   - Copiar el archivo `.env.example` a `.env`
   - Modificar las variables según tu configuración local

5. Iniciar el servidor:
   ```
   npm start
   ```

6. Acceder al sistema en el navegador:
   ```
   http://localhost:3000
   ```

## Uso del Sistema

### Módulo de Ventas

1. Acceder a la sección "Ventas"
2. Seleccionar tipo de comprobante (Boleta/Factura)
3. Buscar cliente por DNI/RUC o crear uno nuevo
4. Agregar productos al detalle de venta
5. Verificar totales y guardar la venta

### Módulo de Clientes

1. Acceder a la sección "Clientes"
2. Buscar, crear, editar o eliminar clientes
3. Gestionar información de contacto y cumpleaños

### Módulo de Productos

1. Acceder a la sección "Productos"
2. Buscar, crear, editar o eliminar productos
3. Gestionar precios, costos y stock

## Tecnologías Utilizadas

- **Backend**: Node.js, Express
- **Base de datos**: MySQL
- **Frontend**: HTML, CSS, JavaScript, Bootstrap 5
- **Plantillas**: EJS
- **Dependencias principales**:
  - express: Framework web
  - mysql2: Cliente MySQL
  - bcryptjs: Encriptación de contraseñas
  - cors: Manejo de CORS
  - dotenv: Variables de entorno

## Personalización

- Modificar los estilos en `public/css/styles.css`
- Ajustar las plantillas EJS en la carpeta `views/`
- Configurar la lógica de negocio en los controladores

## Licencia

Este proyecto está disponible como código abierto bajo los términos de la licencia MIT.
