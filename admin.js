const ADMIN_PASSWORD = "admin123";

const STORAGE_KEYS = {
  logged: "ydeku_admin_logged"
};

const loginScreen = document.getElementById("loginScreen");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("passwordInput");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");
const loginCard = document.getElementById("loginCard");
const mouseLight = document.getElementById("mouseLight");

const projectForm = document.getElementById("projectForm");
const projectId = document.getElementById("projectId");
const projectTitle = document.getElementById("projectTitle");
const projectDescription = document.getElementById("projectDescription");
const projectImage = document.getElementById("projectImage");
const projectImageFile = document.getElementById("projectImageFile");
const chooseImageBtn = document.getElementById("chooseImageBtn");
const clearImageBtn = document.getElementById("clearImageBtn");
const imagePreview = document.getElementById("imagePreview");
const projectLink = document.getElementById("projectLink");
const projectTags = document.getElementById("projectTags");

const formTitle = document.getElementById("formTitle");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const projectList = document.getElementById("projectList");
const emptyState = document.getElementById("emptyState");

const exportBtn = document.getElementById("exportBtn");
const clearBtn = document.getElementById("clearBtn");
const exportOutput = document.getElementById("exportOutput");

let selectedImageData = "";

function generateId() {
  return "project-" + Date.now() + "-" + Math.floor(Math.random() * 999999);
}

