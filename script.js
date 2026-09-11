(() => {
  "use strict";

  const searchInput = document.querySelector("#dashboard-search");
  const groupSelect = document.querySelector("#dashboard-group");
  const clearButton = document.querySelector("#search-clear");
  const count = document.querySelector("#dashboard-count");
  const emptyState = document.querySelector("#directory-empty");
  const sections = [...document.querySelectorAll(".hub-section")];
  const cards = [...document.querySelectorAll(".tool-card")];

  if (!searchInput || !groupSelect || !count || !emptyState || !clearButton || !cards.length) return;

  const normalize = (value) => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();

  const render = () => {
    const query = normalize(searchInput.value);
    const group = groupSelect.value;
    let visible = 0;

    cards.forEach((card) => {
      const matchesGroup = group === "all" || card.dataset.group === group;
      const matchesSearch = !query || normalize(`${card.dataset.search} ${card.textContent}`).includes(query);
      const isVisible = matchesGroup && matchesSearch;
      card.hidden = !isVisible;
      if (isVisible) visible += 1;
    });

    sections.forEach((section) => {
      const hasVisibleCard = Boolean(section.querySelector(".tool-card:not([hidden])"));
      section.hidden = !hasVisibleCard;
    });

    count.textContent = `${visible} de ${cards.length} dashboards`;
    emptyState.hidden = visible !== 0;
    clearButton.hidden = !searchInput.value;
  };

  searchInput.addEventListener("input", render);
  groupSelect.addEventListener("change", render);
  clearButton.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    render();
  });
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && searchInput.value) {
      searchInput.value = "";
      render();
    }
  });

  render();
})();
