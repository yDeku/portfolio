const DEFAULT_PROJECTS = [
  {
    id: "template-01",
    title: "Projeto exemplo 01",
    description: "Use este card como modelo para apresentar um projeto do seu portfólio.",
    image: "assets/logo.png",
    link: "#",
    status: "Template",
    details: "Aqui você pode explicar melhor o projeto, mostrar qual problema ele resolve, quais sistemas ele usa e por que ele é interessante.",
    features: ["Template", "Projeto", "Exemplo"],
    tags: ["Template", "Projeto", "Exemplo"]
  },
  {
    id: "template-02",
    title: "Projeto exemplo 02",
    description: "Aqui você pode colocar uma descrição curta explicando o que o projeto faz.",
    image: "assets/logo.png",
    link: "#",
    status: "Exemplo",
    details: "Essa área é perfeita para colocar detalhes extras, como mecânicas principais, tecnologias usadas e o tipo de experiência criada.",
    features: ["Sistema", "Addon", "Demo"],
    tags: ["Sistema", "Addon", "Demo"]
  },
  {
    id: "template-03",
    title: "Projeto exemplo 03",
    description: "Substitua esse texto depois pelo nome, imagem e detalhes do seu projeto.",
    image: "assets/logo.png",
    link: "#",
    status: "Modelo",
    details: "Você pode transformar este card em qualquer projeto real depois, editando o título, imagem, descrição, tags e detalhes.",
    features: ["Minecraft", "API", "JSON"],
    tags: ["Minecraft", "API", "JSON"]
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

    localStorage.setItem("ydeku_projects", JSON.stringify(DEFAULT_PROJECTS));
    return DEFAULT_PROJECTS;
  } catch (error) {
    console.error("Erro ao carregar projetos:", error);
    localStorage.setItem("ydeku_projects", JSON.stringify(DEFAULT_PROJECTS));
    return DEFAULT_PROJECTS;
  }
}

function savePortfolioProjects(projects) {
  localStorage.setItem("ydeku_projects", JSON.stringify(projects));
}
