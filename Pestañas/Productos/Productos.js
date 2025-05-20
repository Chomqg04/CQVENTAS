let Cesta = [];

function GoToCompras() {
    window.location.href = "../Compras/Compras.html";
}

function GoToVentas() {
    window.location.href = "../../Index.html";
}


// Cargar los datos del localStorage al iniciar
document.addEventListener('DOMContentLoaded', () => {
    const data = localStorage.getItem('Cesta');
    if (data) {
        Cesta = JSON.parse(data);
        ActualizarTabla();
    }
});

function LimpiarCampos() {
    document.getElementById('Codigo').value = '';
    document.getElementById('Nombre').value = '';
    document.getElementById('PrecioCompra').value = '';
    document.getElementById('PrecioVenta').value = '';
    document.getElementById('Stock').value = '';
}

function CargarProductos() {
    const codigo = document.getElementById('Codigo').value.trim();
    const nombre = document.getElementById('Nombre').value.trim();
    const precioCompra = parseFloat(document.getElementById('PrecioCompra').value);
    const precioVenta = parseFloat(document.getElementById('PrecioVenta').value);
    const stock = parseInt(document.getElementById('Stock').value, 10);

    if (!codigo || !nombre || isNaN(precioCompra) || isNaN(precioVenta) || isNaN(stock)) {
        alert('Por favor, complete todos los campos correctamente.');
        return;
    }

    const index = Cesta.findIndex(p => p.codigo === codigo);

    if (index >= 0) {
        // Actualiza los datos del producto si ya existe
        Cesta[index].precioCompra = precioCompra;
        Cesta[index].precioVenta = precioVenta;
        Cesta[index].stock += stock;
    } else {
        // Agrega el producto si no existe
        Cesta.push({ codigo, nombre, precioCompra, precioVenta, stock });
    }

    // Guardar en localStorage
    localStorage.setItem('Cesta', JSON.stringify(Cesta));

    ActualizarTabla();
    LimpiarCampos();
}

function ActualizarTabla() {
    const tbody = document.getElementById('CestaBody');
    tbody.innerHTML = '';

    Cesta.forEach((p, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.codigo}</td>
            <td>${p.nombre}</td>
            <td>${p.precioCompra.toFixed(2)}</td>
            <td>${p.precioVenta.toFixed(2)}</td>
            <td>${p.stock}</td>
            <td>
                <button onclick="EliminarProducto(${i})">Eliminar</button>
                <button onclick="ModificarProducto(${i})">Editar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function EliminarProducto(index) {
    const producto = Cesta[index];
    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar el producto "${producto.nombre}"?`);
    if (confirmacion) {
        Cesta.splice(index, 1);
        localStorage.setItem('Cesta', JSON.stringify(Cesta));
        ActualizarTabla();
    }
}

function ModificarProducto(index) {
    const producto = Cesta[index];

    document.getElementById('Codigo').value = producto.codigo;
    document.getElementById('Nombre').value = producto.nombre;
    document.getElementById('PrecioCompra').value = producto.precioCompra;
    document.getElementById('PrecioVenta').value = producto.precioVenta;
    document.getElementById('Stock').value = producto.stock;

    // Elimina el producto para que al volver a cargar se actualice
    Cesta.splice(index, 1);
    localStorage.setItem('Cesta', JSON.stringify(Cesta));
    ActualizarTabla();
}
