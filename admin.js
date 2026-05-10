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
  return getPortfolioProjects();
}

function saveProjects(projects) {
  savePortfolioProjects(projects);
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

function formatTags(text) {
  return text
    .split(",")
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
}

function handleProjectSubmit(event) {
  event.preventDefault();

  const title = projectTitle.value.trim();
  const description = projectDescription.value.trim();
  const image = projectImage.value.trim();
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

  saveProjects(DEFAULT_PROJECTS);
  exportOutput.value = "";
  resetForm();
  renderProjects();
  showToast("Projetos resetados!");
}

loginForm.addEventListener("submit", handleLogin);
logoutBtn.addEventListener("click", handleLogout);
projectForm.addEventListener("submit", handleProjectSubmit);
cancelEditBtn.addEventListener("click", resetForm);
exportBtn.addEventListener("click", exportProjects);
clearBtn.addEventListener("click", clearProjects);

checkLogin();
