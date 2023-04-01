const url = "http://localhost:4000/";
window.onload = function () {
  getAll();
};

function elementoValue(elemento) {
  return document.getElementById(elemento).value;
}

function elementoId(elemento) {
  return document.getElementById(elemento);
}

function insereTexto(elemento, texto, tipo) {
  elementoId(elemento).textContent = texto;
  if (tipo == "sucesso") {
    tipo = "alert-success";
  } else if (tipo == "aviso") {
    tipo = "alert-warning";
  } else if (tipo == "erro") {
    tipo = "alert-danger";
  }
  elementoId(elemento).classList.add(tipo);
  elementoId(elemento).classList.add("py-3");

  setTimeout(function () {
    elementoId(elemento).textContent = "";
    elementoId(elemento).classList.remove(tipo);
  }, 3000);
}

function chamadaApi(caminho, metodo, objeto) {
  if (metodo == "POST") {
    requisicao = {
      method: metodo,
      body: JSON.stringify(objeto),
      headers: { "Content-Type": "application/json" },
    };
  } else if (metodo == "DELETE") {
    requisicao = {
      method: metodo,
      headers: { "Content-Type": "application/json" },
    };
  }else {
    requisicao = {
      method: metodo,
      headers: { "Content-Type": "application/json" },
    };
  }
  return fetch(url + caminho, requisicao).then((response) => response.json());
}

function login(event) {
  event.preventDefault();
  const login = elementoValue("login");
  const senha = elementoValue("senha");
  const titulo = elementoValue("titulo");
  const link = elementoValue("link");
  const prioridade = elementoValue("prioridade");
  const objetoLogin = { login, senha, titulo, link, prioridade };
  chamadaApi("links", "POST", objetoLogin)
    .then((data) => {
      if (data.msg == "true") {
        insereTexto("mensagemLogin", "Link inserido com sucesso", "sucesso");
        const listaLinks = document.getElementById("listaLinks");
        listaLinks.innerHTML = "";
        getAll();
      } else {
        insereTexto(
          "mensagemLogin",
          "Link não foi inserido, login ou senha errados",
          "aviso"
        );
      }
    })
    .catch((error) => {
      console.error(error);
      insereTexto("mensagemLogin", "Erro na aplicação.", "erro");
    });
}

function getAll() {
  const objetoLogin = {};
  chamadaApi("links", "GET", objetoLogin)
    .then((data) => {
      if (data) {
        data.sort((a, b) => a.prioridade - b.prioridade);
        insereLista(data);
      } else {
        insereTexto(
          "mensagemLogin",
          "Link não foi inserido, login ou senha errados",
          "aviso"
        );
      }
    })
    .catch((error) => {
      console.error(error);
      insereTexto("mensagemLogin", "Erro na aplicação.", "erro");
    });
}

function excluir(uid){
  let login = elementoValue("login");
  let senha = elementoValue("senha");
  login = login == "" ? "error" : login;
  senha = senha == "" ? "error" : senha;
  chamadaApi("links/"+uid+"/"+login+"/"+senha, "DELETE")
    .then((data) => {
      if (data.msg == "true") {
        insereTexto("mensagemLogin", "Link deletado com sucesso", "sucesso");
        const deleteButton = document.querySelector(`#${uid}`);
        const parentElement = deleteButton.parentElement; // seleciona o elemento pai
        parentElement.remove(); // remove o elemento pai
      } else {
        insereTexto(
          "mensagemLogin",
          "Link não foi deletado, login ou senha errados",
          "aviso"
        );
      }
    })
    .catch((error) => {
      console.error(error);
      insereTexto("mensagemLogin", "Erro na aplicação.", "erro");
    });
}
function insereLista(data) {
  // Seleciona a div que irá receber os elementos HTML
  const listaLinks = document.getElementById("listaLinks");
  // Percorre a lista de links e cria elementos HTML para cada um
  for (let i = 0; i < data.length; i++) {
    // Cria o elemento HTML para exibir as informações do link
    const linkElement = document.createElement("div");
    linkElement.classList.add("border", "p-3", "mb-3", "d-flex", "justify-content-between", "align-items-center");

    // Define o conteúdo do elemento com os valores do objeto "data"
    linkElement.innerHTML = `
      <h2>${data[i].titulo}</h2>
      <button type="button" class="btn btn-danger" id="${data[i].uid}">
        Excluir link
      </button>
    `;
  
    // Seleciona o botão de exclusão pelo ID e adiciona o evento de clique
    const deleteButton = linkElement.querySelector(`#${data[i].uid}`);
    deleteButton.addEventListener("click", () => {
      excluir(data[i].uid);
    });
  
    // Adiciona o elemento HTML à div "listaLinks"
    listaLinks.appendChild(linkElement);
  }
  
}
