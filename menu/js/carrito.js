document.addEventListener("DOMContentLoaded", () => {
    const contenedorTarjetas = document.getElementById("productos-container");
    const unidadesElement = document.getElementById("unidades");
    const precioElement = document.getElementById("precio");
    const carritoVacioElement = document.getElementById("carrito-vacio");
    const totalesElement = document.getElementById("totales");
    const reiniciarCarritoElement = document.getElementById("reiniciar");
    const comprarButton = document.getElementById("comprar");

    const nombreInput = document.getElementById("nombre");
    const telefonoInput = document.getElementById("telefono");
    const direccionInput = document.getElementById("direccion");

    if (reiniciarCarritoElement) {
        reiniciarCarritoElement.addEventListener("click", reiniciarCarrito);
    }

    if (comprarButton) {
        comprarButton.addEventListener("click", enviarPedido);
    }

    crearTarjetasProductosCarrito();
    actualizarTotales();
    actualizarNumeroCarrito();

    function crearTarjetasProductosCarrito() {
        if (!contenedorTarjetas) {
            console.error('Product container not found.');
            return;
        }

        contenedorTarjetas.innerHTML = "";
        const productos = obtenerCarrito();

        if (productos.length === 0) {
            revisarMensajeVacio();
            return;
        }

        productos.forEach(producto => {
            const tarjetaProducto = document.createElement("div");
            tarjetaProducto.classList.add("tarjeta-producto");

            tarjetaProducto.innerHTML = 
                `<img src="${producto.img}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>$${producto.precio}</p>
                <div>
                    <button class="restar">-</button>
                    <span class="cantidad">${producto.cantidad}</span>
                    <button class="agregar">+</button>
                </div>`;
            contenedorTarjetas.appendChild(tarjetaProducto);

            const restarBtn = tarjetaProducto.querySelector(".restar");
            const agregarBtn = tarjetaProducto.querySelector(".agregar");
            const cantidadElement = tarjetaProducto.querySelector(".cantidad");

            agregarBtn.addEventListener("click", () => {
                agregarAlCarrito(producto);
                const carritoProducto = obtenerCarrito().find(item => item.id === producto.id);
                cantidadElement.innerText = carritoProducto.cantidad;
                actualizarTotales();
                actualizarNumeroCarrito();
            });

            restarBtn.addEventListener("click", () => {
                restarAlCarrito(producto);
                const carritoProducto = obtenerCarrito().find(item => item.id === producto.id);
                if (carritoProducto) {
                    cantidadElement.innerText = carritoProducto.cantidad;
                } else {
                    crearTarjetasProductosCarrito();
                }
                actualizarTotales();
                actualizarNumeroCarrito();
            });
        });
        revisarMensajeVacio();
    }

    function actualizarTotales() {
        const productos = obtenerCarrito();
        let unidades = 0;
        let precio = 0;

        productos.forEach(producto => {
            unidades += producto.cantidad;
            precio += producto.precio * producto.cantidad;
        });

        if (unidadesElement) unidadesElement.innerText = unidades;
        if (precioElement) precioElement.innerText = `${precio.toFixed(2)}`;
    }

    function revisarMensajeVacio() {
        const productos = obtenerCarrito();

        if (productos.length === 0) {
            if (carritoVacioElement) carritoVacioElement.classList.remove("escondido");
            if (totalesElement) totalesElement.classList.add("escondido");
        } else {
            if (carritoVacioElement) carritoVacioElement.classList.add("escondido");
            if (totalesElement) totalesElement.classList.remove("escondido");
        }
    }

    function reiniciarCarrito() {
        localStorage.removeItem("productos");
        actualizarNumeroCarrito();
        crearTarjetasProductosCarrito();
        actualizarTotales();
    }

    async function enviarPedido() {
        const productos = obtenerCarrito();
        if (productos.length === 0) {
            alert('El carrito está vacío.');
            return;
        }

        const nombre = nombreInput.value.trim();
        const telefono = telefonoInput.value.trim();
        const direccion = direccionInput.value.trim();

        if (!nombre || !telefono || !direccion) {
            alert('Por favor, complete toda la información del cliente.');
            return;
        }

        const datosPedido = {
            nombre: nombre,
            telefono: telefono,
            direccion: direccion,
            productos: productos,
            total: calcularTotal(productos)
        };

        comprarButton.disabled = true;
        comprarButton.innerText = 'Enviando...';

    try {
      await fetch('https://script.google.com/macros/s/AKfycbzz43akAwudjWljVhIdXotf3KHc4YR-xsTUU3mNw8Wpep6trWDppVJKYlZJXVEk1ABr/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosPedido)
      });

      alert('Pedido enviado con éxito.');
      reiniciarCarrito();

    } catch (error) {
      alert('error in request')
      console.log("error: ", error)

    } finally {
      comprarButton.disabled = false;
      comprarButton.innerText = 'Comprar';
    }
  }

    function calcularTotal(productos) {
        return productos.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
    }

    function obtenerCarrito() {
        return JSON.parse(localStorage.getItem("productos")) || [];
    }

    function actualizarNumeroCarrito() {
        const cuentaCarritoElement = document.getElementById("cuentaCarrito");
        const carrito = obtenerCarrito();
        const totalCantidad = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        if (cuentaCarritoElement) {
            cuentaCarritoElement.innerText = totalCantidad;
        }
    }
});
