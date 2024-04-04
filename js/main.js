
const contenedorProductos = document.querySelector("#contenedor-productos");

const botonesMarca = document.querySelectorAll(".btn_marca");

let agregarCarrito = document.querySelector(".agregar_carrito");

const form = document.querySelector("#form");

const formInput = document.querySelector("#form-input");

// trae los productos desde un JSON con Fetch, y los almacena en el array productos
let productos = [];

fetch("../db/db.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })


// declaracion del array carrito
let carrito = [];
// en el caso de tener productos en el LS los agrega al array
carrito = localStorage.getItem("clave-carrito");
carrito = JSON.parse(carrito);



/* INICIO */

// Cargar los productos, se cargan los elementos html 
function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";
    productosElegidos.forEach((producto) => {
        const div = document.createElement("div");
        div.classList.add("cajas__productos")
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="productos__img">
            <h2 class="cajas__productos__titulo">${producto.nombre}</h2>
            <p class="cajas__productos__parrafo">
            <a href="" class="cajas__productos__button">$${producto.precio} ARS</a>
            </p>
            <div class="div__productos-agregar"> <button class="agregar_carrito" id="${producto.id}">Agregar al carrito<i class="bi bi-cart-plus-fill"></i></button> </div>
        `

        contenedorProductos.append(div);
    })

    renovarAgregarCarrito()
}

// Filtrado por marca del producto, o para mostrar todos los productos (segun opcion elegida)
botonesMarca.forEach(boton => {
    boton.addEventListener("click", (e) => {

        if (e.currentTarget.id != "todos_los_productos") { //Si e.currentTarget.id al hacer "click" es diferente a "todos__los__productos", es porque NO se clickeo la opcion "todos los productos" 
            const marcaProductos = productos.filter(producto => producto.marca === e.currentTarget.id); //e.currentTarget.id esto nos trae el id , osea la marca
            cargarProductos(marcaProductos);
        } else {
            cargarProductos(productos); // si entra aca es porque no se selecciono una marca, entonces muestra todos los productos
        }
        console.log(e.currentTarget.id)
    })

})


// Agregar los productos al carrito
function renovarAgregarCarrito() {

    agregarCarrito = document.querySelectorAll(".agregar_carrito");

    agregarCarrito.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    })
}

function agregarAlCarrito(e) {
    let idProducto = e.currentTarget.id
    const productoAgregado = productos.find(producto => producto.id === idProducto);

    if (carrito.some(producto => producto.id === idProducto)) { //por si ya hay este mismo producto en el carrito
        const index = carrito.findIndex(producto => producto.id === idProducto);
        carrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        carrito.push(productoAgregado);
    }
    //notifica que el producto fue agregado
    Swal.fire({
        title: "Producto agregado al carrito",
        html: `
        <div>
            <img src="${productoAgregado.imagen}" style="max-width: 50%;">
            <p style="font-family: 'Quicksand', sans-serif;">${productoAgregado.nombre}</p>
            <p style="font-family: 'Quicksand', sans-serif;">Precio: $${productoAgregado.precio} ARS</p>
        </div>
        `,
        icon: "success",
        customClass: {
            title: `alert__font`,
        },
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#00CD00'
    });

    Toastify({
        text: "Producto agregado (+1)",
        className: "info",
        duration: 5000,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();

    //agrega el producto agregado al carrito en el LS
    localStorage.setItem("clave-carrito", JSON.stringify(carrito));
}


// Barra de busqueda de productos
form.addEventListener("submit", (e) => {
    e.preventDefault();

    let valorInput = formInput.value.toLowerCase();

    let productosEncontrados = productos.filter(producto => producto.nombre.toLowerCase().includes(valorInput));
    console.log(productosEncontrados);
    if (productosEncontrados.length > 0) {
        cargarProductos(productosEncontrados); // Mostrar solo los productos encontrados
    } else {
        contenedorProductos.innerHTML = ` <p style="font-family: 'Quicksand', sans-serif; font-size: 1.40rem;"> No se encontraron los productos... </p> `; // Mostrar un mensaje de q no se encontraron productos
    }
});

/* FIN */
