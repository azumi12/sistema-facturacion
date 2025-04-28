// Archivo principal de JavaScript para la página de ventas

document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let detallesVenta = [];
    let clienteSeleccionado = null;
    let vendedores = [];
    
    // Elementos del DOM
    const ventaForm = document.getElementById('ventaForm');
    const tablaDetalles = document.getElementById('tablaDetalles').getElementsByTagName('tbody')[0];
    const btnNuevaVenta = document.getElementById('btnNuevaVenta');
    const btnBuscarCliente = document.getElementById('btnBuscarCliente');
    const btnBuscarProducto = document.getElementById('btnBuscarProducto');
    const btnAgregarProducto = document.getElementById('btnAgregarProducto');
    const btnCancelar = document.getElementById('btnCancelar');
    const btnGuardar = document.getElementById('btnGuardar');
    
    // Inicialización
    inicializarFormulario();
    cargarVendedores();
    
    // Event Listeners
    btnNuevaVenta.addEventListener('click', limpiarFormulario);
    btnBuscarCliente.addEventListener('click', abrirModalBuscarCliente);
    btnBuscarProducto.addEventListener('click', abrirModalBuscarProducto);
    btnAgregarProducto.addEventListener('click', agregarProductoADetalle);
    btnCancelar.addEventListener('click', limpiarFormulario);
    ventaForm.addEventListener('submit', guardarVenta);
    
    document.getElementById('btnBuscarClienteModal').addEventListener('click', buscarClientes);
    document.getElementById('btnBuscarProductoModal').addEventListener('click', buscarProductos);
    
    // Buscar cliente por DNI/RUC al perder el foco
    document.getElementById('dni_ruc').addEventListener('blur', function() {
        const dniRuc = this.value.trim();
        if (dniRuc) {
            buscarClientePorDniRuc(dniRuc);
        }
    });
    
    // Buscar producto por código al perder el foco
    document.getElementById('codigo').addEventListener('blur', function() {
        const codigo = this.value.trim();
        if (codigo) {
            buscarProductoPorCodigo(codigo);
        }
    });
    
    // Funciones
    function inicializarFormulario() {
        // Establecer fecha actual
        const hoy = new Date();
        const fechaFormateada = hoy.toISOString().split('T')[0];
        document.getElementById('fecha').value = fechaFormateada;
        
        // Obtener último número de comprobante
        obtenerUltimoNumeroComprobante();
    }
    
    function cargarVendedores() {
        fetch('/api/vendedores')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    vendedores = data.data;
                    const selectVendedor = document.getElementById('vendedor');
                    selectVendedor.innerHTML = '<option value="">Seleccione vendedor</option>';
                    
                    vendedores.forEach(vendedor => {
                        const option = document.createElement('option');
                        option.value = vendedor.id;
                        option.textContent = vendedor.nombre;
                        selectVendedor.appendChild(option);
                    });
                }
            })
            .catch(error => console.error('Error al cargar vendedores:', error));
    }
    
    function obtenerUltimoNumeroComprobante() {
        const comprob = document.getElementById('comprob').value;
        const serie = document.getElementById('serie').value;
        
        fetch(`/api/ventas/ultimo-numero?comprob=${comprob}&serie=${serie}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('numero').value = data.data + 1;
                } else {
                    document.getElementById('numero').value = 1;
                }
            })
            .catch(error => {
                console.error('Error al obtener último número:', error);
                document.getElementById('numero').value = 1;
            });
    }
    
    function buscarClientePorDniRuc(dniRuc) {
        fetch(`/api/clientes/dni-ruc/${dniRuc}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    clienteSeleccionado = data.data;
                    document.getElementById('cliente_id').value = clienteSeleccionado.id;
                    document.getElementById('nombres').value = clienteSeleccionado.nombres;
                    document.getElementById('direccion').value = clienteSeleccionado.direccion || '';
                    document.getElementById('celular').value = clienteSeleccionado.celular || '';
                    document.getElementById('email').value = clienteSeleccionado.email || '';
                    document.getElementById('cumple_dia').value = clienteSeleccionado.cumple_dia || 0;
                    document.getElementById('cumple_mes').value = clienteSeleccionado.cumple_mes || 0;
                } else {
                    // Cliente no encontrado, limpiar campos
                    document.getElementById('cliente_id').value = '';
                    document.getElementById('nombres').value = '';
                    document.getElementById('direccion').value = '';
                    document.getElementById('celular').value = '';
                    document.getElementById('email').value = '';
                    document.getElementById('cumple_dia').value = 0;
                    document.getElementById('cumple_mes').value = 0;
                }
            })
            .catch(error => console.error('Error al buscar cliente:', error));
    }
    
    function buscarProductoPorCodigo(codigo) {
        fetch(`/api/productos/codigo/${codigo}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const producto = data.data;
                    document.getElementById('producto_id').value = producto.id;
                    document.getElementById('descripcion').value = producto.descripcion;
                    document.getElementById('precio').value = producto.precio;
                } else {
                    // Producto no encontrado, limpiar campos
                    document.getElementById('producto_id').value = '';
                    document.getElementById('descripcion').value = '';
                    document.getElementById('precio').value = '';
                }
            })
            .catch(error => console.error('Error al buscar producto:', error));
    }
    
    function abrirModalBuscarCliente() {
        // Limpiar tabla de clientes
        document.getElementById('tablaClientes').getElementsByTagName('tbody')[0].innerHTML = '';
        
        // Mostrar modal
        const modalBuscarCliente = new bootstrap.Modal(document.getElementById('modalBuscarCliente'));
        modalBuscarCliente.show();
    }
    
    function abrirModalBuscarProducto() {
        // Limpiar tabla de productos
        document.getElementById('tablaProductos').getElementsByTagName('tbody')[0].innerHTML = '';
        
        // Mostrar modal
        const modalBuscarProducto = new bootstrap.Modal(document.getElementById('modalBuscarProducto'));
        modalBuscarProducto.show();
    }
    
    function buscarClientes() {
        const searchTerm = document.getElementById('buscarClienteInput').value.trim();
        
        if (!searchTerm) {
            alert('Ingrese un término de búsqueda');
            return;
        }
        
        fetch(`/api/clientes/search?searchTerm=${searchTerm}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const clientes = data.data;
                    const tablaBody = document.getElementById('tablaClientes').getElementsByTagName('tbody')[0];
                    tablaBody.innerHTML = '';
                    
                    clientes.forEach(cliente => {
                        const row = tablaBody.insertRow();
                        row.innerHTML = `
                            <td>${cliente.dni_ruc}</td>
                            <td>${cliente.nombres}</td>
                            <td>${cliente.direccion || ''}</td>
                            <td>${cliente.celular || ''}</td>
                            <td>
                                <button class="btn btn-sm btn-primary btn-seleccionar-cliente" data-id="${cliente.id}">
                                    <i class="bi bi-check-circle"></i> Seleccionar
                                </button>
                            </td>
                        `;
                    });
                    
                    // Agregar event listeners a los botones de seleccionar
                    document.querySelectorAll('.btn-seleccionar-cliente').forEach(btn => {
                        btn.addEventListener('click', function() {
                            const clienteId = this.getAttribute('data-id');
                            seleccionarCliente(clienteId);
                        });
                    });
                } else {
                    alert('Error al buscar clientes: ' + data.message);
                }
            })
            .catch(error => console.error('Error al buscar clientes:', error));
    }
    
    function buscarProductos() {
        const searchTerm = document.getElementById('buscarProductoInput').value.trim();
        
        if (!searchTerm) {
            alert('Ingrese un término de búsqueda');
            return;
        }
        
        fetch(`/api/productos/search?searchTerm=${searchTerm}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const productos = data.data;
                    const tablaBody = document.getElementById('tablaProductos').getElementsByTagName('tbody')[0];
                    tablaBody.innerHTML = '';
                    
                    productos.forEach(producto => {
                        const row = tablaBody.insertRow();
                        row.innerHTML = `
                            <td>${producto.codi_barra}</td>
                            <td>${producto.descripcion}</td>
                            <td>${producto.precio.toFixed(2)}</td>
                            <td>${producto.stock}</td>
                            <td>
                                <button class="btn btn-sm btn-primary btn-seleccionar-producto" data-id="${producto.id}">
                                    <i class="bi bi-check-circle"></i> Seleccionar
                                </button>
                            </td>
                        `;
                    });
                    
                    // Agregar event listeners a los botones de seleccionar
                    document.querySelectorAll('.btn-seleccionar-producto').forEach(btn => {
                        btn.addEventListener('click', function() {
                            const productoId = this.getAttribute('data-id');
                            seleccionarProducto(productoId);
                        });
                    });
                } else {
                    alert('Error al buscar productos: ' + data.message);
                }
            })
            .catch(error => console.error('Error al buscar productos:', error));
    }
    
    function seleccionarCliente(clienteId) {
        fetch(`/api/clientes/${clienteId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    clienteSeleccionado = data.data;
                    document.getElementById('cliente_id').value = clienteSeleccionado.id;
                    document.getElementById('dni_ruc').value = clienteSeleccionado.dni_ruc;
                    document.getElementById('nombres').value = clienteSeleccionado.nombres;
                    document.getElementById('direccion').value = clienteSeleccionado.direccion || '';
                    document.getElementById('celular').value = clienteSeleccionado.celular || '';
                    document.getElementById('email').value = clienteSeleccionado.email || '';
                    document.getElementById('cumple_dia').value = clienteSeleccionado.cumple_dia || 0;
                    document.getElementById('cumple_mes').value = clienteSeleccionado.cumple_mes || 0;
                    
                    // Cerrar modal
                    bootstrap.Modal.getInstance(document.getElementById('modalBuscarCliente')).hide();
                } else {
                    alert('Error al seleccionar cliente: ' + data.message);
                }
            })
            .catch(error => console.error('Error al seleccionar cliente:', error));
    }
    
    function seleccionarProducto(productoId) {
        fetch(`/api/productos/${productoId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const producto = data.data;
                    document.getElementById('producto_id').value = producto.id;
                    document.getElementById('codigo').value = producto.codi_barra;
                    document.getElementById('descripcion').value = producto.descripcion;
                    document.getElementById('precio').value = producto.precio;
                    
                    // Cerrar modal
                    bootstrap.Modal.getInstance(document.getElementById('modalBuscarProducto')).hide();
                } else {
                    alert('Error al seleccionar producto: ' + data.message);
                }
            })
            .catch(error => console.error('Error al seleccionar producto:', error));
    }
    
    function agregarProductoADetalle() {
        const productoId = document.getElementById('producto_id').value;
        const codigo = document.getElementById('codigo').value;
        const descripcion = document.getElementById('descripcion').value;
        const precio = parseFloat(document.getElementById('precio').value);
        const cantidad = parseInt(document.getElementById('cantidad').value);
        
        if (!productoId || !codigo || !descripcion || isNaN(precio) || isNaN(cantidad) || cantidad <= 0) {
            alert('Por favor complete todos los campos del producto correctamente');
            return;
        }
        
        // Verificar si el producto ya está en la lista
        const productoExistente = detallesVenta.find(item => item.producto_id === productoId);
        if (productoExistente) {
            // Actualizar cantidad e importe
            productoExistente.cantidad += cantidad;
            productoExistente.importe = productoExistente.cantidad * productoExistente.precio_unitario;
        } else {
            // Agregar nuevo producto
            const importe = precio * cantidad;
            detallesVenta.push({
                producto_id: productoId,
                codi_barra: codigo,
                descripcion: descripcion,
                precio_unitario: precio,
                descuento: 0,
                cantidad: cantidad,
                importe: importe
            });
        }
        
        // Actualizar tabla
        actualizarTablaDetalles();
        
        // Calcular totales
        calcularTotales();
        
        // Limpiar campos de producto
        document.getElementById('producto_id').value = '';
        document.getElementById('codigo').value = '';
        document.getElementById('descripcion').value = '';
        document.getElementById('precio').value = '';
        document.getElementById('cantidad').value = '1';
    }
    
    function actualizarTablaDetalles() {
        tablaDetalles.innerHTML = '';
        
        detallesVenta.forEach((detalle, index) => {
            const row = tablaDetalles.insertRow();
            row.innerHTML = `
                <td>${detalle.codi_barra}</td>
                <td>${detalle.descripcion}</td>
                <td>${detalle.precio_unitario.toFixed(2)}</td>
                <td>${detalle.descuento.toFixed(2)}</td>
                <td>${detalle.cantidad}</td>
                <td>${detalle.importe.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-danger btn-eliminar-detalle" data-index="${index}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
        });
        
        // Agregar event listeners a los botones de eliminar
        document.querySelectorAll('.btn-eliminar-detalle').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                eliminarDetalle(index);
            });
        });
    }
    
    function eliminarDetalle(index) {
        detallesVenta.splice(index, 1);
        actualizarTablaDetalles();
        calcularTotales();
    }
    
    function calcularTotales() {
        let subtotal = 0;
        let descuentoGlobal = 0;
        
        detallesVenta.forEach(detalle => {
            subtotal += detalle.importe;
            descuentoGlobal += detalle.descuento;
        });
        
        const igv = subtotal * 0.18;
        const total = subtotal + igv;
        
        document.getElementById('subtotal').value = subtotal.toFixed(2);
        document.getElementById('descuento_global').value = descuentoGlobal.toFixed(2);
        document.getElementById('igv').value = igv.toFixed(2);
        document.getElementById('total').value = total.toFixed(2);
    }
    
    function limpiarFormulario() {
        ventaForm.reset();
        detallesVenta = [];
        clienteSeleccionado = null;
        tablaDetalles.innerHTML = '';
        document.getElementById('cliente_id').value = '';
        document.getElementById('producto_id').value = '';
        
        // Reiniciar valores
        inicializarFormulario();
        calcularTotales();
    }
    
    function guardarVenta(event) {
        event.preventDefault();
        
        if (detallesVenta.length === 0) {
            alert('Debe agregar al menos un producto a la venta');
            return;
        }
        
        if (!document.getElementById('cliente_id').value) {
            alert('Debe seleccionar un cliente');
            return;
        }
        
        if (!document.getElementById('vendedor').value) {
            alert('Debe seleccionar un vendedor');
            return;
        }
        
        // Preparar datos de la venta
        const ventaData = {
            comprob: document.getElementById('comprob').value,
            serie: document.getElementById('serie').value,
            numero: parseInt(document.getElementById('numero').value),
            fecha: document.getElementById('fecha').value,
            vendedor_id: parseInt(document.getElementById('vendedor').value),
            cliente_id: parseInt(document.getElementById('cliente_id').value),
            formato: document.querySelector('input[name="formato"]:checked').value,
            moneda: document.getElementById('moneda').value,
            subtotal: parseFloat(document.getElementById('subtotal').value),
            descuento_global: parseFloat(document.getElementById('descuento_global').value),
            igv: parseFloat(document.getElementById('igv').value),
            total: parseFloat(document.getElementById('total').value),
            credito: false,
            detalles: detallesVenta
        };
        
        // Enviar datos al servidor
        fetch('/api/ventas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ventaData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Venta registrada exitosamente');
                limpiarFormulario();
            } else {
                alert('Error al registrar venta: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error al registrar venta:', error);
            alert('Error al registrar venta. Consulte la consola para más detalles.');
        });
    }
});
