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

// Constelação com conexões temporárias no cursor
const constellationCanvas = document.getElementById('constellationCanvas');

if (constellationCanvas) {
  const ctx = constellationCanvas.getContext('2d');

  let width = window.innerWidth;
  let height = window.innerHeight;
  let pixelRatio = window.devicePixelRatio || 1;

  let mouseX = width / 2;
  let mouseY = height / 2;
  let mouseActive = false;

  let lastLinkTime = 0;

  const particles = [];
  const cursorLinks = [];

  const particleAmount = 55;
  const backgroundConnectionDistance = 145;

  const cursorConnectionDistance = 280;
  const cursorLinksPerMove = 3;
  const maxCursorLinks = 22;
  const cursorLinkDuration = 900;
  const cursorLinkCooldown = 55;

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
      opacity: randomBetween(0.28, 0.62)
    };
  }

  function createParticles() {
    particles.length = 0;
    cursorLinks.length = 0;

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

  function getDistance(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;

    return Math.sqrt(dx * dx + dy * dy);
  }

  function createCursorLinks() {
    const now = performance.now();

    if (now - lastLinkTime < cursorLinkCooldown) return;

    lastLinkTime = now;

    const nearbyParticles = particles
      .map((particle, index) => {
        return {
          particle,
          index,
          distance: getDistance(mouseX, mouseY, particle.x, particle.y)
        };
      })
      .filter((item) => item.distance < cursorConnectionDistance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, cursorLinksPerMove);

    nearbyParticles.forEach((item) => {
      const alreadyLinked = cursorLinks.some((link) => {
        return link.particle === item.particle && link.life > 250;
      });

      if (alreadyLinked) return;

      cursorLinks.push({
        particle: item.particle,
        startX: mouseX,
        startY: mouseY,
        life: cursorLinkDuration,
        maxLife: cursorLinkDuration,
        offset: randomBetween(-10, 10)
      });
    });

    if (cursorLinks.length > maxCursorLinks) {
      cursorLinks.splice(0, cursorLinks.length - maxCursorLinks);
    }
  }

  function updateMousePosition(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    mouseActive = true;

    createCursorLinks();
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

  function updateCursorLinks() {
    for (let i = cursorLinks.length - 1; i >= 0; i--) {
      cursorLinks[i].life -= 16;

      if (cursorLinks[i].life <= 0) {
        cursorLinks.splice(i, 1);
      }
    }
  }

  function drawBackgroundConnections() {
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];

        const distance = getDistance(p1.x, p1.y, p2.x, p2.y);

        if (distance < backgroundConnectionDistance) {
          const opacity = (1 - distance / backgroundConnectionDistance) * 0.07;

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
      ctx.fillStyle = `rgba(255, 35, 35, ${particle.opacity * 0.06})`;
      ctx.fill();
    });
  }

  function drawCursorLinks() {
    cursorLinks.forEach((link) => {
      const progress = link.life / link.maxLife;
      const particle = link.particle;

      const opacity = progress * 0.48;
      const breakProgress = 1 - progress;

      const startX = link.startX + (mouseX - link.startX) * 0.25;
      const startY = link.startY + (mouseY - link.startY) * 0.25;

      const endX = particle.x;
      const endY = particle.y;

      const midX = (startX + endX) / 2 + Math.sin(breakProgress * Math.PI) * link.offset;
      const midY = (startY + endY) / 2 + Math.cos(breakProgress * Math.PI) * link.offset;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(midX, midY, endX, endY);
      ctx.strokeStyle = `rgba(255, 85, 85, ${opacity})`;
      ctx.lineWidth = 1.15;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(endX, endY, particle.size + progress * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 95, 95, ${opacity * 0.7})`;
      ctx.fill();
    });

    if (mouseActive) {
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 120, 120, 0.85)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 13, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 35, 35, 0.09)';
      ctx.fill();
    }
  }

  function animateConstellation() {
    ctx.clearRect(0, 0, width, height);

    updateParticles();
    updateCursorLinks();

    drawBackgroundConnections();
    drawParticles();
    drawCursorLinks();

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
