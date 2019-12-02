const MENU_TABS = [
  `Table`,
  `Stats`
];

const createTab = (title, isActive) => {
  const activeClass = isActive ? `trip-tabs__btn--active` : ``;

  return (`
    <a class="trip-tabs__btn ${activeClass}" href="#">${title}</a>
  `);
};

const createMenuTemplate = () => {
  const isActive = Math.random() > 0.5;
  const tabsTemplate = MENU_TABS.map((it) => createTab(it, isActive)).join(`\n`);

  return (`
    <nav class="trip-controls__trip-tabs  trip-tabs">
      ${tabsTemplate}
    </nav>
  `);
};

export {createMenuTemplate};
