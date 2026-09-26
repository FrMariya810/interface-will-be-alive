"use strict";

// ДЗ 3. Интерактивная коллекция.
// Выполняйте практические этапы из docs/HOME_WORK.md по порядку.
// Не пытайтесь написать весь файл за один раз: после каждого этапа проверяйте
// связанный сценарий в браузере и фиксируйте рабочее состояние коммитом.

const detailsTitle = document.querySelector("#details-title");
const detailsDescription = document.querySelector("#details-description");
const detailsPanel = document.querySelector("#details-panel");

const cards = document.querySelectorAll(".collection-card");
const filterButtons = document.querySelectorAll(".filter-button");
const visibleCount = document.querySelector("#visible-count");
const randomButton = document.querySelector("#random-button");

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

randomButton.addEventListener("click", () => {
  const visibleCards = Array.from(cards).filter(
    (card) => !card.classList.contains("collection-card--hidden")
  );

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
// Этап 3. Найдите карточки и элементы панели подробностей.
// Реализуйте одну общую функцию выбора карточки.

// Этап 4. Найдите кнопки фильтров.
// Показывайте подходящие карточки, обновляйте активную кнопку и счетчик.
// Учтите случай, когда новый фильтр скрывает выбранную карточку.

// Этап 5. Реализуйте случайный выбор среди видимых карточек.
// Затем реализуйте полный сброс интерфейса.

// Этап 6. Запускайте подготовленную CSS-анимацию через класс.
// Не дублируйте оформление в script.js.
