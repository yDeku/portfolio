const DEFAULT_PROJECTS = [
  {
    id: "template-1",
    title: "Project Template",
    description: "Project description here.",
    image: "assets/logo.png",
    link: "#",
    tags: ["Template"]
  },
  {
    id: "template-2",
    title: "Project Template",
    description: "Project description here.",
    image: "assets/logo.png",
    link: "#",
    tags: ["Template"]
  },
  {
    id: "template-3",
    title: "Project Template",
    description: "Project description here.",
    image: "assets/logo.png",
    link: "#",
    tags: ["Template"]
  }
];

const PROJECTS_STORAGE_KEY = "ydeku_projects";

function getPortfolioProjects() {
  const savedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);

  if (savedProjects) {
    try {
      const projects = JSON.parse(savedProjects);

      if (Array.isArray(projects)) {
        return projects;
      }
    } catch (error) {
      console.error("Erro ao carregar projetos salvos:", error);
    }
  }

  return DEFAULT_PROJECTS;
}

function savePortfolioProjects(projects) {
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
}

function resetPortfolioProjects() {
  localStorage.removeItem(PROJECTS_STORAGE_KEY);
}
