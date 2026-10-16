/* =========================================================
   BOLETIM DIGITAL - 8º ANO (TURMA 8C, Nº 27)
   ========================================================= */

const CONFIG_ALUNO = {
  turma: "8C",
  numeroChamada: 27,
  apiUrl: "https://boletim-api.profbt.com.br"
};

/* Dados fictícios locais como fallback / padrão inicial */
let disciplinasLocais = [
  { disciplina: "Língua Portuguesa", tri1: 82, tri2: "7,8", tri3: 85, faltas: [2, 1, 1] },
  { disciplina: "Matemática", tri1: 52, tri2: "5,8", tri3: null, faltas: [3, 2, 1] },
  { disciplina: "Ciências", tri1: "8,1", tri2: 76, tri3: 8.0, faltas: [1, 2, 0] },
  { disciplina: "História", tri1: 7.0, tri2: 84, tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Geografia", tri1: 68, tri2: 7.3, tri3: "7,9", faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 86, tri2: "8,1", tri3: 8.7, faltas: [1, 0, 0] },
  { disciplina: "Arte", tri1: 9.0, tri2: 92, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 95, tri2: 9.0, tri3: "9,4", faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 88, tri2: 9.1, tri3: 93, faltas: [1, 0, 1] },
  { disciplina: "Educação Financeira", tri1: 74, tri2: "7,8", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Estudo Orientado", tri1: 8.0, tri2: 83, tri3: "8,5", faltas: [0, 1, 0] },
  { disciplina: "Redação e Leitura", tri1: 62, tri2: "6,8", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 48, tri2: 5.6, tri3: "6,0", faltas: [2, 2, 1] },
  { disciplina: "Literatura Arte e Movimento", tri1: "7,7", tri2: 80, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Práticas Experimentais", tri1: 58, tri2: "6,2", tri3: 6.4, faltas: [1, 1, 1] }
];

const MEDIA_MINIMA = 6.0;
let pinSessao = "";
let dadosAtuais = [];

/* ---------------------------------------------------------
   FUNÇÕES DE AJUSTE E NORMALIZAÇÃO
   --------------------------------------------------------- */
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }
  const numero = typeof valor === "string"
    ? parseFloat(valor.replace(",", "."))
    : Number(valor);

  if (isNaN(numero)) {
    return null;
  }
  if (numero >= 0 && numero <= 10) {
    return numero;
  }
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }
  return null;
}

function formatarNota(nota) {
  if (nota === null || nota === undefined) return "—";
  return Number(nota).toFixed(1).replace(".", ",");
}

function somarFaltas(faltas) {
  if (!Array.isArray(faltas)) return 0;
  let total = 0;
  faltas.forEach(function (f) {
    total += (Number(f) || 0);
  });
  return total;
}

function calcularMedia(notas) {
  const validas = notas.filter(function (n) {
    return n !== null && n !== undefined;
  });
  if (validas.length === 0) return null;
  let soma = 0;
  validas.forEach(function (n) {
    soma += n;
  });
  return soma / validas.length;
}

function definirSituacao(media) {
  if (media === null) return "Nota ainda não disponível";
  if (media >= MEDIA_MINIMA) return "Bom desempenho";
  return "Atenção";
}

/* ---------------------------------------------------------
   RENDERIZAÇÃO DA TABELA E CARDS DE RESUMO
   --------------------------------------------------------- */
function renderizarBoletim(listaDisciplinas) {
  const corpoTabela = document.getElementById("corpo-tabela");
  corpoTabela.innerHTML = "";

  let somaMedias = 0;
  let totalMedias = 0;
  let totalFaltasGeral = 0;
  let contagemBom = 0;
  let contagemAtencao = 0;

  listaDisciplinas.forEach(function (item) {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const media = calcularMedia([n1, n2, n3]);
    const faltasArray = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];
    const faltas = somarFaltas(faltasArray);
    totalFaltasGeral += faltas;

    const situacao = definirSituacao(media);

    if (media !== null) {
      somaMedias += media;
      totalMedias++;
      if (media >= MEDIA_MINIMA) {
        contagemBom++;
      } else {
        contagemAtencao++;
      }
    }

    let classeSituacao = "situacao-sem-nota";
    if (situacao === "Bom desempenho") classeSituacao = "situacao-bom";
    if (situacao === "Atenção") classeSituacao = "situacao-atencao";

    const linha = document.createElement("tr");

    const tdNome = document.createElement("td");
    tdNome.textContent = item.disciplina;

    const tdT1 = document.createElement("td");
    tdT1.textContent = formatarNota(n1);

    const tdT2 = document.createElement("td");
    tdT2.textContent = formatarNota(n2);

    const tdT3 = document.createElement("td");
    tdT3.textContent = formatarNota(n3);

    const tdMedia = document.createElement("td");
    tdMedia.textContent = media === null ? "Ainda não lançada" : formatarNota(media);

    const tdFaltas = document.createElement("td");
    tdFaltas.textContent = faltas;

    const tdSituacao = document.createElement("td");
    tdSituacao.textContent = situacao;
    tdSituacao.className = classeSituacao;

    linha.appendChild(tdNome);
    linha.appendChild(tdT1);
    linha.appendChild(tdT2);
    linha.appendChild(tdT3);
    linha.appendChild(tdMedia);
    linha.appendChild(tdFaltas);
    linha.appendChild(tdSituacao);

    corpoTabela.appendChild(linha);
  });

  const mediaGeral = totalMedias > 0 ? somaMedias / totalMedias : null;
  document.getElementById("media-geral").textContent =
    mediaGeral === null ? "—" : formatarNota(mediaGeral);

  document.getElementById("total-faltas").textContent = totalFaltasGeral;
  document.getElementById("bom-desempenho").textContent = contagemBom;
  document.getElementById("atencao").textContent = contagemAtencao;
  document.getElementById("frequencia").textContent = "92%";
}

