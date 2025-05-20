window.GoToVentas = () => window.location.href = "../../index.html";
window.GoToProductos = () => window.location.href = "../Productos/Productos.html";
window.GoToVerCompras = () => window.location.href = "../Ver/Compras/VerCompras.html";

let productos = JSON.parse(localStorage.getItem('Cesta')) || [];
let comprasRealizadas = [];

// Al cambiar el código, buscar el producto en el inventario
document.getElementById("codigoProducto").addEventListener("change", function () {
    const codigo = this.value.trim();
    const producto = productos.find(p => p.codigo === codigo);

    if (producto) {
        document.getElementById("nombreProducto").value = producto.nombre;
        document.getElementById("precioProducto").value = producto.precioCompra; // Usa precioCompra para cargar
    } else {
        alert("Producto no encontrado.");
        document.getElementById("nombreProducto").value = "";
        document.getElementById("precioProducto").value = "";
    }
});

function agregarProducto() {
    const codigo = document.getElementById("codigoProducto").value.trim();
    const nombre = document.getElementById("nombreProducto").value.trim();
    const precio = parseFloat(document.getElementById("precioProducto").value);
    const cantidad = parseInt(document.getElementById("cantidadProducto").value);

    if (!codigo || !nombre || isNaN(precio) || isNaN(cantidad)) {
        alert("Completa correctamente todos los campos.");
        return;
    }

    comprasRealizadas.push({ codigo, nombre, precio, cantidad });
    actualizarTabla();
}

function actualizarTabla() {
    const tabla = document.getElementById("tablaCesta").getElementsByTagName("tbody")[0];
    tabla.innerHTML = "";

    comprasRealizadas.forEach((item, i) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${item.codigo}</td>
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>${item.precio.toFixed(2)}</td>
            <td><button onclick="eliminarCompra(${i})">Eliminar</button></td>
        `;
        tabla.appendChild(fila);
    });
}

function eliminarCompra(index) {
    comprasRealizadas.splice(index, 1);
    actualizarTabla();
}

function realizarCompra() {
    let inventario = JSON.parse(localStorage.getItem("Cesta")) || [];
    let historial = JSON.parse(localStorage.getItem("HistorialCompras")) || [];

    comprasRealizadas.forEach(compra => {
        const index = inventario.findIndex(p => p.codigo === compra.codigo);
        if (index !== -1) {
            inventario[index].stock += compra.cantidad;
            inventario[index].precioCompra = compra.precio;
        } else {
            inventario.push({
                codigo: compra.codigo,
                nombre: compra.nombre,
                precioCompra: compra.precio,
                precioVenta: compra.precio * 1.5,
                stock: compra.cantidad
            });
        }
    });

    localStorage.setItem("Cesta", JSON.stringify(inventario));

    // Obtener datos de proveedor y factura
    const rucProveedor = document.getElementById('RUC').value.trim();
    const nombreProveedor = document.getElementById('Proveedor').value.trim();
    const prefijo = document.getElementById('Prefijo').value.trim();
    const numeroFactura = document.getElementById('NumFactura').value.trim();
    const timbrado = document.getElementById('Timbrado').value.trim();
    const fecha = new Date().toLocaleString();

    const compra = {
        numero: historial.length + 1,
        proveedor: nombreProveedor,
        ruc: rucProveedor,
        prefijo: prefijo,
        numFactura: numeroFactura,
        timbrado: timbrado,
        productos: [...comprasRealizadas],
        total: comprasRealizadas.reduce((sum, c) => sum + (c.precio * c.cantidad), 0),
        fecha: fecha
    };

    historial.push(compra);
    localStorage.setItem("HistorialCompras", JSON.stringify(historial));

    exportarPDF(comprasRealizadas);
    comprasRealizadas = [];
    actualizarTabla();
    LimpiarCampos();
    alert("Compra realizada y stock actualizado.");
}


function exportarPDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Obtener datos del proveedor y factura desde los inputs
    const rucProveedor = document.querySelector('.Proveedor input:nth-of-type(1)').value;
    const nombreProveedor = document.querySelector('.Proveedor input:nth-of-type(2)').value;
    const prefijo = document.querySelector('.DatosFactura input:nth-of-type(1)').value;
    const numeroFactura = document.querySelector('.DatosFactura input:nth-of-type(2)').value;
    const timbrado = document.querySelector('.DatosFactura input:nth-of-type(3)').value;

    // Encabezado
    doc.setFontSize(16);
    doc.text("CQ Novedades - Registro de Compras", 10, 10);
    doc.setFontSize(12);
    doc.text(`Proveedor: ${nombreProveedor} | RUC: ${rucProveedor}`, 10, 20);
    doc.text(`Factura: ${prefijo}-${numeroFactura} | Timbrado: ${timbrado}`, 10, 28);
    
    doc.text("Detalle de productos:", 10, 38);

    // Productos
    let y = 48;
    data.forEach(item => {
        doc.text(`Cod: ${item.codigo} | ${item.nombre} | Cant: ${item.cantidad} | Precio: ${item.precio}`, 10, y);
        y += 10;
        if (y > 280) { // Salto de página si excede
            doc.addPage();
            y = 10;
        }
    });

    // Guardar PDF
    doc.save(`compra_de_${nombreProveedor}-${prefijo}-${numeroFactura}.pdf`);
}

function autocompletarProducto() {
    const codigo = document.getElementById("codigoProducto").value.trim();
    const productos = JSON.parse(localStorage.getItem('Cesta')) || [];

    const producto = productos.find(p => p.codigo === codigo);

    if (producto) {
        document.getElementById("nombreProducto").value = producto.nombre;
        document.getElementById("precioProducto").value = producto.precioCompra;
    } else {
        document.getElementById("nombreProducto").value = "";
        document.getElementById("precioProducto").value = "";
    }
}

function LimpiarCampos(){
    
    document.getElementById('RUC').value = '';
    document.getElementById('Proveedor').value = '';
    document.getElementById('Prefijo').value = '';
    document.getElementById('NumFactura').value = '';
    document.getElementById('Timbrado').value = '';
    document.getElementById('codigoProducto').value = '';
    document.getElementById('nombreProducto').value = '';
    document.getElementById('precioProducto').value = '';
    document.getElementById('cantidadProducto').value = '';
}
