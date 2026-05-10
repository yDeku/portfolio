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

// Menu mobile
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', (event) => {
    event.stopPropagation();

    navLinks.classList.toggle('active');
    menuBtn.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuBtn.classList.remove('active');
    });
  });

  document.addEventListener('click', (event) => {
    const clickedInsideMenu = navLinks.contains(event.target);
    const clickedButton = menuBtn.contains(event.target);

    if (!clickedInsideMenu && !clickedButton) {
      navLinks.classList.remove('active');
      menuBtn.classList.remove('active');
    }
  });
}

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

// Carrossel infinito com drag no celular e mouse
const carouselTrack = document.getElementById('carouselTrack');
const carouselWindow = document.getElementById('carouselWindow');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');
const projectsCarousel = document.getElementById('projectsCarousel');

let carouselIndex = 0;
let carouselTimer = null;
let slideStep = 0;
let originalSlidesCount = 0;
let carouselReady = false;
let isTransitioning = false;

let isDragging = false;
let dragStartX = 0;
let dragCurrentX = 0;
let dragDeltaX = 0;
let dragStartTranslate = 0;
let pointerId = null;

function escapeHTML(text) {
  return String(text || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getProjectInitials(title) {
  return String(title || 'PR')
    .split(' ')
    .filter((word) => word.length > 0)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

function renderProjectsFromAdmin() {
  if (!carouselTrack) return;

  if (typeof getPortfolioProjects !== 'function') {
    console.warn('projects-data.js não foi carregado antes do script.js');
    return;
  }

  const projects = getPortfolioProjects();

  if (!Array.isArray(projects) || projects.length === 0) {
    return;
  }

  carouselTrack.innerHTML = '';

  projects.forEach((project) => {
    const slide = document.createElement('article');
    slide.className = 'carousel-slide';

    const tagsHTML = Array.isArray(project.tags)
      ? project.tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join('')
      : '';

    const imageHTML = project.image
      ? `<img src="${escapeHTML(project.image)}" alt="${escapeHTML(project.title)}">`
      : `<span>${escapeHTML(getProjectInitials(project.title))}</span>`;

    const link = project.link && project.link.trim() !== '' ? project.link : '#';

    slide.innerHTML = `
      <div class="project-card">
        <div class="project-image">
          ${imageHTML}
        </div>

        <div class="project-content">
          <div class="project-tags">
            ${tagsHTML}
          </div>

          <h3>${escapeHTML(project.title)}</h3>

          <p>${escapeHTML(project.description)}</p>

          <a href="${escapeHTML(link)}" class="project-link" ${link !== '#' ? 'target="_blank" rel="noopener noreferrer"' : ''}>
            Ver projeto
          </a>
        </div>
      </div>
    `;

    carouselTrack.appendChild(slide);
  });
}

function resetCarouselState() {
  carouselIndex = 0;
  carouselTimer = null;
  slideStep = 0;
  originalSlidesCount = 0;
  carouselReady = false;
  isTransitioning = false;

  isDragging = false;
  dragStartX = 0;
  dragCurrentX = 0;
  dragDeltaX = 0;
  dragStartTranslate = 0;
  pointerId = null;
}

function setupCarousel() {
  if (!carouselTrack || carouselReady) return;

  const originalSlides = Array.from(carouselTrack.querySelectorAll('.carousel-slide'));
  originalSlidesCount = originalSlides.length;

  if (originalSlidesCount <= 1) return;

  const firstClone = originalSlides[0].cloneNode(true);
  const secondClone = originalSlides[1].cloneNode(true);
  const lastClone = originalSlides[originalSlidesCount - 1].cloneNode(true);
  const beforeLastClone = originalSlides[originalSlidesCount - 2].cloneNode(true);

  firstClone.classList.add('carousel-clone');
  secondClone.classList.add('carousel-clone');
  lastClone.classList.add('carousel-clone');
  beforeLastClone.classList.add('carousel-clone');

  carouselTrack.insertBefore(beforeLastClone, originalSlides[0]);
  carouselTrack.insertBefore(lastClone, originalSlides[0]);
  carouselTrack.appendChild(firstClone);
  carouselTrack.appendChild(secondClone);

  carouselIndex = 2;
  carouselReady = true;

  updateSlideStep();
  updateActiveSlide();
  moveCarousel(false);
  startCarousel();
}

function updateSlideStep() {
  if (!carouselTrack) return;

  const firstSlide = carouselTrack.querySelector('.carousel-slide');
  if (!firstSlide) return;

  const trackStyle = window.getComputedStyle(carouselTrack);
  const gap = parseFloat(trackStyle.columnGap || trackStyle.gap || 0);

  slideStep = firstSlide.offsetWidth + gap;
}

function getCenterOffset() {
  if (!carouselTrack || !carouselWindow) return 0;

  const firstSlide = carouselTrack.querySelector('.carousel-slide');
  if (!firstSlide) return 0;

  const windowWidth = carouselWindow.offsetWidth;
  const slideWidth = firstSlide.offsetWidth;

  return (windowWidth - slideWidth) / 2;
}

function getCarouselPosition(index = carouselIndex) {
  const centerOffset = getCenterOffset();

  return index * slideStep - centerOffset;
}

function setCarouselTranslate(position, animated = true) {
  if (!carouselTrack) return;

  carouselTrack.style.transition = animated
    ? 'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)'
    : 'none';

  carouselTrack.style.transform = `translateX(-${position}px)`;
}

function moveCarousel(animated = true) {
  if (!carouselTrack) return;

  const position = getCarouselPosition();
  setCarouselTranslate(position, animated);
}

function updateActiveSlide() {
  if (!carouselTrack) return;

  const slides = carouselTrack.querySelectorAll('.carousel-slide');

  slides.forEach((slide) => {
    slide.classList.remove('is-active');
  });

  if (slides[carouselIndex]) {
    slides[carouselIndex].classList.add('is-active');
  }
}

function normalizeCarouselAfterTransition() {
  if (!carouselReady) return;

  if (carouselIndex >= originalSlidesCount + 2) {
    carouselIndex = 2;
    updateActiveSlide();
    moveCarousel(false);
  }

  if (carouselIndex <= 1) {
    carouselIndex = originalSlidesCount + 1;
    updateActiveSlide();
    moveCarousel(false);
  }
}

function nextCarousel() {
  if (!carouselReady || isTransitioning || isDragging) return;

  isTransitioning = true;
  carouselIndex++;

  updateActiveSlide();
  moveCarousel(true);
}

function prevCarousel() {
  if (!carouselReady || isTransitioning || isDragging) return;

  isTransitioning = true;
  carouselIndex--;

  updateActiveSlide();
  moveCarousel(true);
}

function startCarousel() {
  stopCarousel();

  carouselTimer = setInterval(() => {
    nextCarousel();
  }, 4300);
}

function stopCarousel() {
  if (carouselTimer) {
    clearInterval(carouselTimer);
    carouselTimer = null;
  }
}

function onCarouselPointerDown(event) {
  if (!carouselReady || !carouselWindow) return;

  isDragging = true;
  isTransitioning = false;
  pointerId = event.pointerId;

  stopCarousel();

  dragStartX = event.clientX;
  dragCurrentX = event.clientX;
  dragDeltaX = 0;
  dragStartTranslate = getCarouselPosition();

  carouselWindow.classList.add('dragging');
  carouselWindow.setPointerCapture(pointerId);

  setCarouselTranslate(dragStartTranslate, false);
}

function onCarouselPointerMove(event) {
  if (!isDragging || event.pointerId !== pointerId) return;

  dragCurrentX = event.clientX;
  dragDeltaX = dragCurrentX - dragStartX;

  const resistance = 0.92;
  const nextPosition = dragStartTranslate - dragDeltaX * resistance;

  setCarouselTranslate(nextPosition, false);
}

function onCarouselPointerUp(event) {
  if (!isDragging || event.pointerId !== pointerId) return;

  isDragging = false;

  if (carouselWindow) {
    carouselWindow.classList.remove('dragging');

    try {
      carouselWindow.releasePointerCapture(pointerId);
    } catch (error) {}
  }

  const dragLimit = Math.min(95, slideStep * 0.25);

  if (dragDeltaX < -dragLimit) {
    isTransitioning = true;
    carouselIndex++;
  } else if (dragDeltaX > dragLimit) {
    isTransitioning = true;
    carouselIndex--;
  }

  updateActiveSlide();
  moveCarousel(true);

  dragStartX = 0;
  dragCurrentX = 0;
  dragDeltaX = 0;
  pointerId = null;

  startCarousel();
}

function onCarouselPointerCancel() {
  if (!isDragging) return;

  isDragging = false;

  if (carouselWindow) {
    carouselWindow.classList.remove('dragging');
  }

  updateActiveSlide();
  moveCarousel(true);
  startCarousel();
}

if (carouselTrack && carouselWindow && carouselPrev && carouselNext) {
  window.addEventListener('load', () => {
    resetCarouselState();
    renderProjectsFromAdmin();
    setupCarousel();
    updateSlideStep();
    moveCarousel(false);
  });

  carouselTrack.addEventListener('transitionend', () => {
    isTransitioning = false;
    normalizeCarouselAfterTransition();
  });

  carouselNext.addEventListener('click', () => {
    nextCarousel();
    startCarousel();
  });

  carouselPrev.addEventListener('click', () => {
    prevCarousel();
    startCarousel();
  });

  carouselWindow.addEventListener('pointerdown', onCarouselPointerDown);
  carouselWindow.addEventListener('pointermove', onCarouselPointerMove);
  carouselWindow.addEventListener('pointerup', onCarouselPointerUp);
  carouselWindow.addEventListener('pointercancel', onCarouselPointerCancel);
  carouselWindow.addEventListener('lostpointercapture', onCarouselPointerCancel);

  if (projectsCarousel) {
    projectsCarousel.addEventListener('mouseenter', stopCarousel);
    projectsCarousel.addEventListener('mouseleave', startCarousel);
  }

  window.addEventListener('resize', () => {
    updateSlideStep();
    moveCarousel(false);
  });
}

// Discord copiar
const discord = document.getElementById('discord');

if (discord) {
  discord.addEventListener('click', () => {
    navigator.clipboard.writeText('anakinsky01');

    const feedback = discord.querySelector('.contact-action');

    if (feedback) {
      feedback.textContent = 'copied';

      setTimeout(() => {
        feedback.textContent = 'copy';
      }, 1500);
    }
  });
}

// YouTube abrir
const youtube = document.getElementById('youtube');

if (youtube) {
  youtube.addEventListener('click', () => {
    window.open('https://www.youtube.com/@ydekuh', '_blank');
  });
}
