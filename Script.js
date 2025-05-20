document.addEventListener("DOMContentLoaded", function () {
    // Navegación
    window.GoToCompras = () => window.location.href = "Pestañas/Compras/Compras.html";
    window.GoToProductos = () => window.location.href = "Pestañas/Productos/Productos.html";
    window.GoToVerVentas = () => window.location.href = "Pestañas/Ver/Ventas/VerVentas.html";

    let inventario = JSON.parse(localStorage.getItem("Cesta")) || [];
    let ventas = [];

    const $ = id => document.getElementById(id);

    // Autocompletar producto al escribir código
    $("codigoProducto").addEventListener("input", () => {
        const codigo = $("codigoProducto").value.trim();
        const producto = inventario.find(p => p.codigo === codigo);

        if (producto) {
            $("nombreProducto").value = producto.nombre;
            $("precioProducto").value = producto.precioVenta;
            $("stockProducto").value = producto.stock;
        } else {
            $("nombreProducto").value = "";
            $("precioProducto").value = "";
            $("stockProducto").value = "";
        }
    });

    // Agregar producto a la venta
    window.agregarProducto = () => {
        const codigo = $("codigoProducto").value.trim();
        const nombre = $("nombreProducto").value.trim();
        const stock = parseInt($("stockProducto").value);
        const precio = parseFloat($("precioProducto").value);
        const cantidad = parseInt($("cantidadProducto").value);

        if (!codigo || !nombre || isNaN(stock) || isNaN(precio) || isNaN(cantidad)) {
            alert("Completa correctamente todos los campos.");
            return;
        }

        if (cantidad > stock) {
            alert("No hay suficiente stock.");
            return;
        }

        ventas.push({ codigo, nombre, stock, precio, cantidad });
        actualizarTablaCesta();
        limpiarCamposProducto();
    };

    // Actualizar tabla de la cesta
    function actualizarTablaCesta() {
        const tbody = $("tablaCesta").getElementsByTagName("tbody")[0];
        tbody.innerHTML = "";

        ventas.forEach((p, i) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${p.codigo}</td>
                <td>${p.nombre}</td>
                <td>${p.stock}</td>
                <td>${p.cantidad}</td>
                <td>${p.precio.toFixed(2)}</td>
                <td><button onclick="eliminarVenta(${i})">Eliminar</button></td>
            `;
            tbody.appendChild(fila);
        });
    }

    // Eliminar un producto de la venta
    window.eliminarVenta = index => {
        ventas.splice(index, 1);
        actualizarTablaCesta();
    };

    // Realizar la venta
    window.realizarVenta = () => {
        if (ventas.length === 0) {
            alert("No hay productos cargados en la venta.");
            return;
        }

        let inventarioActual = JSON.parse(localStorage.getItem("Cesta")) || [];

        ventas.forEach(venta => {
            const index = inventarioActual.findIndex(p => p.codigo === venta.codigo);
            if (index !== -1) {
                inventarioActual[index].stock -= venta.cantidad;
            }
        });

        localStorage.setItem("Cesta", JSON.stringify(inventarioActual));

        const historial = JSON.parse(localStorage.getItem("HistorialVentas")) || [];
        const fecha = new Date().toLocaleString();
 
        const clienteNombre = document.querySelector(".Cliente input:nth-of-type(2)")?.value.trim() || "Sin nombre";
        const clienteDocumento = document.querySelector(".Cliente input:nth-of-type(1)")?.value.trim() || "Sin documento";

        const nuevaVenta = {
            numero: historial.length + 1,
            cliente: clienteNombre,
            documento: clienteDocumento,
            productos: [...ventas],
            total: ventas.reduce((acc, p) => acc + p.precio * p.cantidad, 0),
            fecha
        };

        historial.push(nuevaVenta);
        localStorage.setItem("HistorialVentas", JSON.stringify(historial));

        exportarPDF(nuevaVenta);

        ventas = [];
        actualizarTablaCesta();
        limpiarCamposProducto();
        limpiarCamposCliente();

        alert("Venta realizada con éxito.");
    };

    // Exportar la venta actual como PDF
    function exportarPDF(venta) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(14);
        doc.text("CQ NOVEDADES", 10, 10);
        doc.setFontSize(11);
        doc.text("DISTRIBUIDORA KALUA / RONDINA", 10, 16);
        doc.line(10, 18, 200, 18);

        let y = 25;
        venta.productos.forEach((p, i) => {
            doc.text(`${i + 1}. ${p.codigo} - ${p.nombre}`, 10, y);
            doc.text(`Cant: ${p.cantidad} x ${p.precio} = ${(p.cantidad * p.precio).toFixed(2)}`, 10, y + 6);
            y += 15;
        });

        doc.setFontSize(12);
        doc.text(`TOTAL: Gs. ${venta.total.toLocaleString()}`, 10, y);

        doc.save(`Venta_${venta.numero}.pdf`);
    }

    // Limpieza de campos
    function limpiarCamposProducto() {
        ["codigoProducto", "nombreProducto", "stockProducto", "precioProducto", "cantidadProducto"]
            .forEach(id => $(id).value = "");
        $("codigoProducto").focus();
    }

    function limpiarCamposCliente() {
        document.querySelectorAll(".Cliente input").forEach(input => input.value = "");
    }

    window.onload = function () {
        // Cargar datos si hay una venta en edición
        const edicion = JSON.parse(localStorage.getItem("VentaEnEdicion"));
        if (edicion) {
            cargarVentaParaEdicion(edicion);
            document.getElementById("btnRealizarVenta").textContent = "MODIFICAR VENTA";
        }
    };

});