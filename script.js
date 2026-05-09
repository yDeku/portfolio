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

// Efeito de constelações no mouse
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
  const particleAmount = 34;
  const maxParticles = 58;
  const connectionDistance = 95;

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createParticle() {
    return {
      x: mouseX + randomBetween(-140, 140),
      y: mouseY + randomBetween(-140, 140),
      vx: randomBetween(-0.45, 0.45),
      vy: randomBetween(-0.45, 0.45),
      size: randomBetween(1.2, 2.4),
      opacity: randomBetween(0.25, 0.9),
      life: randomBetween(80, 160)
    };
  }

  function fillParticles() {
    particles.length = 0;

    for (let i = 0; i < particleAmount; i++) {
      particles.push(createParticle());
    }
  }

  fillParticles();

  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    mouseActive = true;

    for (let i = 0; i < 2; i++) {
      particles.push(createParticle());
    }

    if (particles.length > maxParticles) {
      particles.splice(0, particles.length - maxParticles);
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

    fillParticles();
  });

  function updateParticles() {
    particles.forEach((particle, index) => {
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const distanceFromMouse = Math.sqrt(dx * dx + dy * dy);

      if (mouseActive && distanceFromMouse > 180) {
        particle.x += dx * 0.018;
        particle.y += dy * 0.018;
      }

      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 0.6;

      if (
        particle.life <= 0 ||
        particle.x < -80 ||
        particle.x > width + 80 ||
        particle.y < -80 ||
        particle.y > height + 80
      ) {
        particles[index] = createParticle();
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
          const lineOpacity = (1 - distance / connectionDistance) * 0.22;

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
      ctx.fillStyle = `rgba(255, 95, 95, ${particle.opacity})`;
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
