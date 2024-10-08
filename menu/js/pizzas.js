const PRODUCTS_API_URL = "https://script.google.com/macros/s/AKfycbzz43akAwudjWljVhIdXotf3KHc4YR-xsTUU3mNw8Wpep6trWDppVJKYlZJXVEk1ABr/exec"
const globalProducts = new Map();

async function fetchProducts() {
    try {
        const response = await fetch(PRODUCTS_API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        data.data.forEach(product => {
            const formattedProduct = {
                id: product.id,
                nombre: product.nombre,
                descripcion: product.descripcion,
                precio: product.precio,
                categoria: product.categoria,
                img: product.img,
            };
            globalProducts.set(formattedProduct.id, formattedProduct);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

