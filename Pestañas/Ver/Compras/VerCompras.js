// Navegación
window.GoToVentas = () => window.location.href = "../../../Index.html";
window.GoToCompras = () => window.location.href = "../../Compras/Compras.html";
window.GoToProductos = () => window.location.href = "../../Productos/Productos.html";

// Carga inicial
document.addEventListener("DOMContentLoaded", function () {
    CargarHistorialCompras();
});

function CargarHistorialCompras() {
    const tabla = document.getElementById("tablaCompras").getElementsByTagName("tbody")[0];
    let historialCompras = JSON.parse(localStorage.getItem("HistorialCompras")) || [];

    tabla.innerHTML = "";

    historialCompras.forEach((compra, index) => {
        const detalle = Array.isArray(compra.productos) ? compra.productos : [];
        const cantidadProductos = detalle.reduce((sum, p) => sum + p.cantidad, 0);
        const total = compra.total || 0;
        const fechaFormateada = compra.fecha || "";

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${index + 1}</td>
            <td>${compra.proveedor || ""}</td>
            <td>${compra.timbrado || ""}</td>
            <td>${compra.prefijo || ""}</td>
            <td>${compra.numFactura || ""}</td>
            <td>${cantidadProductos}</td>
            <td>${total.toLocaleString("es-PY")}</td>
            <td>${fechaFormateada}</td>
            <td>
                <button onclick="verDetalleCompra(${index})">Detalle de la compra</button>
                <button onclick="eliminarCompra(${index})">Eliminar Compra</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

function verDetalleCompra(index) {
    const historial = JSON.parse(localStorage.getItem("HistorialCompras")) || [];
    const compra = historial[index];

    if (!compra) {
        alert("Compra no encontrada.");
        return;
    }

    let detalles = `Proveedor: ${compra.ruc} - ${compra.proveedor}\nDocumento: ${compra.prefijo}-${compra.numFactura}\nFecha: ${compra.fecha}\n\nProductos:\n`;

    compra.productos.forEach(p => {
        detalles += `- ${p.nombre} (x${p.cantidad}) - Gs. ${p.precio.toLocaleString("es-PY")}\n`;
    });

    detalles += `\nTotal: Gs. ${compra.total.toLocaleString("es-PY")}`;
    alert(detalles);
}

function eliminarCompra(indice) {
    if (!confirm("¿Estás seguro de eliminar esta compra?")) return;

    let historialCompras = JSON.parse(localStorage.getItem("HistorialCompras")) || [];
    historialCompras.splice(indice, 1);
    localStorage.setItem("HistorialCompras", JSON.stringify(historialCompras));
    location.reload();
}