/* ---------------------------------------------------------
   AUTENTICAÇÃO E CONEXÃO COM A API
   --------------------------------------------------------- */
const btnEntrar = document.getElementById("btn-entrar");
const pinInput = document.getElementById("pin-input");
const mensagemLogin = document.getElementById("mensagem-login");

btnEntrar.addEventListener("click", realizarLogin);

function realizarLogin() {
  const pinDigitado = pinInput.value.trim();

  if (!pinDigitado) {
    mensagemLogin.textContent = "Por favor, informe seu PIN.";
    mensagemLogin.className = "mensagem-status erro";
    return;
  }

  mensagemLogin.textContent = "Conectando...";
  mensagemLogin.className = "mensagem-status info";

  fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      turma: CONFIG_ALUNO.turma,
      numero_chamada: CONFIG_ALUNO.numeroChamada,
      pin: pinDigitado
    })
  })
    .then(function (resposta) {
      if (resposta.status === 401) {
        throw new Error("Turma, chamada ou PIN inválidos.");
      }
      if (resposta.status === 429) {
        throw new Error("Muitas tentativas. Aguarde um minuto e tente novamente.");
      }
      if (!resposta.ok) {
        throw new Error("Não foi possível conectar ao servidor. Tente novamente.");
      }
      return resposta.json();
    })
    .then(function (dadosRecebidos) {
      pinSessao = pinDigitado;
      pinInput.value = "";
      mensagemLogin.textContent = "";

      if (dadosRecebidos && dadosRecebidos.dados && Array.isArray(dadosRecebidos.dados.disciplinas)) {
        dadosAtuais = dadosRecebidos.dados.disciplinas;
      } else {
        dadosAtuais = disciplinasLocais;
      }

      document.getElementById("secao-login").style.display = "none";
      document.getElementById("area-boletim").style.display = "block";
      renderizarBoletim(dadosAtuais);
    })
    .catch(function (erro) {
      mensagemLogin.textContent = erro.message || "Não foi possível conectar ao servidor. Tente novamente.";
      mensagemLogin.className = "mensagem-status erro";
    });
}

/* ---------------------------------------------------------
   EDIÇÃO E SALVAMENTO DE DADOS
   --------------------------------------------------------- */
const btnAlterarDados = document.getElementById("btn-alterar-dados");
const secaoEdicao = document.getElementById("secao-edicao");
const containerCampos = document.getElementById("container-campos-edicao");
const formEdicao = document.getElementById("form-edicao");
const btnCancelar = document.getElementById("btn-cancelar");
const mensagemEdicao = document.getElementById("mensagem-edicao");

btnAlterarDados.addEventListener("click", abrirEdicao);
btnCancelar.addEventListener("click", fecharEdicao);

function abrirEdicao() {
  containerCampos.innerHTML = "";
  mensagemEdicao.textContent = "";

  dadosAtuais.forEach(function (disc, idx) {
    const divItem = document.createElement("div");
    divItem.className = "grid-edicao-item";

    const h4 = document.createElement("h4");
    h4.textContent = disc.disciplina;
    divItem.appendChild(h4);

    const divCampos = document.createElement("div");
    divCampos.className = "campos-notas-faltas";

    const n1 = normalizarNota(disc.tri1);
    const n2 = normalizarNota(disc.tri2);
    const n3 = normalizarNota(disc.tri3);

    const faltasArr = Array.isArray(disc.faltas) ? disc.faltas : [0, 0, 0];

    divCampos.innerHTML = `
      <div class="campo-grupo">
        <label>Nota 1º Tri</label>
        <input type="text" id="n1_${idx}" value="${n1 !== null ? n1 : ""}">
      </div>
      <div class="campo-grupo">
        <label>Nota 2º Tri</label>
        <input type="text" id="n2_${idx}" value="${n2 !== null ? n2 : ""}">
      </div>
      <div class="campo-grupo">
        <label>Nota 3º Tri</label>
        <input type="text" id="n3_${idx}" value="${n3 !== null ? n3 : ""}">
      </div>
      <div class="campo-grupo">
        <label>Faltas 1º Tri</label>
        <input type="text" id="f1_${idx}" value="${faltasArr[0] !== undefined ? faltasArr[0] : 0}">
      </div>
      <div class="campo-grupo">
        <label>Faltas 2º Tri</label>
        <input type="text" id="f2_${idx}" value="${faltasArr[1] !== undefined ? faltasArr[1] : 0}">
      </div>
      <div class="campo-grupo">
        <label>Faltas 3º Tri</label>
        <input type="text" id="f3_${idx}" value="${faltasArr[2] !== undefined ? faltasArr[2] : 0}">
      </div>
    `;

    divItem.appendChild(divCampos);
    containerCampos.appendChild(divItem);
  });

  secaoEdicao.style.display = "block";
}

