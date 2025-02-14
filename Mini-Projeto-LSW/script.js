const API_URL = "http://localhost:3000/locais";
const form = document.getElementById("formLocal");
const listaLocais = document.getElementById("listaLocais");

// Função para listar locais
async function listarLocais() {
  const response = await fetch(API_URL);
  const locais = await response.json();
  listaLocais.innerHTML = "";

  locais.forEach(local => {
    listaLocais.innerHTML += `
      <div class="local-card">
        <h3>${local.titulo}</h3>
        <p>${local.descricao}</p>
        <img src="${local.foto}" alt="${local.titulo}">
        <button data-id="${local.id}" class="btn btn-warning btn-sm btn-editar">Editar</button>
        <button data-id="${local.id}" class="btn btn-danger btn-sm btn-excluir">Excluir</button>
      </div>
    `;
  });

  // Adiciona os listeners aos botões de editar e excluir
  adicionarListeners();
}

// Função para adicionar listeners aos botões
function adicionarListeners() {
  // Listener para botões de editar
  document.querySelectorAll(".btn-editar").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      editarLocal(id);
    });
  });

  // Listener para botões de excluir
  document.querySelectorAll(".btn-excluir").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      excluirLocal(id);
    });
  });
}

// Função para criar ou editar local
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("localId").value;
  const titulo = document.getElementById("titulo").value;
  const descricao = document.getElementById("descricao").value;
  const foto = document.getElementById("foto").value;

  const local = { titulo, descricao, foto };

  if (id) {
    // Editar local existente
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(local),
    });
  } else {
    // Criar novo local
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(local),
    });
  }

  form.reset();
  document.getElementById("localId").value = ""; // Limpa o ID do formulário
  listarLocais(); // Atualiza a lista de locais
});

// Função para editar local
async function editarLocal(id) {
  const response = await fetch(`${API_URL}/${id}`);
  const local = await response.json();

  document.getElementById("localId").value = local.id;
  document.getElementById("titulo").value = local.titulo;
  document.getElementById("descricao").value = local.descricao;
  document.getElementById("foto").value = local.foto;
}

// Função para excluir local
async function excluirLocal(id) {
  if (confirm("Tem certeza que deseja excluir este local?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    listarLocais(); // Atualiza a lista após a exclusão
  }
}

// Carregar locais ao iniciar
listarLocais();