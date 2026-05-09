// Scroll reveal
const revealElements = document.querySelectorAll('.reveal');

function revealOnScroll() {
  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementTop < windowHeight - 80) {
      element.classList.add('active');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Constelação conectando obrigatoriamente no cursor
const constellationCanvas = document.getElementById('constellationCanvas');

if (constellationCanvas) {
  const ctx = constellationCanvas.getContext('2d');

  let width = window.innerWidth;
  let height = window.innerHeight;
  let pixelRatio = window.devicePixelRatio || 1;

  let mouseX = width / 2;
  let mouseY = height / 2;
  let mouseActive = false;

  const particles = [];

  const particleAmount = 55;
  const backgroundConnectionDistance = 145;

  // Quantos pontos vão conectar no cursor
  const cursorConnections = 9;

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    pixelRatio = window.devicePixelRatio || 1;

    constellationCanvas.width = width * pixelRatio;
    constellationCanvas.height = height * pixelRatio;

    constellationCanvas.style.width = `${width}px`;
    constellationCanvas.style.height = `${height}px`;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createParticle() {
    return {
      x: randomBetween(0, width),
      y: randomBetween(0, height),
      vx: randomBetween(-0.10, 0.10),
      vy: randomBetween(-0.10, 0.10),
      size: randomBetween(1.1, 2),
      opacity: randomBetween(0.32, 0.7)
    };
  }

  function createParticles() {
    particles.length = 0;

    for (let i = 0; i < particleAmount; i++) {
      particles.push(createParticle());
    }
  }

  resizeCanvas();
  createParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });

  function updateMousePosition(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    mouseActive = true;
  }

  window.addEventListener('mousemove', updateMousePosition);
  window.addEventListener('pointermove', updateMousePosition);

  document.addEventListener('mouseleave', () => {
    mouseActive = false;
  });

  function updateParticles() {
    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < -40) particle.x = width + 40;
      if (particle.x > width + 40) particle.x = -40;
      if (particle.y < -40) particle.y = height + 40;
      if (particle.y > height + 40) particle.y = -40;
    });
  }

  function drawBackgroundConnections() {
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < backgroundConnectionDistance) {
          const opacity = (1 - distance / backgroundConnectionDistance) * 0.09;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 70, 70, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function drawParticles() {
    particles.forEach((particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 120, 120, ${particle.opacity})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 35, 35, ${particle.opacity * 0.08})`;
      ctx.fill();
    });
  }

  function drawCursorConnections() {
    if (!mouseActive) return;

    const nearestParticles = particles
      .map((particle) => {
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return {
          particle,
          distance
        };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, cursorConnections);

    nearestParticles.forEach((item, index) => {
      const particle = item.particle;

      const opacity = Math.max(0.18, 0.65 - index * 0.055);

      ctx.beginPath();
      ctx.moveTo(mouseX, mouseY);
      ctx.lineTo(particle.x, particle.y);
      ctx.strokeStyle = `rgba(255, 80, 80, ${opacity})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });

    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 120, 120, 1)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 18, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 35, 35, 0.14)';
    ctx.fill();
  }

  function animateConstellation() {
    ctx.clearRect(0, 0, width, height);

    updateParticles();

    drawBackgroundConnections();
    drawParticles();

    // Desenha por último para as linhas do cursor ficarem por cima
    drawCursorConnections();

    requestAnimationFrame(animateConstellation);
  }

  animateConstellation();
}

// Menu mobile
const menuButton = document.getElementById('menuButton');
const menuPanel = document.getElementById('menuPanel');

if (menuButton && menuPanel) {
  menuButton.addEventListener('click', () => {
    menuPanel.classList.toggle('active');
    menuButton.classList.toggle('active');
  });

  menuPanel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuPanel.classList.remove('active');
      menuButton.classList.remove('active');
    });
  });

  document.addEventListener('click', (event) => {
    const clickedInsideMenu = menuPanel.contains(event.target);
    const clickedButton = menuButton.contains(event.target);

    if (!clickedInsideMenu && !clickedButton) {
      menuPanel.classList.remove('active');
      menuButton.classList.remove('active');
    }
  });
}

// Discord copiar
const discord = document.getElementById('discord');

if (discord) {
  discord.addEventListener('click', () => {
    navigator.clipboard.writeText('anakinsky01');

    const feedback = discord.querySelector('.contact-action');
    feedback.textContent = 'copied';

    setTimeout(() => {
      feedback.textContent = 'copy';
    }, 1500);
  });
}

// YouTube abrir
const youtube = document.getElementById('youtube');

if (youtube) {
  youtube.addEventListener('click', () => {
    window.open('https://www.youtube.com/@ydekuh', '_blank');
  });
}
