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

// Constelação clean conectando no cursor
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

  let mouseActive = false;
  let cursorOpacity = 0;
  let lastMouseMoveTime = 0;

  const particles = [];

  const particleAmount = 50;
  const backgroundConnectionDistance = 150;
  const cursorConnectionDistance = 260;
  const maxCursorConnections = 4;

  const cursorHideDelay = 500;

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
      vx: randomBetween(-0.07, 0.07),
      vy: randomBetween(-0.07, 0.07),
      size: randomBetween(1, 1.7),
      opacity: randomBetween(0.22, 0.52)
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
    cursorOpacity = 1;
    lastMouseMoveTime = performance.now();
  }

  window.addEventListener('mousemove', updateMousePosition);
  window.addEventListener('pointermove', updateMousePosition);

  document.addEventListener('mouseleave', () => {
    mouseActive = false;
    cursorOpacity = 0;
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

  function updateCursorFade() {
    const now = performance.now();

    if (now - lastMouseMoveTime > cursorHideDelay) {
      cursorOpacity += (0 - cursorOpacity) * 0.08;

      if (cursorOpacity < 0.01) {
        cursorOpacity = 0;
        mouseActive = false;
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
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }
  }

  function drawCursorConnections() {
    if (!mouseActive || cursorOpacity <= 0) return;

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
      const particle = item.particle;
      const distanceOpacity = 1 - item.distance / cursorConnectionDistance;
      const opacity = distanceOpacity * 0.34 * cursorOpacity;

      ctx.beginPath();
      ctx.moveTo(smoothMouseX, smoothMouseY);
      ctx.lineTo(particle.x, particle.y);
      ctx.strokeStyle = `rgba(255, 85, 85, ${opacity})`;
      ctx.lineWidth = 0.9;
      ctx.stroke();
    });
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

  function animateConstellation() {
    ctx.clearRect(0, 0, width, height);

    smoothMouseX += (mouseX - smoothMouseX) * 0.18;
    smoothMouseY += (mouseY - smoothMouseY) * 0.18;

    updateCursorFade();
    updateParticles();

    drawBackgroundConnections();
    drawParticles();
    drawCursorConnections();

    requestAnimationFrame(animateConstellation);
  }

  animateConstellation();
}

// Carrossel 3D de projetos
const carouselTrack = document.getElementById('carouselTrack');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');
const carouselSlides = document.querySelectorAll('.carousel-slide');
const carouselDots = document.querySelectorAll('.carousel-dot');
const projectsCarousel = document.getElementById('projectsCarousel');

let currentSlide = 0;
let carouselInterval;

function getCarouselSideDistance() {
  if (window.innerWidth <= 768) {
    return 210;
  }

  return 360;
}

function updateCarousel() {
  if (!carouselTrack || carouselSlides.length === 0) return;

  const totalSlides = carouselSlides.length;
  const sideDistance = getCarouselSideDistance();

  carouselSlides.forEach((slide, index) => {
    let offset = index - currentSlide;

    if (offset > totalSlides / 2) {
      offset -= totalSlides;
    }

    if (offset < -totalSlides / 2) {
      offset += totalSlides;
    }

    slide.classList.remove('is-active', 'is-left', 'is-right', 'is-hidden');

    if (offset === 0) {
      slide.classList.add('is-active');
      slide.style.transform = `
        translateX(-50%)
        translateX(0px)
        translateZ(80px)
        rotateY(0deg)
        scale(1)
      `;
    } else if (offset === -1) {
      slide.classList.add('is-left');
      slide.style.transform = `
        translateX(-50%)
        translateX(-${sideDistance}px)
        translateZ(-90px)
        rotateY(18deg)
        scale(0.78)
      `;
    } else if (offset === 1) {
      slide.classList.add('is-right');
      slide.style.transform = `
        translateX(-50%)
        translateX(${sideDistance}px)
        translateZ(-90px)
        rotateY(-18deg)
        scale(0.78)
      `;
    } else {
      slide.classList.add('is-hidden');
      slide.style.transform = `
        translateX(-50%)
        translateX(${offset > 0 ? sideDistance + 120 : -sideDistance - 120}px)
        translateZ(-180px)
        rotateY(${offset > 0 ? -28 : 28}deg)
        scale(0.65)
      `;
    }
  });

  carouselDots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

function goToSlide(index) {
  const totalSlides = carouselSlides.length;

  if (index < 0) {
    currentSlide = totalSlides - 1;
  } else if (index >= totalSlides) {
    currentSlide = 0;
  } else {
    currentSlide = index;
  }

  updateCarousel();
}

function startCarouselAutoplay() {
  stopCarouselAutoplay();

  carouselInterval = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 5200);
}

function stopCarouselAutoplay() {
  if (carouselInterval) {
    clearInterval(carouselInterval);
  }
}

if (carouselTrack && carouselPrev && carouselNext && carouselSlides.length > 0) {
  carouselPrev.addEventListener('click', () => {
    goToSlide(currentSlide - 1);
    startCarouselAutoplay();
  });

  carouselNext.addEventListener('click', () => {
    goToSlide(currentSlide + 1);
    startCarouselAutoplay();
  });

  carouselDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      startCarouselAutoplay();
    });
  });

  if (projectsCarousel) {
    projectsCarousel.addEventListener('mouseenter', stopCarouselAutoplay);
    projectsCarousel.addEventListener('mouseleave', startCarouselAutoplay);
  }

  window.addEventListener('resize', updateCarousel);

  updateCarousel();
  startCarouselAutoplay();
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
