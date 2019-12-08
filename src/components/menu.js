import AbstractComponent from './abstract-component';

const MENU_TABS = [
  `Table`,
  `Stats`
];

const createTab = (title, isActive) => {
  const activeClass = isActive ? `trip-tabs__btn--active` : ``;

  return `
    <a class="trip-tabs__btn ${activeClass}" href="#">${title}</a>
  `;
};

const createMenuTemplate = (tabs) => {
  const tabsTemplate = tabs.map((it, i) => createTab(it, i === 0)).join(`\n`);

  return `
    <nav class="trip-controls__trip-tabs  trip-tabs">
      ${tabsTemplate}
    </nav>
  `;
};

class Menu extends AbstractComponent {
  constructor() {
    super();
    this._tabs = MENU_TABS;
  }

  getTemplate() {
    return createMenuTemplate(this._tabs);
  }
}

export default Menu;
