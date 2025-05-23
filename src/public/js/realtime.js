const socket = io();

const lista = document.getElementById("listaProductos");
const formAgregar = document.getElementById("formAgregar");
const formEliminar = document.getElementById("formEliminar");

// Mostrar lista actualizada
socket.on("productos", (productos) => {
  lista.innerHTML = "";
  productos.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.title} - $${p.price} (ID: ${p.id})`;
    lista.appendChild(li);
  });
});

// Enviar nuevo producto
formAgregar.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = e.target.title.value;
  const price = e.target.price.value;
  const id = crypto.randomUUID(); // ID único
  socket.emit("nuevoProducto", { id, title, price });
  e.target.reset();
});

// Eliminar producto por ID
formEliminar.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = e.target.id.value;
  socket.emit("eliminarProducto", id);
  e.target.reset();
});
