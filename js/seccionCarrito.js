
let carritoNuevo = localStorage.getItem("clave-carrito");

carritoNuevo = JSON.parse(carritoNuevo);

const carritoVacio = document.querySelector("#carrito-vacio");

const carritoProductos = document.querySelector("#contenedor-productos-carrito");

const carritoElementos = document.querySelector("#carrito-elementos");

let borrarProducto = document.querySelectorAll(".borrar__producto__carrito");

const comprarCarrito = document.querySelector("#comprar-carrito");

const borrarCarrito = document.querySelector("#borrar-carrito");

const compraTotal = document.querySelector("#carrito-total");


/* INICIO */

// Cargar los productos seleccionados, en html
function agregarProductosSeccionCarrito(){

    if(carritoNuevo && carritoNuevo.length > 0){
        //se agregan y se quitan las clases, para que se apliquen los estilos correspondientes
        carritoVacio.classList.add("desactivado");
        carritoProductos.classList.remove("desactivado");
        carritoElementos.classList.remove("desactivado");
    
        carritoProductos.innerHTML = "";
    
        carritoNuevo.forEach(producto => {
            let div = document.createElement("div");
            div.classList.add("subcontenedor__carrito");
            div.innerHTML = `
            <div class="imagen__carrito"> <img src=".${producto.imagen}" alt="${producto.nombre}" class="imagen__carrito__tamanio"> </div>
            <div class="nombre__producto__carrito"> ${producto.nombre} </div>
            <div class="cantidad__productos__carrito"> Cantidad: ${producto.cantidad} </div>
            <div class="precio__por__unidad__carrito"> Valor: $${producto.precio * producto.cantidad} ARS </div>
            <div class="borrar__producto__carrito"> <button class="remove__carrito" id="${producto.id}"><i class="bi bi-trash"></i></button> </div>
            `
    
            carritoProductos.append(div);
            totalDeCarrito()
        });
    }else{
        carritoProductos.innerHTML = "";
        //se agregan y se quitan las clases, para que se apliquen los estilos correspondientes
        carritoVacio.classList.remove("desactivado");
        carritoProductos.classList.add("desactivado");
        carritoElementos.classList.add("desactivado");
    }

    renovarEliminarCarrito();
}

// Mostrar inicialmente todos los productos 
agregarProductosSeccionCarrito();


// Btn de borrar productos individualmente
function renovarEliminarCarrito(){
    borrarProducto = document.querySelectorAll(".remove__carrito");

    borrarProducto.forEach(boton => {
        boton.addEventListener("click", borrarProductoCarrito);
    })
}

function borrarProductoCarrito(e){
    let IdDelProducto = e.currentTarget.id;
    const index = carritoNuevo.findIndex(producto => producto.id === IdDelProducto);
    if (index !== -1) {
        carritoNuevo.splice(index, 1);
        
        Swal.fire({
            title: "Producto eliminado",
            icon: "error",
            customClass: {
                title: `alert__font`
            },
            confirmButtonText: 'Aceptar'
        });
        
        localStorage.setItem("clave-carrito", JSON.stringify(carritoNuevo)); // Se actualiza el LS después de eliminar un producto del carrito
        agregarProductosSeccionCarrito(); // Se actualiza la visual del carrito
    } else {
        console.log("Producto no encontrado en el carrito.");
    }
}


// Btn de comprar carrito
comprarCarrito.addEventListener("click", comprarCarritoClick);

function comprarCarritoClick(){
    let carritoTotalActualizado = totalDeCarrito();
    Swal.fire({
        title: "¿Seguro que desea realizar la compra?",
        text: "una vez confirmada no se podrá deshacer la acción",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#00CD00",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, comprar!",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "¡Gracias por su compra! ",
                icon: "success",
                html:`
                <div>
                    <p style="font-family: 'Quicksand', sans-serif;">Valor total de la compra: $${carritoTotalActualizado} ARS</p>
                </div>
                `,
                customClass: {
                    title: `alert__font`
                },
                confirmButtonText: 'Aceptar',
            });
             //vaciar carrito una vez finalizada la compra
            carritoNuevo.length = 0;
            localStorage.setItem("clave-carrito", JSON.stringify(carritoNuevo));
            agregarProductosSeccionCarrito(); //actualiza la visual
        }
    });
}


// Btn de borrar carrito completo
borrarCarrito.addEventListener("click", borrarCarritoClick);
function borrarCarritoClick(){
    carritoNuevo.length = 0;
    localStorage.setItem("clave-carrito", JSON.stringify(carritoNuevo));

    agregarProductosSeccionCarrito();

    Swal.fire({
        title: "Carrito completo eliminado",
        icon: "error",
        customClass: {
            title: `alert__font`
        },
        confirmButtonText: 'Aceptar'
    });
}


// Actualizar valor total del carrito
function totalDeCarrito(){
    let carritoTotalActualizado = carritoNuevo.reduce((acumulador, producto) => acumulador + producto.precio * producto.cantidad, 0);

    compraTotal.innerText = carritoTotalActualizado;

    return carritoTotalActualizado;
}

/* FIN */ 