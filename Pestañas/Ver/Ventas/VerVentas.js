window.GoToVentas = () => window.location.href = "../../../index.html";
window.GoToCompras = () => window.location.href = "../../Compras/Compras.html";
window.GoToProductos = () => window.location.href = "../../Productos/Productos.html"

document.addEventListener("DOMContentLoaded", function () {
    cargarHistorialVentas();
});

function cargarHistorialVentas() {
    const historial = JSON.parse(localStorage.getItem("HistorialVentas")) || [];
    const tbody = document.querySelector("#tablaHistorial tbody");
    tbody.innerHTML = "";

    historial.forEach((venta, i) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${venta.numero}</td>
            <td>${venta.cliente}</td>
            <td>${venta.productos.reduce((sum, p) => sum + p.cantidad, 0)}</td>
            <td>Gs. ${venta.total.toLocaleString()}</td>
            <td>${venta.fecha}</td>
            <td>
                <button onclick="verDetalleVenta(${i})">Ver</button>
                <button onclick="eliminarVentaHistorial(${i})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

function verDetalleVenta(index) {
    const historial = JSON.parse(localStorage.getItem("HistorialVentas")) || [];
    const venta = historial[index];
    let detalles = `Cliente: ${venta.cliente}\nDocumento: ${venta.documento}\nFecha: ${venta.fecha}\n\nProductos:\n`;

    venta.productos.forEach(p => {
        detalles += `- ${p.nombre} (x${p.cantidad}) - Gs. ${p.precio.toLocaleString()}\n`;
    });

    detalles += `\nTotal: Gs. ${venta.total.toLocaleString()}`;
    alert(detalles);
}

function eliminarVentaHistorial(index) {
    if (!confirm("¿Estás seguro de eliminar esta venta?")) return;

    const historial = JSON.parse(localStorage.getItem("HistorialVentas")) || [];
    historial.splice(index, 1);
    localStorage.setItem("HistorialVentas", JSON.stringify(historial));
    cargarHistorialVentas();
}