function showToast(message) {
  let toast = document.querySelector(".save-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "save-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function getProjects() {
  if (typeof getPortfolioProjects !== "function") {
    console.error("getPortfolioProjects não foi encontrado. Verifique projects-data.js.");
    return [];
  }

  return getPortfolioProjects();
}

function saveProjects(projects) {
  if (typeof savePortfolioProjects !== "function") {
    console.error("savePortfolioProjects não foi encontrado. Verifique projects-data.js.");
    return;
  }

  savePortfolioProjects(projects);
}

/* EFEITO LUZ NO FUNDO */

function setupMouseLight() {
  if (!mouseLight) return;

  window.addEventListener("pointermove", (event) => {
    document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
  });
}

/* EFEITO CARD 3D */

function setupTiltCards() {
  const cards = document.querySelectorAll(".tilt-card, .project-item");

  cards.forEach((card) => {
    if (card.dataset.tiltReady === "true") return;

    card.dataset.tiltReady = "true";

    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      const glowX = (x / rect.width) * 100;
      const glowY = (y / rect.height) * 100;

      card.style.setProperty("--glow-x", `${glowX}%`);
      card.style.setProperty("--glow-y", `${glowY}%`);

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(1.018)
      `;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    });
  });
}

function shakeLoginCard() {
  if (!loginCard) return;

  loginCard.classList.remove("shake");

  void loginCard.offsetWidth;

  loginCard.classList.add("shake");

  setTimeout(() => {
    loginCard.classList.remove("shake");
  }, 450);
}

/* LOGIN */

function checkLogin() {
  const isLogged = localStorage.getItem(STORAGE_KEYS.logged) === "true";

  if (isLogged) {
    showDashboard();
  } else {
    showLogin();
  }
}

function showDashboard() {
  loginScreen.classList.add("hidden");
  dashboard.classList.remove("hidden");

  dashboard.classList.remove("dashboard-ready");

  renderProjects();

  setTimeout(() => {
    dashboard.classList.add("dashboard-ready");
    setupTiltCards();
  }, 80);
}

function showLogin() {
  dashboard.classList.add("hidden");
  dashboard.classList.remove("dashboard-ready");
  loginScreen.classList.remove("hidden");

  setTimeout(() => {
    setupTiltCards();
  }, 80);
}

function handleLogin(event) {
  event.preventDefault();

  const password = passwordInput.value.trim();

  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(STORAGE_KEYS.logged, "true");
    loginError.classList.remove("show");
    passwordInput.value = "";
    showDashboard();
    return;
  }

  loginError.classList.add("show");
  shakeLoginCard();
}

function handleLogout() {
  localStorage.removeItem(STORAGE_KEYS.logged);
  showLogin();
}

/* IMAGEM */

function setImagePreview(imageValue) {
  if (!imagePreview) return;

  if (!imageValue) {
    imagePreview.classList.add("empty");
    imagePreview.innerHTML = "<span>Nenhuma imagem selecionada</span>";
    return;
  }

  imagePreview.classList.remove("empty");
  imagePreview.innerHTML = `
    <img src="${imageValue}" alt="Preview da imagem">
  `;
}

function clearSelectedImage() {
  selectedImageData = "";
  projectImage.value = "";

  if (projectImageFile) {
    projectImageFile.value = "";
  }

  setImagePreview("");
}

function resetForm() {
  projectId.value = "";
  projectTitle.value = "";
  projectDescription.value = "";
  projectImage.value = "";
  projectLink.value = "";
  projectTags.value = "";
  selectedImageData = "";

  if (projectImageFile) {
    projectImageFile.value = "";
  }

  setImagePreview("");

  formTitle.textContent = "Adicionar projeto";
  cancelEditBtn.classList.remove("show");
}

function formatTags(text) {
  return text
    .split(",")
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
}

function handleImageFileChange() {
  const file = projectImageFile.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Escolha um arquivo de imagem válido.");
    projectImageFile.value = "";
    return;
  }

  const maxSizeMB = 3;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    alert(`Essa imagem é muito pesada. Escolha uma imagem com até ${maxSizeMB}MB.`);
    projectImageFile.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    selectedImageData = reader.result;
    projectImage.value = selectedImageData;
    setImagePreview(selectedImageData);
    showToast("Imagem carregada!");
  };

  reader.onerror = () => {
    alert("Não foi possível carregar essa imagem.");
  };

  reader.readAsDataURL(file);
}

/* PROJETOS */

function handleProjectSubmit(event) {
  event.preventDefault();

  const title = projectTitle.value.trim();
  const description = projectDescription.value.trim();
  const image = selectedImageData || projectImage.value.trim();
  const link = projectLink.value.trim();
  const tags = formatTags(projectTags.value);
  const editingId = projectId.value;

  if (!title || !description) {
    alert("Preencha pelo menos o título e a descrição.");
    return;
  }

  let projects = getProjects();

  const projectData = {
    id: editingId || generateId(),
    title,
    description,
    image,
    link,
    tags
  };

  if (editingId) {
    projects = projects.map(project => {
      if (project.id === editingId) {
        return projectData;
      }

      return project;
    });
  } else {
    projects.unshift(projectData);
  }

  saveProjects(projects);
  resetForm();
  renderProjects();
  setupTiltCards();

  showToast(editingId ? "Projeto editado e salvo!" : "Projeto criado e salvo!");
}

function renderProjects() {
  const projects = getProjects();

  projectList.innerHTML = "";

  if (projects.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  projects.forEach((project, index) => {
    const item = document.createElement("article");
    item.className = "project-item";

    const glow = document.createElement("div");
    glow.className = "card-glow";
    item.appendChild(glow);

    const thumb = document.createElement("div");
    thumb.className = "project-thumb";

    if (project.image) {
      const img = document.createElement("img");
      img.src = project.image;
      img.alt = project.title;

      img.onerror = () => {
        thumb.innerHTML = "";
        thumb.textContent = getInitials(project.title);
      };

      thumb.appendChild(img);
    } else {
      thumb.textContent = getInitials(project.title);
    }

    const info = document.createElement("div");
    info.className = "project-info";

    const title = document.createElement("h3");
    title.textContent = project.title;

    const description = document.createElement("p");
    description.textContent = project.description;

    const tagsBox = document.createElement("div");
    tagsBox.className = "tags";

    if (project.tags && project.tags.length > 0) {
      project.tags.forEach(tagText => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = tagText;
        tagsBox.appendChild(tag);
      });
    }

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const editButton = document.createElement("button");
    editButton.className = "card-btn edit-btn";
    editButton.type = "button";
    editButton.textContent = "Editar";
    editButton.addEventListener("click", () => editProject(project.id));

    const deleteButton = document.createElement("button");
    deleteButton.className = "card-btn delete-btn";
    deleteButton.type = "button";
    deleteButton.textContent = "Excluir";
    deleteButton.addEventListener("click", () => deleteProject(project.id));

    const upButton = document.createElement("button");
    upButton.className = "card-btn move-btn";
    upButton.type = "button";
    upButton.textContent = "↑";
    upButton.disabled = index === 0;
    upButton.addEventListener("click", () => moveProject(index, index - 1));

    const downButton = document.createElement("button");
    downButton.className = "card-btn move-btn";
    downButton.type = "button";
    downButton.textContent = "↓";
    downButton.disabled = index === projects.length - 1;
    downButton.addEventListener("click", () => moveProject(index, index + 1));

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
    actions.appendChild(upButton);
    actions.appendChild(downButton);

    info.appendChild(title);
    info.appendChild(description);
    info.appendChild(tagsBox);
    info.appendChild(actions);

    item.appendChild(thumb);
    item.appendChild(info);

    projectList.appendChild(item);
  });

  setupTiltCards();
}

function getInitials(text) {
  return text
    .split(" ")
    .filter(word => word.length > 0)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join("");
}

function editProject(id) {
  const projects = getProjects();
  const project = projects.find(item => item.id === id);

  if (!project) return;

  const image = project.image || "";

  projectId.value = project.id;
  projectTitle.value = project.title;
  projectDescription.value = project.description;
  projectImage.value = image;
  selectedImageData = image;
  projectLink.value = project.link || "";
  projectTags.value = project.tags ? project.tags.join(", ") : "";

  setImagePreview(image);

  formTitle.textContent = "Editar projeto";
  cancelEditBtn.classList.add("show");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function deleteProject(id) {
  const confirmDelete = confirm("Tem certeza que deseja excluir este projeto?");

  if (!confirmDelete) return;

  const projects = getProjects();
  const filtered = projects.filter(project => project.id !== id);

  saveProjects(filtered);
  renderProjects();
  resetForm();
  showToast("Projeto excluído!");
}

function moveProject(fromIndex, toIndex) {
  const projects = getProjects();

  if (toIndex < 0 || toIndex >= projects.length) return;

  const item = projects.splice(fromIndex, 1)[0];
  projects.splice(toIndex, 0, item);

  saveProjects(projects);
  renderProjects();
  showToast("Ordem atualizada!");
}

/* CONFIG */

function exportProjects() {
  const projects = getProjects();
  const data = JSON.stringify(projects, null, 2);

  exportOutput.value = data;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(data).then(() => {
      showToast("Dados copiados!");
    });
  } else {
    showToast("Copie os dados manualmente.");
  }
}

function clearProjects() {
  const confirmClear = confirm("Isso vai resetar os projetos para o padrão. Continuar?");

  if (!confirmClear) return;

  if (typeof DEFAULT_PROJECTS === "undefined") {
    saveProjects([]);
  } else {
    saveProjects(DEFAULT_PROJECTS);
  }

  exportOutput.value = "";
  resetForm();
  renderProjects();
  showToast("Projetos resetados!");
}

/* EVENTOS */

loginForm.addEventListener("submit", handleLogin);
logoutBtn.addEventListener("click", handleLogout);
projectForm.addEventListener("submit", handleProjectSubmit);
cancelEditBtn.addEventListener("click", resetForm);
exportBtn.addEventListener("click", exportProjects);
clearBtn.addEventListener("click", clearProjects);

if (chooseImageBtn && projectImageFile) {
  chooseImageBtn.addEventListener("click", () => {
    projectImageFile.click();
  });

  projectImageFile.addEventListener("change", handleImageFileChange);
}

if (clearImageBtn) {
  clearImageBtn.addEventListener("click", clearSelectedImage);
}

if (projectImage) {
  projectImage.addEventListener("input", () => {
    selectedImageData = "";

    const imageValue = projectImage.value.trim();
    setImagePreview(imageValue);
  });
}

setupMouseLight();
checkLogin();
setImagePreview("");
setupTiltCards();
