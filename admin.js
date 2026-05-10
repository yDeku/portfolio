const ADMIN_PASSWORD = "admin123";

const STORAGE_KEYS = {
  logged: "ydeku_admin_logged",
  projects: "ydeku_projects",
  initialized: "ydeku_projects_initialized"
};

const loginScreen = document.getElementById("loginScreen");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("passwordInput");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");

const projectForm = document.getElementById("projectForm");
const projectId = document.getElementById("projectId");
const projectTitle = document.getElementById("projectTitle");
const projectDescription = document.getElementById("projectDescription");
const projectImage = document.getElementById("projectImage");
const projectLink = document.getElementById("projectLink");
const projectTags = document.getElementById("projectTags");

const formTitle = document.getElementById("formTitle");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const projectList = document.getElementById("projectList");
const emptyState = document.getElementById("emptyState");

const exportBtn = document.getElementById("exportBtn");
const clearBtn = document.getElementById("clearBtn");
const exportOutput = document.getElementById("exportOutput");

function generateId() {
  if (window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return "id-" + Date.now() + "-" + Math.floor(Math.random() * 999999);
}

function createDefaultProjects() {
  return [
    {
      id: generateId(),
      title: "Parkour Addon",
      description: "Sistema de parkour para Minecraft Bedrock com pendurar em bordas, vault e wall run.",
      image: "",
      link: "",
      tags: ["Minecraft", "Script API", "Molang"]
    },
    {
      id: generateId(),
      title: "Combat System",
      description: "Sistema de combate com combos, animações, efeitos e habilidades para addons.",
      image: "",
      link: "",
      tags: ["Combat", "Addon", "JSON"]
    },
    {
      id: generateId(),
      title: "Portfolio Website",
      description: "Site portfólio profissional para mostrar meus sistemas, projetos e contatos.",
      image: "",
      link: "index.html",
      tags: ["HTML", "CSS", "JavaScript"]
    }
  ];
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
  const savedProjects = localStorage.getItem(STORAGE_KEYS.projects);
  const initialized = localStorage.getItem(STORAGE_KEYS.initialized) === "true";

  if (!savedProjects && !initialized) {
    const defaultProjects = createDefaultProjects();
    saveProjects(defaultProjects);
    localStorage.setItem(STORAGE_KEYS.initialized, "true");
    return defaultProjects;
  }

  if (!savedProjects && initialized) {
    return [];
  }

  try {
    return JSON.parse(savedProjects);
  } catch (error) {
    console.error("Erro ao carregar projetos:", error);
    return [];
  }
}

function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
  localStorage.setItem(STORAGE_KEYS.initialized, "true");
}

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
  renderProjects();
}

function showLogin() {
  dashboard.classList.add("hidden");
  loginScreen.classList.remove("hidden");
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
}

function handleLogout() {
  localStorage.removeItem(STORAGE_KEYS.logged);
  showLogin();
}

function resetForm() {
  projectId.value = "";
  projectTitle.value = "";
  projectDescription.value = "";
  projectImage.value = "";
  projectLink.value = "";
  projectTags.value = "";

  formTitle.textContent = "Adicionar projeto";
  cancelEditBtn.classList.remove("show");
}

function formatTags(tagsText) {
  return tagsText
    .split(",")
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
}

function handleProjectSubmit(event) {
  event.preventDefault();

  const projects = getProjects();
  const editingId = projectId.value;

  const projectData = {
    id: editingId || generateId(),
    title: projectTitle.value.trim(),
    description: projectDescription.value.trim(),
    image: projectImage.value.trim(),
    link: projectLink.value.trim(),
    tags: formatTags(projectTags.value)
  };

  if (!projectData.title || !projectData.description) {
    alert("Preencha pelo menos o título e a descrição.");
    return;
  }

  if (editingId) {
    const updatedProjects = projects.map(project => {
      if (project.id === editingId) {
        return projectData;
      }

      return project;
    });

    saveProjects(updatedProjects);
    showToast("Projeto editado e salvo!");
  } else {
    projects.unshift(projectData);
    saveProjects(projects);
    showToast("Projeto adicionado e salvo!");
  }

  resetForm();
  renderProjects();
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

    const thumb = createProjectThumb(project);

    const info = document.createElement("div");
    info.className = "project-info";

    const title = document.createElement("h3");
    title.textContent = project.title;

    const description = document.createElement("p");
    description.textContent = project.description;

    const tags = document.createElement("div");
    tags.className = "tags";

    if (project.tags && project.tags.length > 0) {
      project.tags.forEach(tagText => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = tagText;
        tags.appendChild(tag);
      });
    }

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const editButton = document.createElement("button");
    editButton.className = "card-btn edit-btn";
    editButton.textContent = "Editar";
    editButton.addEventListener("click", () => editProject(project.id));

    const deleteButton = document.createElement("button");
    deleteButton.className = "card-btn delete-btn";
    deleteButton.textContent = "Excluir";
    deleteButton.addEventListener("click", () => deleteProject(project.id));

    const upButton = document.createElement("button");
    upButton.className = "card-btn move-btn";
    upButton.textContent = "↑";
    upButton.title = "Mover para cima";
    upButton.disabled = index === 0;
    upButton.addEventListener("click", () => moveProject(index, index - 1));

    const downButton = document.createElement("button");
    downButton.className = "card-btn move-btn";
    downButton.textContent = "↓";
    downButton.title = "Mover para baixo";
    downButton.disabled = index === projects.length - 1;
    downButton.addEventListener("click", () => moveProject(index, index + 1));

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
    actions.appendChild(upButton);
    actions.appendChild(downButton);

    info.appendChild(title);
    info.appendChild(description);
    info.appendChild(tags);
    info.appendChild(actions);

    item.appendChild(thumb);
    item.appendChild(info);

    projectList.appendChild(item);
  });
}

function createProjectThumb(project) {
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
    return thumb;
  }

  thumb.textContent = getInitials(project.title);
  return thumb;
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

  projectId.value = project.id;
  projectTitle.value = project.title;
  projectDescription.value = project.description;
  projectImage.value = project.image || "";
  projectLink.value = project.link || "";
  projectTags.value = project.tags ? project.tags.join(", ") : "";

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
  const filteredProjects = projects.filter(project => project.id !== id);

  saveProjects(filteredProjects);
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

function exportProjects() {
  const projects = getProjects();
  const data = JSON.stringify(projects, null, 2);

  exportOutput.value = data;

  navigator.clipboard
    .writeText(data)
    .then(() => {
      showToast("Dados copiados!");
    })
    .catch(() => {
      showToast("Copie os dados manualmente.");
    });
}

function clearProjects() {
  const confirmClear = confirm("Isso vai apagar todos os projetos salvos neste navegador. Continuar?");

  if (!confirmClear) return;

  saveProjects([]);
  exportOutput.value = "";
  resetForm();
  renderProjects();
  showToast("Projetos apagados!");
}

loginForm.addEventListener("submit", handleLogin);
logoutBtn.addEventListener("click", handleLogout);
projectForm.addEventListener("submit", handleProjectSubmit);
cancelEditBtn.addEventListener("click", resetForm);
exportBtn.addEventListener("click", exportProjects);
clearBtn.addEventListener("click", clearProjects);

checkLogin();
