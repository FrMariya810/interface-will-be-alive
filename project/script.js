"use strict";

const detailsTitle = document.querySelector("#details-title");
const detailsDescription = document.querySelector("#details-description");
const detailsPanel = document.querySelector("#details-panel");

const cards = document.querySelectorAll(".collection-card");
const filterButtons = document.querySelectorAll(".filter-button");
const visibleCount = document.querySelector("#visible-count");
const randomButton = document.querySelector("#random-button");
const resetButton = document.querySelector("#reset-button");

const initialTitle = detailsTitle.textContent;
const initialDescription = detailsDescription.textContent;


let selectedCard = null;
let activeFilter = "all";

cards.forEach((card) => {
  card.addEventListener("click", () => {
    showCard(card);
  });
});

function showCard(card) {
  if (selectedCard) {
    selectedCard.classList.remove("collection-card--selected");
    selectedCard.setAttribute("aria-pressed", "false");
  }

  card.classList.add("collection-card--selected");
  card.setAttribute("aria-pressed", "true");
  selectedCard = card;

  detailsTitle.textContent = card.dataset.title;
  detailsDescription.textContent = card.dataset.description;

  detailsPanel.classList.remove("details-panel--pulse");
  void detailsPanel.offsetWidth;
  detailsPanel.classList.add("details-panel--pulse");
}

function clearSelection() {
  if (selectedCard) {
    selectedCard.classList.remove("collection-card--selected");
    selectedCard.setAttribute("aria-pressed", "false");
    selectedCard = null;
  }

  detailsTitle.textContent = initialTitle;
  detailsDescription.textContent = initialDescription;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyFilter(button.dataset.filter);
  });
});

function applyFilter(filter) {
  activeFilter = filter;

  filterButtons.forEach((btn) => {
    const isActive = btn.dataset.filter === filter;
    btn.classList.toggle("filter-button--active", isActive);
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  let count = 0;

  cards.forEach((card) => {
    const matches = filter === "all" || card.dataset.category === filter;
    card.classList.toggle("collection-card--hidden", !matches);
    if (matches) count += 1;
  });

  visibleCount.textContent = count;

  if (selectedCard && selectedCard.classList.contains("collection-card--hidden")) {
    clearSelection();
  }
}

function getVisibleCards() {
  return Array.from(cards).filter(
    (card) => !card.classList.contains("collection-card--hidden")
  );
}

randomButton.addEventListener("click", () => {
  const visibleCards = getVisibleCards();
  if (visibleCards.length === 0) return;

  let pool = visibleCards;
  if (visibleCards.length > 1 && selectedCard) {
    const withoutCurrent = visibleCards.filter((card) => card !== selectedCard);
    if (withoutCurrent.length > 0) {
      pool = withoutCurrent;
    }
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  showCard(pool[randomIndex]);
});

resetButton.addEventListener("click", () => {
  applyFilter("all");
  clearSelection();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    applyFilter("all");
    clearSelection();
    return;
  }

  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
    return;
  }

  const visible = getVisibleCards();
  if (visible.length === 0) return;

  event.preventDefault();

  const currentIndex = selectedCard ? visible.indexOf(selectedCard) : -1;
  let nextIndex;

  if (currentIndex === -1) {
    nextIndex = event.key === "ArrowRight" ? 0 : visible.length - 1;
  } else {
    const step = event.key === "ArrowRight" ? 1 : -1;
    nextIndex = (currentIndex + step + visible.length) % visible.length;
  }

  const nextCard = visible[nextIndex];
  showCard(nextCard);
  nextCard.focus();
});
