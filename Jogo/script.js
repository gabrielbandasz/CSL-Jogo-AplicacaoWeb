const startBtn = document.getElementById('startBtn');
const area = document.getElementById('area');
const instrucoes = document.getElementById('instrucoes');
const hud = document.getElementById('hud');
const pontosEl = document.getElementById('pontos');
const tempoEl = document.getElementById('tempo');
const quadrado = document.getElementById('quadrado');

startBtn.onclick = () => {
  startBtn.style.display = "none";
  area.style.display = "block";
  instrucoes.style.display = "block";
  hud.style.display = "block";
  iniciarJogo();
};

function iniciarJogo() {
  const areaLargura = 900;
  const areaAltura = 500;
  const quadradoTamanho = 50;
  const circuloTamanho = 20;
  const trianguloTamanho = 40;

  let posX = (areaLargura - quadradoTamanho) / 2;
  let posY = (areaAltura - quadradoTamanho) / 2;

  quadrado.style.left = posX + "px";
  quadrado.style.top = posY + "px";

  let teclasPressionadas = {};
  let circulos = [];
  let triangulos = [];
  let pontos = 0;
  let tempo = 0;
  let cronometro = null;
  let pontosCom3Triangulos = 0;
  let gameOver = false;
  setInterval(() => {
    if (!gameOver) moverTriangulos();
  }, 30); // chama a função a cada 30ms
  
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

  function criarTriangulo() {
    const triangulo = document.createElement('div');
    triangulo.classList.add('triangulo');
    triangulo.style.left = "0px";
    triangulo.style.top = "0px";
    area.appendChild(triangulo);
    triangulos.push({ el: triangulo, x: 0, y: 0 });
  }

  function moverTriangulos() {
    triangulos.forEach(t => {
      const dx = posX - t.x;
      const dy = posY - t.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = 2.5; // Aumenta a velocidade
  
      if (dist > 0) {
        t.x += (dx / dist) * speed;
        t.y += (dy / dist) * speed;
      }
  
      t.el.style.left = t.x + 'px';
      t.el.style.top = t.y + 'px';
  
      // Verifica colisão com o quadrado
      if (
        t.x < posX + quadradoTamanho &&
        t.x + trianguloTamanho > posX &&
        t.y < posY + quadradoTamanho &&
        t.y + trianguloTamanho > posY
      ) {
        encerrarJogo(false);
      }
    });
  }
  

  function reiniciarCirculos() {
    circulos.forEach(circulo => area.removeChild(circulo));
    circulos = [];
    criarCirculos(5);
  }

  function encerrarJogo(venceu) {
    gameOver = true;
    clearInterval(cronometro);
    document.onkeydown = null;
    document.onkeyup = null;
    alert(venceu ? "Você venceu o jogo!" : "Game Over! Você foi pego.");
    location.reload(); // reinicia a página
  }

  function mover() {
    if (gameOver) return;

    if (teclasPressionadas["ArrowRight"]) posX += 10;
    if (teclasPressionadas["ArrowLeft"]) posX -= 10;
    if (teclasPressionadas["ArrowUp"]) posY -= 10;
    if (teclasPressionadas["ArrowDown"]) posY += 10;

    posX = Math.max(0, Math.min(posX, areaLargura - quadradoTamanho));
    posY = Math.max(0, Math.min(posY, areaAltura - quadradoTamanho));

    quadrado.style.left = posX + "px";
    quadrado.style.top = posY + "px";

    moverTriangulos();

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
        circulos.splice(i, 1);
        pontos++;
        atualizarPontuacao();

        if (pontos % 5 === 0 && triangulos.length < 3) {
          criarTriangulo();
        }

        if (triangulos.length === 3) {
          pontosCom3Triangulos++;
          if (pontosCom3Triangulos >= 5) {
            encerrarJogo(true); // vitória
          }
        }

        if (circulos.length === 0) {
          reiniciarCirculos();
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

  criarCirculos(5);
  atualizarPontuacao();
  iniciarCronometro();
}
