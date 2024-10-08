document.addEventListener("DOMContentLoaded", async () => {
    try {
        await fetchProducts();
        const productos = Array.from(globalProducts.values());
        crearTarjetasProductosInicio(productos);
    } catch (error) {
        console.error('Failed to initialize products:', error);
    }
});

function crearTarjetasProductosInicio(productos) {
    const contenedorTarjetas = document.getElementById("productos-container");

    if (!contenedorTarjetas) {
        console.error('Container for product cards not found.');
        return;
    }

    productos.forEach(producto => {
        const tarjetaProducto = document.createElement("div");
        tarjetaProducto.classList.add("tarjeta-producto");
        tarjetaProducto.innerHTML = 
            `<img src="${producto.img}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio}</p>
            <p>${producto.descripcion}</p>
            <button>Agregar al carrito</button>`;
        contenedorTarjetas.appendChild(tarjetaProducto);

        const agregarBtn = tarjetaProducto.querySelector("button");
        agregarBtn.addEventListener("click", () => agregarAlCarrito(producto));
    });
}
