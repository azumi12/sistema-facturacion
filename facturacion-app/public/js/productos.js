// Archivo JavaScript para la gestión de productos

document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let productos = [];
    let productoSeleccionado = null;
    let modoEdicion = false;
    
    // Elementos del DOM
    const tablaProductos = document.getElementById('tablaProductos').getElementsByTagName('tbody')[0];
    const btnNuevoProducto = document.getElementById('btnNuevoProducto');
    const btnGuardarProducto = document.getElementById('btnGuardarProducto');
    const btnBuscar = document.getElementById('btnBuscar');
    const productoForm = document.getElementById('productoForm');
    const modalProducto = new bootstrap.Modal(document.getElementById('modalProducto'));
    const verCosto = document.getElementById('verCosto');
    
    // Inicialización
    cargarProductos();
    
    // Event Listeners
    btnNuevoProducto.addEventListener('click', abrirModalNuevoProducto);
    btnGuardarProducto.addEventListener('click', guardarProducto);
    btnBuscar.addEventListener('click', buscarProductos);
    
    // Mostrar/ocultar columna de costo
    verCosto.addEventListener('change', function() {
        const columnaCosto = document.querySelectorAll('.columna-costo');
        columnaCosto.forEach(col => {
            if (this.checked) {
                col.classList.remove('d-none');
            } else {
                col.classList.add('d-none');
            }
        });
    });
    
    // Funciones
    function cargarProductos() {
        fetch('/api/productos')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    productos = data.data;
                    actualizarTablaProductos();
                } else {
                    alert('Error al cargar productos: ' + data.message);
                }
            })
            .catch(error => console.error('Error al cargar productos:', error));
    }
    
    function actualizarTablaProductos() {
        tablaProductos.innerHTML = '';
        
        productos.forEach(producto => {
            const row = tablaProductos.insertRow();
            row.innerHTML = `
                <td>${producto.codi_barra}</td>
                <td>${producto.descripcion}</td>
                <td>${producto.precio.toFixed(2)}</td>
                <td class="columna-costo ${verCosto.checked ? '' : 'd-none'}">${producto.costo ? producto.costo.toFixed(2) : '0.00'}</td>
                <td>${producto.stock || 0}</td>
                <td>
                    <button class="btn btn-sm btn-primary btn-editar" data-id="${producto.id}">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-danger btn-eliminar" data-id="${producto.id}">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </td>
            `;
        });
        
        // Agregar event listeners a los botones
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', function() {
                const productoId = this.getAttribute('data-id');
                editarProducto(productoId);
            });
        });
        
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                const productoId = this.getAttribute('data-id');
                eliminarProducto(productoId);
            });
        });
    }
    
    function buscarProductos() {
        const searchTerm = document.getElementById('buscarProducto').value.trim();
        
        if (!searchTerm) {
            cargarProductos();
            return;
        }
        
        fetch(`/api/productos/search?searchTerm=${searchTerm}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    productos = data.data;
                    actualizarTablaProductos();
                } else {
                    alert('Error al buscar productos: ' + data.message);
                }
            })
            .catch(error => console.error('Error al buscar productos:', error));
    }
    
    function abrirModalNuevoProducto() {
        modoEdicion = false;
        productoSeleccionado = null;
        productoForm.reset();
        document.getElementById('producto_id').value = '';
        document.getElementById('modalProductoTitle').textContent = 'Nuevo Producto';
        modalProducto.show();
    }
    
    function editarProducto(productoId) {
        fetch(`/api/productos/${productoId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    productoSeleccionado = data.data;
                    modoEdicion = true;
                    
                    // Llenar formulario
                    document.getElementById('producto_id').value = productoSeleccionado.id;
                    document.getElementById('codi_barra').value = productoSeleccionado.codi_barra;
                    document.getElementById('descripcion').value = productoSeleccionado.descripcion;
                    document.getElementById('precio').value = productoSeleccionado.precio;
                    document.getElementById('costo').value = productoSeleccionado.costo || '';
                    document.getElementById('stock').value = productoSeleccionado.stock || 0;
                    
                    document.getElementById('modalProductoTitle').textContent = 'Editar Producto';
                    modalProducto.show();
                } else {
                    alert('Error al cargar producto: ' + data.message);
                }
            })
            .catch(error => console.error('Error al cargar producto:', error));
    }
    
    function guardarProducto() {
        // Validar formulario
        if (!productoForm.checkValidity()) {
            productoForm.reportValidity();
            return;
        }
        
        // Preparar datos
        const productoData = {
            codi_barra: document.getElementById('codi_barra').value,
            descripcion: document.getElementById('descripcion').value,
            precio: parseFloat(document.getElementById('precio').value),
            costo: document.getElementById('costo').value ? parseFloat(document.getElementById('costo').value) : 0,
            stock: parseInt(document.getElementById('stock').value) || 0
        };
        
        let url = '/api/productos';
        let method = 'POST';
        
        if (modoEdicion) {
            url = `/api/productos/${productoSeleccionado.id}`;
            method = 'PUT';
        }
        
        // Enviar datos al servidor
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productoData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(modoEdicion ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
                modalProducto.hide();
                cargarProductos();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error al guardar producto:', error);
            alert('Error al guardar producto. Consulte la consola para más detalles.');
        });
    }
    
    function eliminarProducto(productoId) {
        if (!confirm('¿Está seguro de eliminar este producto?')) {
            return;
        }
        
        fetch(`/api/productos/${productoId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Producto eliminado exitosamente');
                cargarProductos();
            } else {
                alert('Error al eliminar producto: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error al eliminar producto:', error);
            alert('Error al eliminar producto. Consulte la consola para más detalles.');
        });
    }
});
