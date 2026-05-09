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

// Constelação com linhas que esticam e estouram no cursor
const constellationCanvas = document.getElementById('constellationCanvas');

if (constellationCanvas) {
  const ctx = constellationCanvas.getContext('2d');

  let width = window.innerWidth;
  let height = window.innerHeight;
  let pixelRatio = window.devicePixelRatio || 1;

  let mouseX = width / 2;
  let mouseY = height / 2;
  let lastMouseX = mouseX;
  let lastMouseY = mouseY;
  let mouseSpeed = 0;
  let mouseActive = false;

  const particles = [];
  const cursorLinks = [];

  const particleAmount = 55;
  const backgroundConnectionDistance = 145;

  const mouseConnectionDistance = 260;
  const maxCursorLinks = 8;

  const stretchBreakSpeed = 32;
  const maxStretchDistance = 180;

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

  function getDistance(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;

    return Math.sqrt(dx * dx + dy * dy);
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

  function updateCursorLinks() {
    if (!mouseActive) return;

    const nearestParticles = particles
      .map((particle) => {
        return {
          particle,
          distance: getDistance(mouseX, mouseY, particle.x, particle.y)
        };
      })
      .filter((item) => item.distance < mouseConnectionDistance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, maxCursorLinks);

    nearestParticles.forEach((item) => {
      let link = cursorLinks.find((cursorLink) => {
        return cursorLink.particle === item.particle;
      });

      if (!link) {
        cursorLinks.push({
          particle: item.particle,
          anchorX: mouseX,
          anchorY: mouseY,
          opacity: 0,
          broken: false,
          breakLife: 0,
          stretch: 0
        });

        return;
      }

      if (!link.broken) {
        link.opacity += (1 - link.opacity) * 0.12;

        const stretchDistance = getDistance(mouseX, mouseY, link.anchorX, link.anchorY);
        link.stretch = stretchDistance;

        if (stretchDistance > maxStretchDistance || mouseSpeed > stretchBreakSpeed) {
          link.broken = true;
          link.breakLife = 1;
        }
      }
    });

    for (let i = cursorLinks.length - 1; i >= 0; i--) {
      const link = cursorLinks[i];

      const stillNear = nearestParticles.some((item) => {
        return item.particle === link.particle;
      });

      if (!stillNear && !link.broken) {
        link.opacity -= 0.04;
      }

      if (link.broken) {
        link.breakLife -= 0.06;
        link.opacity -= 0.08;
      }

      if (link.opacity <= 0 || link.breakLife < -0.2) {
        cursorLinks.splice(i, 1);
      }
    }
  }

  function updateMousePosition(event) {
    lastMouseX = mouseX;
    lastMouseY = mouseY;

    mouseX = event.clientX;
    mouseY = event.clientY;

    mouseSpeed = getDistance(mouseX, mouseY, lastMouseX, lastMouseY);
    mouseActive = true;
  }

  window.addEventListener('mousemove', updateMousePosition);
  window.addEventListener('pointermove', updateMousePosition);

  document.addEventListener('mouseleave', () => {
    mouseActive = false;
    cursorLinks.length = 0;
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
      const particle = link.particle;

      const startX = link.anchorX;
      const startY = link.anchorY;

      const endX = particle.x;
      const endY = particle.y;

      if (!link.broken) {
        const stretchOpacity = Math.max(0.15, 1 - link.stretch / maxStretchDistance);
        const opacity = link.opacity * stretchOpacity * 0.55;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(255, 80, 80, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(startX, startY, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 110, 110, ${opacity})`;
        ctx.fill();

        return;
      }

      const middleX = (startX + endX) / 2;
      const middleY = (startY + endY) / 2;

      const gap = 18 + (1 - link.breakLife) * 34;

      const angle = Math.atan2(endY - startY, endX - startX);
      const gapX = Math.cos(angle) * gap;
      const gapY = Math.sin(angle) * gap;

      const opacity = Math.max(0, link.breakLife) * 0.5;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(middleX - gapX, middleY - gapY);
      ctx.strokeStyle = `rgba(255, 95, 95, ${opacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(middleX + gapX, middleY + gapY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = `rgba(255, 95, 95, ${opacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(middleX, middleY, 2 + (1 - link.breakLife) * 5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 50, 50, ${opacity * 0.35})`;
      ctx.fill();
    });

    if (mouseActive) {
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 120, 120, 0.9)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 14, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 35, 35, 0.08)';
      ctx.fill();
    }
  }

  function animateConstellation() {
    ctx.clearRect(0, 0, width, height);

    mouseSpeed *= 0.88;

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