function fecharEdicao() {
  secaoEdicao.style.display = "none";
  mensagemEdicao.textContent = "";
}

function validarNotaEdicao(valStr) {
  const texto = valStr.trim();
  if (texto === "") return { valido: true, valor: null };

  const textoComPonto = texto.replace(",", ".");
  const num = Number(textoComPonto);

  if (isNaN(num) || num < 0 || num > 10) {
    return { valido: false };
  }
  return { valido: true, valor: num };
}

function validarFaltaEdicao(valStr) {
  const texto = valStr.trim();
  if (texto === "") return { valido: false };

  const num = Number(texto);
  if (isNaN(num) || !Number.isInteger(num) || num < 0) {
    return { valido: false };
  }
  return { valido: true, valor: num };
}

formEdicao.addEventListener("submit", function (e) {
  e.preventDefault();

  let temErro = false;
  const novosDados = [];

  // Limpa erros anteriores
  document.querySelectorAll(".campo-invalido").forEach(function (el) {
    el.classList.remove("campo-invalido");
  });

  dadosAtuais.forEach(function (disc, idx) {
    const inputN1 = document.getElementById(`n1_${idx}`);
    const inputN2 = document.getElementById(`n2_${idx}`);
    const inputN3 = document.getElementById(`n3_${idx}`);
    const inputF1 = document.getElementById(`f1_${idx}`);
    const inputF2 = document.getElementById(`f2_${idx}`);
    const inputF3 = document.getElementById(`f3_${idx}`);

    const resN1 = validarNotaEdicao(inputN1.value);
    if (!resN1.valido) { inputN1.classList.add("campo-invalido"); temErro = true; }

    const resN2 = validarNotaEdicao(inputN2.value);
    if (!resN2.valido) { inputN2.classList.add("campo-invalido"); temErro = true; }

    const resN3 = validarNotaEdicao(inputN3.value);
    if (!resN3.valido) { inputN3.classList.add("campo-invalido"); temErro = true; }

    const resF1 = validarFaltaEdicao(inputF1.value);
    if (!resF1.valido) { inputF1.classList.add("campo-invalido"); temErro = true; }

    const resF2 = validarFaltaEdicao(inputF2.value);
    if (!resF2.valido) { inputF2.classList.add("campo-invalido"); temErro = true; }

    const resF3 = validarFaltaEdicao(inputF3.value);
    if (!resF3.valido) { inputF3.classList.add("campo-invalido"); temErro = true; }

    if (!temErro) {
      novosDados.push({
        disciplina: disc.disciplina,
        tri1: resN1.valor,
        tri2: resN2.valor,
        tri3: resN3.valor,
        faltas: [resF1.valor, resF2.valor, resF3.valor]
      });
    }
  });

  if (temErro) {
    mensagemEdicao.textContent = "Por favor, corrija os campos destacados em vermelho.";
    mensagemEdicao.className = "mensagem-status erro";
    return;
  }

  mensagemEdicao.textContent = "Salvando...";
  mensagemEdicao.className = "mensagem-status info";

  fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      turma: CONFIG_ALUNO.turma,
      numero_chamada: CONFIG_ALUNO.numeroChamada,
      pin: pinSessao,
      dados: {
        disciplinas: novosDados
      }
    })
  })
    .then(function (resposta) {
      if (!resposta.ok) {
        throw new Error("Erro ao salvar no servidor. Tente novamente.");
      }
      return resposta.json();
    })
    .then(function () {
      dadosAtuais = novosDados;
      renderizarBoletim(dadosAtuais);
      mensagemEdicao.textContent = "Dados salvos com sucesso.";
      mensagemEdicao.className = "mensagem-status sucesso";
      setTimeout(fecharEdicao, 1500);
    })
    .catch(function (erro) {
      mensagemEdicao.textContent = erro.message || "Não foi possível salvar as alterações.";
      mensagemEdicao.className = "mensagem-status erro";
    });
});