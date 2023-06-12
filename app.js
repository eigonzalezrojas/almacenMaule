//Obtenemos los id de los elementos HTML
const items = document.getElementById('items')
const templateCard = document.getElementById('template-card').content
//fragmente memoria volatil 
const fragment = document.createDocumentFragment()

//Esperamos que se cargue primero todo el HTML
document.addEventListener("DOMContentLoaded", () => {
    fetchData()
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

const pintarCards = (data)=>{
    data.forEach(producto=>{
        templateCard.querySelector('h5').textContent = producto.nombre
        templateCard.querySelector('#precio').textContent = `$ ${producto.precio}`
        templateCard.querySelector('#cantidad').textContent = producto.medida
        templateCard.querySelector('img').setAttribute("src", producto.img)
        
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
}