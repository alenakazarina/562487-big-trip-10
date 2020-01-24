import AbstractComponent from './abstract-component';
import {MenuTab} from '../const';

const ACTIVE_TAB_CLASS = `trip-tabs__btn--active`;

const createTab = (menuTab, activeTab) => {
  const isActiveClass = menuTab === activeTab ? ACTIVE_TAB_CLASS : ``;

  return `
    <button class="trip-tabs__btn ${isActiveClass}" value="${menuTab}">${menuTab}</button>
  `;
};

const createMenuTemplate = (tabs, activeTab) => {
  const tabsTemplate = tabs.map((menuTab) => createTab(menuTab, activeTab)).join(`\n`);

  return `
    <nav class="trip-controls__trip-tabs  trip-tabs">
      ${tabsTemplate}
    </nav>
  `;
};

class Menu extends AbstractComponent {
  constructor(activeTab) {
    super();
    this._activeTab = activeTab;
    this._tabs = Object.values(MenuTab);
  }

  getTemplate() {
    return createMenuTemplate(this._tabs, this._activeTab);
  }

  setActiveTab(newActiveTab) {
    if (newActiveTab.value === this._activeTab) {
      return false;
    }
    this._element.querySelector(`.${ACTIVE_TAB_CLASS}`).classList.remove(ACTIVE_TAB_CLASS);
    newActiveTab.classList.add(ACTIVE_TAB_CLASS);
    this._activeTab = newActiveTab.value;
    return true;
  }

  setClickHandler(handler) {
    this.getElement().querySelectorAll(`.trip-tabs__btn`).forEach((tab) => {
      tab.addEventListener(`click`, handler);
    });
  }
}

export default Menu;
