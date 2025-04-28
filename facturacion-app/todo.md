# Sistema de Facturación - Validación de Funcionalidad

## Estado del Proyecto
- [x] Análisis de requisitos del sistema de facturación
- [x] Creación de la estructura de base de datos MySQL
- [x] Desarrollo del backend Node.js
- [x] Implementación de controladores y modelos
- [x] Creación del frontend básico
- [x] Integración del frontend con el backend
- [ ] Validación de la funcionalidad del sistema
- [ ] Entrega del código completo

## Pruebas a Realizar

### Módulo de Clientes
- [ ] Listar clientes
- [ ] Buscar cliente por nombre
- [ ] Buscar cliente por DNI/RUC
- [ ] Crear nuevo cliente
- [ ] Editar cliente existente
- [ ] Eliminar cliente

### Módulo de Productos
- [ ] Listar productos
- [ ] Buscar producto por descripción
- [ ] Buscar producto por código de barras
- [ ] Crear nuevo producto
- [ ] Editar producto existente
- [ ] Eliminar producto
- [ ] Verificar funcionalidad de mostrar/ocultar costo

### Módulo de Ventas
- [ ] Inicializar nueva venta
- [ ] Buscar y seleccionar cliente
- [ ] Buscar y seleccionar productos
- [ ] Agregar productos al detalle de venta
- [ ] Eliminar productos del detalle de venta
- [ ] Calcular subtotal, IGV y total correctamente
- [ ] Guardar venta completa
- [ ] Verificar actualización de stock

## Instrucciones para Ejecutar el Sistema

1. Configurar la base de datos MySQL:
   ```
   mysql -u root -p < database.sql
   ```

2. Instalar dependencias:
   ```
   cd facturacion-app
   npm install
   ```

3. Crear archivo .env con la configuración:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_password
   DB_NAME=facturacion_db
   ```

4. Iniciar el servidor:
   ```
   npm start
   ```

5. Acceder al sistema en el navegador:
   ```
   http://localhost:3000
   ```
