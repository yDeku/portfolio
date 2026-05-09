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

// Efeito de constelações no background todo
const constellationCanvas = document.getElementById('constellationCanvas');

if (constellationCanvas) {
  const ctx = constellationCanvas.getContext('2d');

  let width = window.innerWidth;
  let height = window.innerHeight;

  constellationCanvas.width = width;
  constellationCanvas.height = height;

  let mouseX = width / 2;
  let mouseY = height / 2;
  let mouseActive = false;

  const particles = [];
  const backgroundParticleAmount = 85;
  const maxParticles = 120;
  const connectionDistance = 135;
  const mouseRadius = 230;

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createBackgroundParticle() {
    return {
      x: randomBetween(0, width),
      y: randomBetween(0, height),
      vx: randomBetween(-0.22, 0.22),
      vy: randomBetween(-0.22, 0.22),
      size: randomBetween(1, 2.1),
      opacity: randomBetween(0.18, 0.65),
      life: Infinity,
      mouseParticle: false
    };
  }

  function createMouseParticle() {
    return {
      x: mouseX + randomBetween(-120, 120),
      y: mouseY + randomBetween(-120, 120),
      vx: randomBetween(-0.55, 0.55),
      vy: randomBetween(-0.55, 0.55),
      size: randomBetween(1.1, 2.4),
      opacity: randomBetween(0.35, 0.9),
      life: randomBetween(80, 150),
      mouseParticle: true
    };
  }

  function fillBackgroundParticles() {
    particles.length = 0;

    for (let i = 0; i < backgroundParticleAmount; i++) {
      particles.push(createBackgroundParticle());
    }
  }

  fillBackgroundParticles();

  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    mouseActive = true;

    for (let i = 0; i < 2; i++) {
      particles.push(createMouseParticle());
    }

    if (particles.length > maxParticles) {
      particles.splice(backgroundParticleAmount, particles.length - maxParticles);
    }
  });

  document.addEventListener('mouseleave', () => {
    mouseActive = false;
  });

  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;

    constellationCanvas.width = width;
    constellationCanvas.height = height;

    fillBackgroundParticles();
  });

  function updateParticles() {
    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (!particle.mouseParticle) {
        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;
      }

      if (mouseActive) {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRadius) {
          particle.x -= dx * 0.003;
          particle.y -= dy * 0.003;
        }
      }

      if (particle.mouseParticle) {
        particle.life -= 0.7;
        particle.opacity *= 0.992;

        if (
          particle.life <= 0 ||
          particle.x < -100 ||
          particle.x > width + 100 ||
          particle.y < -100 ||
          particle.y > height + 100
        ) {
          particles.splice(index, 1);
        }
      }
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          let lineOpacity = (1 - distance / connectionDistance) * 0.16;

          if (p1.mouseParticle || p2.mouseParticle) {
            lineOpacity *= 1.8;
          }

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 55, 55, ${lineOpacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach((particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 105, 105, ${particle.opacity})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 3.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 35, 35, ${particle.opacity * 0.08})`;
      ctx.fill();
    });
  }

  function animateConstellation() {
    updateParticles();
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
