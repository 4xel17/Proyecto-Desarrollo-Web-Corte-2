function agregarAlCarrito(producto) {
    const carrito = obtenerCarrito();
    const indiceProducto = carrito.findIndex(item => item.id === producto.id);

    if (indiceProducto === -1) {
        carrito.push({ ...producto, cantidad: 1 });
    } else {
        carrito[indiceProducto].cantidad++;
    }

    guardarCarrito(carrito);
    actualizarNumeroCarrito();
}

function restarAlCarrito(producto) {
    const carrito = obtenerCarrito();
    const indiceProducto = carrito.findIndex(item => item.id === producto.id);

    if (indiceProducto !== -1) {
        if (carrito[indiceProducto].cantidad > 1) {
            carrito[indiceProducto].cantidad--;
        } else {
            carrito.splice(indiceProducto, 1);
        }
        guardarCarrito(carrito);
    }
    actualizarNumeroCarrito();
}

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("productos")) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem("productos", JSON.stringify(carrito));
}

function actualizarNumeroCarrito() {
    const cuentaCarritoElement = document.getElementById("cuentaCarrito");
    const carrito = obtenerCarrito();
    const totalCantidad = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    if (cuentaCarritoElement) {
        cuentaCarritoElement.innerText = totalCantidad;
    }
}

document.addEventListener("DOMContentLoaded", actualizarNumeroCarrito);
