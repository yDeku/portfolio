const DEFAULT_PROJECTS = [
  {
    id: "parkour-addon",
    title: "Parkour Addon",
    description: "Sistema de parkour para Minecraft Bedrock com pendurar em bordas, vault, wall run e movimentação avançada.",
    image: "assets/logo.png",
    link: "#",
    tags: ["Minecraft", "Script API", "Molang"]
  },
  {
    id: "combat-system",
    title: "Combat System",
    description: "Sistema de combate com combos, animações, efeitos, habilidades e mecânicas para addons de battlegrounds.",
    image: "assets/logo.png",
    link: "#",
    tags: ["Combat", "Addon", "JSON"]
  },
  {
    id: "ui-system",
    title: "UI System",
    description: "Sistema de interface personalizada para Minecraft Bedrock com HUD, barra de vida e informações na tela.",
    image: "assets/logo.png",
    link: "#",
    tags: ["UI", "Minecraft", "JSON"]
  }
];

const PROJECTS_STORAGE_KEY = "ydeku_projects";

function isAdminPage() {
  return window.location.pathname.toLowerCase().includes("admin");
}

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

function exportProjectsAsCode() {
  const projects = getPortfolioProjects();

  return `const DEFAULT_PROJECTS = ${JSON.stringify(projects, null, 2)};`;
}
