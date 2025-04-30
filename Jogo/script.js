const startBtn = document.getElementById('startBtn');
const area = document.getElementById('area');
const instrucoes = document.getElementById('instrucoes');
const hud = document.getElementById('hud');
const pontosEl = document.getElementById('pontos');
const tempoEl = document.getElementById('tempo');

startBtn.onclick = () => {
  startBtn.style.display = "none";
  area.style.display = "block";
  instrucoes.style.display = "block";
  hud.style.display = "block";
  iniciarJogo();
};

function iniciarJogo() {
  const quadrado = document.getElementById('quadrado');

  const areaLargura = 900;
  const areaAltura = 500;
  const quadradoTamanho = 50;
  const circuloTamanho = 20;

  let posX = (areaLargura - quadradoTamanho) / 2;
  let posY = (areaAltura - quadradoTamanho) / 2;

  quadrado.style.left = posX + "px";
  quadrado.style.top = posY + "px";

  let teclasPressionadas = {};
  let circulos = [];
  let pontos = 0;
  let tempo = 0;
  let cronometro = null;

  function atualizarPontuacao() {
    pontosEl.textContent = pontos;
  }

  function iniciarCronometro() {
    cronometro = setInterval(() => {
      tempo++;
      tempoEl.textContent = tempo;
    }, 1000);
  }

  function criarCirculos(qtd) {
    for (let i = 0; i < qtd; i++) {
      const circulo = document.createElement('div');
      circulo.classList.add('circulo');

      const x = Math.floor(Math.random() * (areaLargura - circuloTamanho));
      const y = Math.floor(Math.random() * (areaAltura - circuloTamanho));

      circulo.style.left = x + 'px';
      circulo.style.top = y + 'px';

      area.appendChild(circulo);
      circulos.push(circulo);
    }
  }

  function reiniciarCirculos() {
    // Limpa os círculos existentes
    circulos.forEach(circulo => area.removeChild(circulo));
    circulos = [];
    // Cria novos círculos
    criarCirculos(5);
  }

  function mover() {
    if (teclasPressionadas["ArrowRight"]) posX += 10;
    if (teclasPressionadas["ArrowLeft"]) posX -= 10;
    if (teclasPressionadas["ArrowUp"]) posY -= 10;
    if (teclasPressionadas["ArrowDown"]) posY += 10;

    posX = Math.max(0, Math.min(posX, areaLargura - quadradoTamanho));
    posY = Math.max(0, Math.min(posY, areaAltura - quadradoTamanho));

    quadrado.style.left = posX + "px";
    quadrado.style.top = posY + "px";

    // Verifica colisão com círculos
    for (let i = circulos.length - 1; i >= 0; i--) {
      const circulo = circulos[i];
      const cx = parseInt(circulo.style.left);
      const cy = parseInt(circulo.style.top);

      if (
        posX < cx + circuloTamanho &&
        posX + quadradoTamanho > cx &&
        posY < cy + circuloTamanho &&
        posY + quadradoTamanho > cy
      ) {
        area.removeChild(circulo);
        circulos.splice(i, 1); // Remove o círculo coletado
        pontos++;
        atualizarPontuacao();

        // Verifica se todos os círculos foram coletados
        if (circulos.length === 0) {
          reiniciarCirculos(); // Reinicia os círculos
        }
      }
    }
  }

  document.onkeydown = function (event) {
    teclasPressionadas[event.key] = true;
    mover();
  };

  document.onkeyup = function (event) {
    teclasPressionadas[event.key] = false;
  };

  criarCirculos(5); // Cria os círculos no início do jogo
  atualizarPontuacao();
  iniciarCronometro();
}