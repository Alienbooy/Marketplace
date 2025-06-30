const token = localStorage.getItem("token");
if (!token) {
  alert("Debes iniciar sesión.");
  window.location.href = "/login.html";
}

let usuarioId = null;
try {
  const payload = JSON.parse(atob(token.split(".")[1]));
  usuarioId = payload.id_usuario;
} catch (e) {
  alert("Token inválido");
  window.location.href = "/login.html";
}

const main = document.querySelector("main");

main.innerHTML = `
  <div class="chat-container">
    <div class="tabs">
      <button class="tab active" data-tab="comprando">Comprando</button>
      <button class="tab" data-tab="vendiendo">Vendiendo</button>
    </div>
    <div class="main">
      <div class="panel-con-header">
        <div class="header-panel">Anuncios</div>
        <aside class="panel izquierdo"></aside>
      </div>
      <div class="panel-con-header">
        <div class="header-panel">Personas</div>
        <aside class="panel medio"></aside>
      </div>
      <div class="panel-con-header full">
        <div class="header-panel" id="titulo-chat">Selecciona un Anuncio</div>
        <section class="panel derecho">
          <div class="chat-vacio">Selecciona una conversación</div>
          <div class="chat"></div>
          <div class="escribir">
            <input type="text" placeholder="Escribe un mensaje...">
            <button>Enviar</button>
          </div>
        </section>
      </div>
    </div>
  </div>
`;

const tabs = document.querySelectorAll(".tab");
const izquierdo = document.querySelector(".panel.izquierdo");
const medio = document.querySelector(".panel.medio");
const derecho = document.querySelector(".panel.derecho");
const chatDiv = derecho.querySelector(".chat");
const vacioDiv = derecho.querySelector(".chat-vacio");
const input = derecho.querySelector("input");
const enviarBtn = derecho.querySelector("button");

let modo = "comprando";
let conversacionesGlobal = [];
let anuncioSeleccionado = null;
let conversacionActiva = null;

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    modo = tab.dataset.tab;
    cargarConversaciones();
  });
});

function agruparPorAnuncio(conversaciones) {
  const agrupado = {};
  conversaciones.forEach(c => {
    const id = c.anuncio_id;
    if (!agrupado[id]) {
      agrupado[id] = {
        titulo: c.anuncio_titulo,
        vendedor: c.vendedor_nombre,
        chats: []
      };
    }
    agrupado[id].chats.push(c);
  });
  return agrupado;
}

function renderConversaciones(data) {
  conversacionesGlobal = data;
  anuncioSeleccionado = null;
  conversacionActiva = null;
  izquierdo.innerHTML = "";
  medio.innerHTML = "";
  derecho.querySelector(".chat").innerHTML = "";
  vacioDiv.textContent = "Selecciona un Anuncio";

  const agrupado = agruparPorAnuncio(data);
  Object.entries(agrupado).forEach(([id, grupo]) => {
    const div = document.createElement("div");
    div.classList.add("anuncio");
    div.innerHTML = `<strong>${grupo.titulo}</strong>` + 
      (modo === "comprando" ? `<br><small>Con: ${grupo.vendedor}</small>` : "");
    div.addEventListener("click", () => renderUsuarios(grupo.chats, grupo.titulo));
    izquierdo.appendChild(div);
  });
}

function renderUsuarios(lista, titulo) {
  medio.innerHTML = "";
  derecho.querySelector(".chat").innerHTML = "";
  vacioDiv.textContent = "Selecciona una Persona";
  anuncioSeleccionado = titulo;

  lista.forEach(c => {
    const div = document.createElement("div");
    div.classList.add("usuario");
    div.textContent = modo === "comprando" ? c.vendedor_nombre : c.interesado_nombre;
    div.addEventListener("click", () => cargarMensajes(c.conversacion_id));
    medio.appendChild(div);
  });
}

async function cargarConversaciones() {
  try {
    const res = await fetch(`/api/conversaciones/${modo}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    renderConversaciones(data);
  } catch (err) {
    console.error("Error al obtener conversaciones:", err);
  }
}

async function cargarMensajes(id) {
  conversacionActiva = id;
  chatDiv.innerHTML = "";
  vacioDiv.style.display = "none";

  try {
    const res = await fetch(`/api/mensajes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const mensajes = await res.json();
    mensajes.forEach(m => {
      const div = document.createElement("div");
      div.classList.add("mensaje");
      if (m.emisor_id === usuarioId) div.classList.add("propio");
      div.textContent = m.contenido;
      chatDiv.appendChild(div);
    });
    chatDiv.scrollTop = chatDiv.scrollHeight;
  } catch (err) {
    console.error("Error al cargar mensajes:", err);
  }
}

enviarBtn.addEventListener("click", async () => {
  const texto = input.value.trim();
  if (!texto || !conversacionActiva) return;

  try {
    const res = await fetch("/api/mensajes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        conversacion_id: conversacionActiva,
        contenido: texto,
      }),
    });
    if (res.ok) {
      const div = document.createElement("div");
      div.classList.add("mensaje", "propio");
      div.textContent = texto;
      chatDiv.appendChild(div);
      input.value = "";
      chatDiv.scrollTop = chatDiv.scrollHeight;
    }
  } catch (err) {
    console.error("Error al enviar mensaje:", err);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  cargarConversaciones();
});
