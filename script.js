const repositoryList = document.querySelector("#repository-list");
const repositoryCount = document.querySelector("#repository-count");
const listStatus = document.querySelector("#list-status");

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "Date not recorded";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function createRepositoryItem(repository, index) {
  const item = document.createElement("li");
  item.className = "repository-item";

  const number = document.createElement("span");
  number.className = "repository-number";
  number.setAttribute("aria-hidden", "true");
  number.textContent = String(index + 1).padStart(2, "0");

  const details = document.createElement("div");
  details.className = "repository-details";

  const link = document.createElement("a");
  link.className = "repository-link";
  link.href = repository.url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = repository.full_name;

  const description = document.createElement("p");
  description.className = "repository-description";
  description.textContent = repository.description;

  const metadata = document.createElement("div");
  metadata.className = "repository-metadata";

  const language = document.createElement("span");
  language.className = "repository-language";
  language.textContent = repository.language;

  const starredDate = document.createElement("time");
  starredDate.dateTime = repository.starred_at;
  starredDate.textContent = `Starred ${formatDate(repository.starred_at)}`;

  metadata.append(language, starredDate);
  details.append(link, description, metadata);
  item.append(number, details);

  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const repositories = await response.json();

    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a list.");
    }

    repositoryList.replaceChildren(
      ...repositories.map(createRepositoryItem),
    );
    repositoryCount.textContent = String(repositories.length).padStart(2, "0");
    listStatus.textContent = repositories.length
      ? ""
      : "No starred repositories yet.";
  } catch (error) {
    repositoryCount.textContent = "--";
    listStatus.textContent = "Repositories could not be loaded. Please try again later.";
    console.error("Unable to load starred repositories:", error);
  }
}

loadRepositories();