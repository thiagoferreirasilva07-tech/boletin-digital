/* =========================================================
   BOLETIM DIGITAL - 8º ANO
   Dados fictícios apenas para demonstração.
   ========================================================= */

/* ---------------------------------------------------------
   CONCEITO: array
   Um array é uma lista. Aqui temos uma lista de objetos,
   cada objeto é uma disciplina.
   --------------------------------------------------------- */
const disciplinas = [
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

/* ---------------------------------------------------------
   CONCEITO: função
   Uma função é um bloco de código que faz uma tarefa.
   ---------------------------------------------------------
   Normaliza a nota para a escala 0 a 10.
   - vazio/null/undefined -> null (ainda não lançada)
   - 0 a 10 -> mantém
   - >10 e <=100 -> divide por 10
   - aceita vírgula ou ponto
   - valores inválidos -> null
   --------------------------------------------------------- */
function normalizarNota(valor) {
  // CONCEITO: if -> verifica uma condição
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Converte para número, trocando vírgula por ponto se necessário
  const numero = typeof valor === "string"
    ? parseFloat(valor.replace(",", "."))
    : Number(valor);

  // Se não for um número válido, retorna null
  if (isNaN(numero)) {
    return null;
  }

  // Regra: valores entre 0 e 10 permanecem
  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  // Regra: valores maiores que 10 e até 100 viram nota /10
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  // Fora das regras = inválido
  return null;
}

/* Formata a nota para exibir com uma casa decimal (ex: 8,2) */
function formatarNota(nota) {
  if (nota === null) return "—";
  return nota.toFixed(1).replace(".", ",");
}

/* Soma as faltas de um array de faltas */
function somarFaltas(faltas) {
  let total = 0;
  // CONCEITO: forEach -> percorre cada item do array
  faltas.forEach(function (f) {
    total += f;
  });
  return total;
}

/* Calcula a média usando só as notas válidas */
function calcularMedia(notas) {
  const validas = notas.filter(function (n) {
    return n !== null;
  });

  if (validas.length === 0) return null;

  let soma = 0;
  validas.forEach(function (n) {
    soma += n;
  });

  return soma / validas.length;
}

/* Define a situação da disciplina */
function definirSituacao(media) {
  if (media === null) return "Nota ainda não disponível";
  if (media >= MEDIA_MINIMA) return "Bom desempenho";
  return "Atenção";
}

/* ---------------------------------------------------------
   CONCEITO: DOM
   DOM é a representação da página HTML no JavaScript.
   Usamos document.getElementById para pegar elementos.
   --------------------------------------------------------- */

/* Pega o corpo da tabela */
const corpoTabela = document.getElementById("corpo-tabela");

/* Variáveis para os totais dos cards */
let somaMedias = 0;
let totalMedias = 0;
let totalFaltasGeral = 0;
let contagemBom = 0;
let contagemAtencao = 0;

/* Preenche a tabela e calcula os totais */
disciplinas.forEach(function (item) {
  // Normaliza as três notas
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);

  // Calcula a média
  const media = calcularMedia([n1, n2, n3]);

  // Soma faltas
  const faltas = somarFaltas(item.faltas);
  totalFaltasGeral += faltas;

  // Define a situação
  const situacao = definirSituacao(media);

  // Acumula para os cards
  if (media !== null) {
    somaMedias += media;
    totalMedias++;
    if (media >= MEDIA_MINIMA) {
      contagemBom++;
    } else {
      contagemAtencao++;
    }
  }

  // Classe CSS da situação
  let classeSituacao = "situacao-sem-nota";
  if (situacao === "Bom desempenho") classeSituacao = "situacao-bom";
  if (situacao === "Atenção") classeSituacao = "situacao-atencao";

  // Cria a linha da tabela
  const linha = document.createElement("tr");
  linha.innerHTML = `
    <td>${item.disciplina}</td>
    <td>${formatarNota(n1)}</td>
    <td>${formatarNota(n2)}</td>
    <td>${formatarNota(n3)}</td>
    <td>${media === null ? "Ainda não lançada" : formatarNota(media)}</td>
    <td>${faltas}</td>
    <td class="${classeSituacao}">${situacao}</td>
  `;
  corpoTabela.appendChild(linha);
});

/* Preenche os cards de resumo */
const mediaGeral = totalMedias > 0 ? somaMedias / totalMedias : null;

document.getElementById("media-geral").textContent =
  mediaGeral === null ? "—" : formatarNota(mediaGeral);

document.getElementById("total-faltas").textContent = totalFaltasGeral;

document.getElementById("bom-desempenho").textContent = contagemBom;

document.getElementById("atencao").textContent = contagemAtencao;

/* ---------------------------------------------------------
   FREQUÊNCIA DEMONSTRATIVA
   Este valor de 92% é apenas fictício, só para mostrar
   como o card funciona. No futuro será calculado de outra forma.
   --------------------------------------------------------- */
document.getElementById("frequencia").textContent = "92%";