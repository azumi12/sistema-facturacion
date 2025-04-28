// Archivo JavaScript para la gestión de clientes

document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let clientes = [];
    let clienteSeleccionado = null;
    let modoEdicion = false;
    
    // Elementos del DOM
    const tablaClientes = document.getElementById('tablaClientes').getElementsByTagName('tbody')[0];
    const btnNuevoCliente = document.getElementById('btnNuevoCliente');
    const btnGuardarCliente = document.getElementById('btnGuardarCliente');
    const btnBuscar = document.getElementById('btnBuscar');
    const clienteForm = document.getElementById('clienteForm');
    const modalCliente = new bootstrap.Modal(document.getElementById('modalCliente'));
    
    // Inicialización
    cargarClientes();
    
    // Event Listeners
    btnNuevoCliente.addEventListener('click', abrirModalNuevoCliente);
    btnGuardarCliente.addEventListener('click', guardarCliente);
    btnBuscar.addEventListener('click', buscarClientes);
    
    // Consultar DNI/RUC en SUNAT (simulado)
    document.getElementById('btnConsultarDni').addEventListener('click', function() {
        const dniRuc = document.getElementById('dni_ruc').value.trim();
        if (!dniRuc) {
            alert('Ingrese un DNI/RUC para consultar');
            return;
        }
        
        // Simulación de consulta a SUNAT
        alert('Consultando DNI/RUC en SUNAT...');
        // En un caso real, aquí se haría una petición a un servicio de consulta de DNI/RUC
    });
    
    // Funciones
    function cargarClientes() {
        fetch('/api/clientes')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    clientes = data.data;
                    actualizarTablaClientes();
                } else {
                    alert('Error al cargar clientes: ' + data.message);
                }
            })
            .catch(error => console.error('Error al cargar clientes:', error));
    }
    
    function actualizarTablaClientes() {
        tablaClientes.innerHTML = '';
        
        clientes.forEach(cliente => {
            const row = tablaClientes.insertRow();
            row.innerHTML = `
                <td>${cliente.dni_ruc}</td>
                <td>${cliente.nombres}</td>
                <td>${cliente.direccion || ''}</td>
                <td>${cliente.celular || ''}</td>
                <td>${cliente.email || ''}</td>
                <td>${cliente.cumple_dia || 0}/${cliente.cumple_mes || 0}</td>
                <td>
                    <button class="btn btn-sm btn-primary btn-editar" data-id="${cliente.id}">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-danger btn-eliminar" data-id="${cliente.id}">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </td>
            `;
        });
        
        // Agregar event listeners a los botones
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', function() {
                const clienteId = this.getAttribute('data-id');
                editarCliente(clienteId);
            });
        });
        
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                const clienteId = this.getAttribute('data-id');
                eliminarCliente(clienteId);
            });
        });
    }
    
    function buscarClientes() {
        const searchTerm = document.getElementById('buscarCliente').value.trim();
        
        if (!searchTerm) {
            cargarClientes();
            return;
        }
        
        fetch(`/api/clientes/search?searchTerm=${searchTerm}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    clientes = data.data;
                    actualizarTablaClientes();
                } else {
                    alert('Error al buscar clientes: ' + data.message);
                }
            })
            .catch(error => console.error('Error al buscar clientes:', error));
    }
    
    function abrirModalNuevoCliente() {
        modoEdicion = false;
        clienteSeleccionado = null;
        clienteForm.reset();
        document.getElementById('cliente_id').value = '';
        document.getElementById('modalClienteTitle').textContent = 'Nuevo Cliente';
        modalCliente.show();
    }
    
    function editarCliente(clienteId) {
        fetch(`/api/clientes/${clienteId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    clienteSeleccionado = data.data;
                    modoEdicion = true;
                    
                    // Llenar formulario
                    document.getElementById('cliente_id').value = clienteSeleccionado.id;
                    document.getElementById('dni_ruc').value = clienteSeleccionado.dni_ruc;
                    document.getElementById('nombres').value = clienteSeleccionado.nombres;
                    document.getElementById('direccion').value = clienteSeleccionado.direccion || '';
                    document.getElementById('celular').value = clienteSeleccionado.celular || '';
                    document.getElementById('email').value = clienteSeleccionado.email || '';
                    document.getElementById('cumple_dia').value = clienteSeleccionado.cumple_dia || 0;
                    document.getElementById('cumple_mes').value = clienteSeleccionado.cumple_mes || 0;
                    
                    document.getElementById('modalClienteTitle').textContent = 'Editar Cliente';
                    modalCliente.show();
                } else {
                    alert('Error al cargar cliente: ' + data.message);
                }
            })
            .catch(error => console.error('Error al cargar cliente:', error));
    }
    
    function guardarCliente() {
        // Validar formulario
        if (!clienteForm.checkValidity()) {
            clienteForm.reportValidity();
            return;
        }
        
        // Preparar datos
        const clienteData = {
            dni_ruc: document.getElementById('dni_ruc').value,
            nombres: document.getElementById('nombres').value,
            direccion: document.getElementById('direccion').value,
            celular: document.getElementById('celular').value,
            email: document.getElementById('email').value,
            cumple_dia: parseInt(document.getElementById('cumple_dia').value) || 0,
            cumple_mes: parseInt(document.getElementById('cumple_mes').value) || 0
        };
        
        let url = '/api/clientes';
        let method = 'POST';
        
        if (modoEdicion) {
            url = `/api/clientes/${clienteSeleccionado.id}`;
            method = 'PUT';
        }
        
        // Enviar datos al servidor
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clienteData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(modoEdicion ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente');
                modalCliente.hide();
                cargarClientes();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error al guardar cliente:', error);
            alert('Error al guardar cliente. Consulte la consola para más detalles.');
        });
    }
    
    function eliminarCliente(clienteId) {
        if (!confirm('¿Está seguro de eliminar este cliente?')) {
            return;
        }
        
        fetch(`/api/clientes/${clienteId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Cliente eliminado exitosamente');
                cargarClientes();
            } else {
                alert('Error al eliminar cliente: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error al eliminar cliente:', error);
            alert('Error al eliminar cliente. Consulte la consola para más detalles.');
        });
    }
});
