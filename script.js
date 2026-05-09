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

// Efeito de constelação conectando no cursor
const constellationCanvas = document.getElementById('constellationCanvas');

if (constellationCanvas) {
  const ctx = constellationCanvas.getContext('2d');

  let width = window.innerWidth;
  let height = window.innerHeight;
  let pixelRatio = window.devicePixelRatio || 1;

  let mouseX = null;
  let mouseY = null;
  let mouseActive = false;

  const particles = [];

  const particleAmount = 48;
  const particleConnectionDistance = 145;
  const mouseConnectionDistance = 230;

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
      vx: randomBetween(-0.12, 0.12),
      vy: randomBetween(-0.12, 0.12),
      size: randomBetween(1, 1.8),
      opacity: randomBetween(0.22, 0.55)
    };
  }

  function fillParticles() {
    particles.length = 0;

    for (let i = 0; i < particleAmount; i++) {
      particles.push(createParticle());
    }
  }

  resizeCanvas();
  fillParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
    fillParticles();
  });

  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    mouseActive = true;
  });

  document.addEventListener('mouseleave', () => {
    mouseActive = false;
    mouseX = null;
    mouseY = null;
  });

  function updateParticles() {
    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < -30) particle.x = width + 30;
      if (particle.x > width + 30) particle.x = -30;
      if (particle.y < -30) particle.y = height + 30;
      if (particle.y > height + 30) particle.y = -30;
    });
  }

  function drawParticleConnections() {
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < particleConnectionDistance) {
          const opacity = (1 - distance / particleConnectionDistance) * 0.08;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 65, 65, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function drawMouseConnections() {
    if (!mouseActive || mouseX === null || mouseY === null) return;

    particles.forEach((particle) => {
      const dx = particle.x - mouseX;
      const dy = particle.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouseConnectionDistance) {
        const opacity = (1 - distance / mouseConnectionDistance) * 0.35;

        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = `rgba(255, 75, 75, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 90, 90, 0.8)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 9, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 35, 35, 0.08)';
    ctx.fill();
  }

  function drawParticles() {
    particles.forEach((particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 120, 120, ${particle.opacity})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 35, 35, ${particle.opacity * 0.06})`;
      ctx.fill();
    });
  }

  function animateConstellation() {
    ctx.clearRect(0, 0, width, height);

    updateParticles();
    drawParticleConnections();
    drawMouseConnections();
    drawParticles();

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
