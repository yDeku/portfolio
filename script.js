// Reveal suave com delay
const revealElements = document.querySelectorAll(".reveal");

function setupRevealDelays() {
  revealElements.forEach((element) => {
    const parent = element.parentElement;
    const siblings = parent ? Array.from(parent.querySelectorAll(".reveal")) : [];

    const localIndex = siblings.indexOf(element);
    const delay = Math.min(localIndex * 90, 360);

    element.style.setProperty("--reveal-delay", `${delay}ms`);
  });
}

function revealOnScroll() {
  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementTop < windowHeight - 80) {
      element.classList.add("active");
    }
  });
}

setupRevealDelays();
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// Menu mobile
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuBtn.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });

  document.addEventListener("click", (event) => {
    const clickedMenu = navLinks.contains(event.target);
    const clickedButton = menuBtn.contains(event.target);

    if (!clickedMenu && !clickedButton) {
      menuBtn.classList.remove("active");
      navLinks.classList.remove("active");
    }
  });
}

// Constelação clean conectando no cursor
const constellationCanvas = document.getElementById("constellationCanvas");

if (constellationCanvas) {
  const ctx = constellationCanvas.getContext("2d");

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

  const isMobile = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const particleAmount = isMobile ? 24 : 50;
  const backgroundConnectionDistance = isMobile ? 115 : 150;
  const cursorConnectionDistance = isMobile ? 0 : 260;
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

  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });

  function updateMousePosition(event) {
    if (isMobile) return;

    mouseX = event.clientX;
    mouseY = event.clientY;
    mouseActive = true;
    cursorOpacity = 1;
    lastMouseMoveTime = performance.now();
  }

  window.addEventListener("mousemove", updateMousePosition);

  document.addEventListener("mouseleave", () => {
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
    if (isMobile) return;

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
    if (isMobile || !mouseActive || cursorOpacity <= 0) return;

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

// Projetos + modal de detalhes
const projectsGrid = document.getElementById("projectsGrid");
const projectModal = document.getElementById("projectModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalImage = document.getElementById("modalImage");
const modalStatus = document.getElementById("modalStatus");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalTags = document.getElementById("modalTags");
const modalDetailsText = document.getElementById("modalDetailsText");
const modalFeatures = document.getElementById("modalFeatures");
const modalLink = document.getElementById("modalLink");

function escapeHTML(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getProjectInitials(title) {
  return String(title || "PR")
    .split(" ")
    .filter((word) => word.length > 0)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function getProjectsFromData() {
  if (typeof getPortfolioProjects !== "function") {
    console.warn("projects-data.js não foi carregado.");
    return [];
  }

  return getPortfolioProjects();
}

function renderProjects() {
  if (!projectsGrid) return;

  const projects = getProjectsFromData();

  projectsGrid.innerHTML = "";

  projects.forEach((project, index) => {
    const card = document.createElement("article");

    // Não coloca "reveal" aqui, porque esses cards são criados depois pelo JS.
    card.className = "project-card project-card-ready";
    card.style.animationDelay = `${Math.min(index * 90, 360)}ms`;
    card.tabIndex = 0;

    const tagsHTML = Array.isArray(project.tags)
      ? project.tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join("")
      : "";

    const imageHTML = project.image
      ? `<img src="${escapeHTML(project.image)}" alt="${escapeHTML(project.title)}">`
      : `<span>${escapeHTML(getProjectInitials(project.title))}</span>`;

    card.innerHTML = `
      <div class="project-image">
        ${imageHTML}
      </div>

      <div class="project-content">
        <div class="project-tags">
          ${tagsHTML}
        </div>

        <h3>${escapeHTML(project.title)}</h3>
        <p>${escapeHTML(project.description)}</p>

        <div class="project-action">
          Ver detalhes
        </div>
      </div>
    `;

    card.addEventListener("click", () => openProjectModal(project));

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        openProjectModal(project);
      }
    });

    projectsGrid.appendChild(card);
  });

  revealOnScroll();
}

function openProjectModal(project) {
  if (!projectModal) return;

  const imageHTML = project.image
    ? `<img src="${escapeHTML(project.image)}" alt="${escapeHTML(project.title)}">`
    : `<span>${escapeHTML(getProjectInitials(project.title))}</span>`;

  const tagsHTML = Array.isArray(project.tags)
    ? project.tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join("")
    : "";

  const features = Array.isArray(project.features) && project.features.length > 0
    ? project.features
    : ["Template editável", "Card personalizável", "Detalhes do projeto"];

  const featuresHTML = features
    .map((feature) => `<span>${escapeHTML(feature)}</span>`)
    .join("");

  modalImage.innerHTML = imageHTML;
  modalStatus.textContent = project.status || "Projeto";
  modalTitle.textContent = project.title || "Projeto";
  modalDescription.textContent = project.description || "Descrição do projeto.";
  modalTags.innerHTML = tagsHTML;
  modalDetailsText.textContent = project.details || "Use essa área para explicar melhor o projeto, mostrar o objetivo, as mecânicas principais e o que torna esse sistema especial.";
  modalFeatures.innerHTML = featuresHTML;

  if (project.link && project.link.trim() !== "" && project.link !== "#") {
    modalLink.href = project.link;
    modalLink.classList.remove("hidden");
  } else {
    modalLink.href = "#";
    modalLink.classList.add("hidden");
  }

  projectModal.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

function closeProjectModal() {
  if (!projectModal) return;

  projectModal.classList.add("hidden");
  document.body.classList.remove("modal-open");
}

if (modalBackdrop) {
  modalBackdrop.addEventListener("click", closeProjectModal);
}

if (modalClose) {
  modalClose.addEventListener("click", closeProjectModal);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProjectModal();
  }
});

renderProjects();

// Discord copiar
const discord = document.getElementById("discord");

if (discord) {
  discord.addEventListener("click", () => {
    navigator.clipboard.writeText("anakinsky01");

    const feedback = discord.querySelector(".contact-action");
    feedback.textContent = "copiado";

    setTimeout(() => {
      feedback.textContent = "copiar";
    }, 1500);
  });
}

// YouTube abrir
const youtube = document.getElementById("youtube");

if (youtube) {
  youtube.addEventListener("click", () => {
    window.open("https://www.youtube.com/@ydekuh", "_blank");
  });
}
