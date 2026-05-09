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

// Constelação elegante conectando no cursor
const constellationCanvas = document.getElementById('constellationCanvas');

if (constellationCanvas) {
  const ctx = constellationCanvas.getContext('2d');

  let width = window.innerWidth;
  let height = window.innerHeight;
  let pixelRatio = window.devicePixelRatio || 1;

  let mouseX = width / 2;
  let mouseY = height / 2;
  let smoothMouseX = mouseX;
  let smoothMouseY = mouseY;

  let lastMouseX = mouseX;
  let lastMouseY = mouseY;
  let mouseSpeed = 0;
  let mouseActive = false;

  const particles = [];
  const cursorLinks = [];

  const particleAmount = 48;
  const backgroundConnectionDistance = 140;

  const cursorConnectionDistance = 280;
  const maxCursorConnections = 5;

  const breakSpeed = 38;
  const maxStretch = 165;

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
      vx: randomBetween(-0.08, 0.08),
      vy: randomBetween(-0.08, 0.08),
      size: randomBetween(1, 1.7),
      opacity: randomBetween(0.25, 0.58)
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

  function updateCursorLinks() {
    if (!mouseActive) return;

    const nearestParticles = particles
      .map((particle) => {
        return {
          particle,
          distance: getDistance(smoothMouseX, smoothMouseY, particle.x, particle.y)
        };
      })
      .filter((item) => item.distance < cursorConnectionDistance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, maxCursorConnections);

    nearestParticles.forEach((item) => {
      let link = cursorLinks.find((cursorLink) => {
        return cursorLink.particle === item.particle;
      });

      if (!link) {
        cursorLinks.push({
          particle: item.particle,
          anchorX: smoothMouseX,
          anchorY: smoothMouseY,
          opacity: 0,
          breaking: false
        });

        return;
      }

      if (!link.breaking) {
        link.opacity += (1 - link.opacity) * 0.12;

        const stretch = getDistance(smoothMouseX, smoothMouseY, link.anchorX, link.anchorY);

        if (stretch > maxStretch || mouseSpeed > breakSpeed) {
          link.breaking = true;
        }
      }
    });

    for (let i = cursorLinks.length - 1; i >= 0; i--) {
      const link = cursorLinks[i];

      const stillNear = nearestParticles.some((item) => {
        return item.particle === link.particle;
      });

      if (!stillNear && !link.breaking) {
        link.opacity -= 0.045;
      }

      if (link.breaking) {
        link.opacity -= 0.18;
      }

      if (link.opacity <= 0) {
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
          const opacity = (1 - distance / backgroundConnectionDistance) * 0.065;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 70, 70, ${opacity})`;
          ctx.lineWidth = 0.75;
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
      ctx.arc(particle.x, particle.y, particle.size * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 35, 35, ${particle.opacity * 0.05})`;
      ctx.fill();
    });
  }

  function drawCursorLinks() {
    cursorLinks.forEach((link) => {
      const particle = link.particle;

      const stretch = getDistance(smoothMouseX, smoothMouseY, link.anchorX, link.anchorY);
      const stretchOpacity = Math.max(0.15, 1 - stretch / maxStretch);

      const opacity = link.opacity * stretchOpacity * 0.42;

      if (opacity <= 0) return;

      ctx.beginPath();
      ctx.moveTo(smoothMouseX, smoothMouseY);
      ctx.lineTo(particle.x, particle.y);
      ctx.strokeStyle = `rgba(255, 85, 85, ${opacity})`;
      ctx.lineWidth = 0.95;
      ctx.stroke();
    });

    if (mouseActive) {
      ctx.beginPath();
      ctx.arc(smoothMouseX, smoothMouseY, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 115, 115, 0.7)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(smoothMouseX, smoothMouseY, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 45, 45, 0.055)';
      ctx.fill();
    }
  }

  function animateConstellation() {
    ctx.clearRect(0, 0, width, height);

    smoothMouseX += (mouseX - smoothMouseX) * 0.18;
    smoothMouseY += (mouseY - smoothMouseY) * 0.18;

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
