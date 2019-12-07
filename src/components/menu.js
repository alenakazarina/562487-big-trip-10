import {createElement} from '../utils';

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

class Menu {
  constructor() {
    this._tabs = MENU_TABS;
    this._element = null;
  }

  getTemplate() {
    return createMenuTemplate(this._tabs);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default Menu;
