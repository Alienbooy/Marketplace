const dataChat = {
  vendiendo: {
    "Samsung s24+": {
      Pedro: [
        { remitente: "yo", texto: "Hola, sigue disponible" },
        { remitente: "Pedro", texto: "Hola, sí sigue disponible" },
        { remitente: "yo", texto: "¿Podrías enviarme fotos?" },
        { remitente: "Pedro", texto: "Claro, aquí tienes" },
        { remitente: "yo", texto: "Gracias, ¿aceptas cambios?" },
        { remitente: "Pedro", texto: "No, solo efectivo" },
      ],
      Carlos: [
        { remitente: "yo", texto: "Hola, ¿sigue disponible?" },
        { remitente: "Carlos", texto: "Sí, está disponible" },
        { remitente: "yo", texto: "¿Podrías enviarme fotos?" },
        { remitente: "Carlos", texto: "Claro, aquí tienes" },
        { remitente: "yo", texto: "Gracias, ¿aceptas cambios?" },
        { remitente: "Carlos", texto: "No, solo efectivo" },
      ]
    },
    "Pc Gamer HP": {
      Luis: [
        { remitente: "yo", texto: "Hola, ¿está disponible aún?" },
        { remitente: "Luis", texto: "Sí, claro" }
      ]
    }
  },
  comprando: {
    "Teclado Logitech X": {
      Vendedor1: [
        { remitente: "yo", texto: "Hola, me interesa" },
        { remitente: "Luis", texto: "Está disponible" },
        { remitente: "yo", texto: "¿Podrías enviarme fotos?" },
        { remitente: "Luis", texto: "Claro, aquí tienes" },
        { remitente: "yo", texto: "Gracias, ¿aceptas cambios?" },
        { remitente: "Luis", texto: "No, solo efectivo" }
      ]
    }
  }
};

let vistaActual = "vendiendo";
let anuncioSeleccionado = null;
let personaSeleccionada = null;

function cambiarVista(vista) {
  vistaActual = vista;
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.querySelector(`.tab:nth-child(${vista === "vendiendo" ? 1 : 2})`).classList.add("active");
  anuncioSeleccionado = null;
  personaSeleccionada = null;
  mostrarAnuncios();
  document.getElementById("mensajes").innerHTML = "";
}

function mostrarAnuncios() {
  const container = document.getElementById("lista-anuncios");
  container.innerHTML = "";

  const columnHeader = document.createElement("div");
  columnHeader.classList.add("column-title");
  columnHeader.innerHTML = vistaActual === "vendiendo"
    ? `<div class="anuncios-title">Anuncios</div><div class="personas-title">Personas</div>`
    : `<div class="anuncios-title">Anuncios</div>`;
  container.appendChild(columnHeader);

  if (vistaActual === "vendiendo") {
    Object.entries(dataChat[vistaActual]).forEach(([anuncio, personas]) => {
      const item = document.createElement("div");
      item.classList.add("item");
      item.innerHTML = `<div class="anuncio">${anuncio}</div><div class="persona">Ver personas</div>`;
      item.onclick = () => mostrarPersonasDelAnuncio(anuncio);
      container.appendChild(item);
    });
  } else {
    Object.entries(dataChat[vistaActual]).forEach(([anuncio, personas]) => {
      const persona = Object.keys(personas)[0];
      const item = document.createElement("div");
      item.classList.add("item");
      item.innerHTML = `<div class="anuncio">${anuncio}</div>`;
      item.onclick = () => cargarConversacion(anuncio, persona);
      container.appendChild(item);
    });
  }
}

function mostrarPersonasDelAnuncio(anuncio) {
  const container = document.getElementById("lista-anuncios");
  container.innerHTML = "";

  const header = document.createElement("div");
  header.classList.add("column-title");
  header.innerHTML = `<div class="anuncios-title">${anuncio}</div><div class="personas-title">Personas</div>`;
  container.appendChild(header);

  Object.keys(dataChat["vendiendo"][anuncio]).forEach(persona => {
    const item = document.createElement("div");
    item.classList.add("item");
    item.innerHTML = `<div class="anuncio">${anuncio}</div><div class="persona">${persona}</div>`;
    item.onclick = () => cargarConversacion(anuncio, persona);
    container.appendChild(item);
  });

  document.getElementById("mensajes").innerHTML = "";
}

function cargarConversacion(anuncio, persona) {
  anuncioSeleccionado = anuncio;
  personaSeleccionada = persona;

  const mensajes = dataChat[vistaActual][anuncio][persona] || [];
  const contenedor = document.getElementById("mensajes");
  contenedor.innerHTML = "";

  mensajes.forEach(msg => {
    const div = document.createElement("div");
    div.className = `mensaje ${msg.remitente === "yo" ? "enviado" : "recibido"}`;
    div.textContent = msg.texto;
    contenedor.appendChild(div);
  });
}

window.onload = () => {
  cambiarVista("vendiendo");
};
