
const DEFAULT_PROJECTS = [
  {
    id: "parkour-addon",
    title: "Parkour Addon",
    description: "Sistema de parkour para Minecraft Bedrock com pendurar em bordas, vault, wall run e movimentação avançada.",
    image: "",
    link: "#",
    tags: ["Minecraft", "Script API", "Molang"]
  },
  {
    id: "combat-system",
    title: "Combat System",
    description: "Sistema de combate com combos, animações, efeitos, habilidades e mecânicas para addons de battlegrounds.",
    image: "",
    link: "#",
    tags: ["Combat", "Addon", "JSON"]
  },
  {
    id: "ui-system",
    title: "UI System",
    description: "Sistema de interface personalizada para Minecraft Bedrock com HUD, barra de vida e informações na tela.",
    image: "",
    link: "#",
    tags: ["UI", "Minecraft", "JSON"]
  }
];

function getPortfolioProjects() {
  const savedProjects = localStorage.getItem("ydeku_projects");

  if (!savedProjects) {
    localStorage.setItem("ydeku_projects", JSON.stringify(DEFAULT_PROJECTS));
    return DEFAULT_PROJECTS;
  }

  try {
    const projects = JSON.parse(savedProjects);

    if (Array.isArray(projects)) {
      return projects;
    }

    return DEFAULT_PROJECTS;
  } catch (error) {
    console.error("Erro ao carregar projetos:", error);
    return DEFAULT_PROJECTS;
  }
}

function savePortfolioProjects(projects) {
  localStorage.setItem("ydeku_projects", JSON.stringify(projects));
}
