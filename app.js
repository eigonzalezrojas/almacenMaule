/* autor: Eithel González Rojas */

//Obtenemos los id y las secciones de la estructura HTML
const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
//fragmento memoria volatil 
const fragment = document.createDocumentFragment()
//creación del carrito, coleccion de objetos
let carrito =  {}

//Esperamos que se cargue primero todo el HTML
//Luego utilizamos el local storage y verificamos que el carrito tenia o no productos agregados
document.addEventListener("DOMContentLoaded", () => {
    fetchData()
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

//Funcion buscador de productos
//utilizamos keyup para el ingreso de letras o palabras (input)
//utilizamos el id "dproducto" que contiene el producto
//si se encuentra el producto agregamos la clase css "filtro" para mostrar o esconder el producto
document.addEventListener("keyup", e =>{
    if (e.target.matches("#buscador")) {
        document.querySelectorAll("#dproducto").forEach(producto =>{                      
            producto.textContent.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
            ?producto.classList.remove("filtro")
            :producto.classList.add("filtro")
        })
    }
})

cards.addEventListener('click', e =>{
    addCarrito(e)
})
items.addEventListener('click', e =>{
    btnAccion(e)
})


//Realizamos la obtención de data desde el archivo json de productos
const fetchData = async()=>{
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        //console.log(data);
        pintarCards(data)
    } catch (error) {
        console.log(error);
    }
}

//Generamos los productos junto a su descripción
const pintarCards = (data)=>{
    //console.log(data);
    items.innerHTML = ''
    data.forEach( producto =>{
        templateCard.querySelector('h5').textContent = producto.nombre
        templateCard.querySelector('#precio').textContent = producto.precio
        templateCard.querySelector('#cantidad').textContent = producto.medida
        templateCard.querySelector('#categoria').textContent = producto.categoria
        templateCard.querySelector('img').setAttribute("src", producto.img)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id
        
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

//Acción de agregar producto ejecutado por botón comprar
const addCarrito = (e) =>{
    //console.log(e.target);
    //console.log(e.target.classList.contains('btn-dark'));
    if (e.target.classList.contains('btn-dark')) {
        //console.log(e.target.parentElement)
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: '¡Producto agregado!',
            showConfirmButton: false,
            timer: 1500
        })
        setCarrito(e.target.parentElement)
    }
    // Detenemos cualquier otro evento en cards
    e.stopPropagation()
}

//Función la cual verifica si el producto ya existe en el carrito
//Si agregamos nuevamente el producto, simplemente aumentamos su cantidad
const setCarrito = objeto =>{
    //console.log(obj);
    const producto = {
        id : objeto.querySelector('.btn-dark').dataset.id,
        nombre : objeto.querySelector('h5').textContent,        
        precio : objeto.querySelector('#precio').textContent,
        medida : objeto.querySelector('#cantidad').textContent,
        cantidad : 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    //spread syntax => si NO existe se crea el producto, si existe lo sobre escribe
    carrito[producto.id] = {...producto}
    pintarCarrito()    
}

//Agregamos los productos seleccionados a la sección carrito
const pintarCarrito = () => {
    //console.log(carrito);
    items.innerHTML = ''
    //Recorremos los objetos del carrito
    Object.values(carrito).forEach(producto=>{
        //seleccionamos los elementos
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        //Botones acción agregar-eliminar
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)        
    })
    items.appendChild(fragment)

    pintarFooter()

    //Guardamos la información como una colección de objetos en Local Storage
    localStorage.setItem('carrito', JSON.stringify(carrito))    
}

//Sección operaciones respecto a productos en el carrito (agregar-eliminar-total-vaciar)
const pintarFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
        //utilizamos el return para que no continue con el proceso
        return
    }

    // Utilizamos Object values ya que es un arreglo de objetos
    // acc irá acumulando la cantidad de objetos
    // {cantidad} forma de acceder al campo del objeto
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad})=> acc + cantidad, 0)
    //console.log(nCantidad);
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio})=>acc + cantidad * precio, 0)
    //console.log(nPrecio);

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    //Creamos un duplicado del objeto que se envía y entrega el objeto de clonación
    const clone = templateFooter.cloneNode(true)
    //Agrega un nuevo nodo al final de la lista de un elemento hijo de un elemento padre especificado.
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () =>{
        Swal.fire({
            title: '¿Estas seguro de vaciar el carrito?',
            text: "Eliminaremos todos los productos del carrito",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, vaciar carrito'
        }).then((result) => {
            if (result.isConfirmed) {
                carrito = {}
                pintarCarrito()
                Swal.fire(
                    '¡Carrito vacío!',
                    'Productos eliminados',
                    'success'
                )
            }
        })        
    })
}

//Acciones de botones del carrito (agregar-eliminar unidades de producto)
const btnAccion = e =>{
    //console.log(e.target)
    //Acción de aumentar la cantidad de productos al carrito
    if(e.target.classList.contains('btn-info')){
        //console.log(carrito[e.target.dataset.id])
        const producto = carrito[e.target.dataset.id]
        producto.cantidad ++
        carrito[e.target.dataset.id] = {...producto}        
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: '¡Producto agregado!',
            showConfirmButton: false,
            timer: 1500
        })
        pintarCarrito()
    }

    if(e.target.classList.contains('btn-danger')){
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Quitaremos el producto del carrito",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, quitar'
        }).then((result) => {
            if (result.isConfirmed) {
                const producto = carrito[e.target.dataset.id]
                producto.cantidad --
                if (producto.cantidad === 0) {
                    delete carrito[e.target.dataset.id]
                }                               
                Swal.fire(
                    '¡Eliminado!',
                    'El producto fue eliminado del carrito',
                    'success'
                    )
                pintarCarrito() 
            }
        })
    }
    e.stopPropagation()
}

mostrarCategoria = (value) => {
    let buttons = document.querySelectorAll(".btn-category")    
    buttons.forEach((button) =>{
        if (value == button.innerText) {            
            button.classList.add("active")            
        }else{            
            button.classList.remove("active")
        }
    })
}