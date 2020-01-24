import MenuComponent from '../components/menu';
import FiltersComponent from '../components/filters';
import {render, replace, changeView} from '../utils/render';
import {FilterType, MenuTab} from '../const';

class TripControlsController {
  constructor(container, pointsModel, InitialData) {
    this._pointsModel = pointsModel;
    this._container = container;
    this._activeMenuTab = InitialData.MENU_TAB;
    this._activeFilterType = InitialData.FILTER_TYPE;
    this._menuComponent = null;
    this._filtersComponent = null;
    this._statisticsComponent = null;
    this._tripController = null;

    this._onTripViewChange = this._onTripViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._pointsModel.addDataChangeHandler(this._onDataChange);
  }

  render() {
    this._renderMenu();
    this._renderFilters();
    this._menuComponent.setClickHandler(this._onTripViewChange);
    this._filtersComponent.setFiltersChangeHandler(this._onFilterChange);
  }

  setViewsToChange(cb) {
    const [statisticsComponent, tripController] = cb();
    this._statisticsComponent = statisticsComponent;
    this._tripController = tripController;
  }

  _renderMenu() {
    const oldComponent = this._menuComponent;
    this._menuComponent = new MenuComponent(this._activeMenuTab);

    if (oldComponent) {
      replace(this._menuComponent, oldComponent);
    } else {
      render(this._container, this._menuComponent.getElement());
    }
  }

  _renderFilters() {
    const filters = Object.values(FilterType).map((filter) => ({
      name: filter,
      isEmpty: this._pointsModel.getPointsByFilter(filter).length === 0,
      checked: filter === this._activeFilterType
    }));

    const oldComponent = this._filtersComponent;
    this._filtersComponent = new FiltersComponent(filters);

    if (oldComponent) {
      replace(this._filtersComponent, oldComponent);
    } else {
      render(this._container, this._filtersComponent.getElement());
    }
  }

  _onTripViewChange(evt) {
    const isChanged = this._menuComponent.setActiveTab(evt.target);
    if (isChanged) {
      if (evt.target.value === MenuTab.TABLE) {
        this._tripController.setNoPoints(true);
        changeView(this._tripController, this._statisticsComponent);
      } else {
        this._tripController.setNoPoints(false);
        changeView(this._statisticsComponent, this._tripController);
      }
    }
  }

  _onFilterChange(filterType) {
    this._activeFilterType = filterType;
    this._pointsModel.setFilter(this._activeFilterType);
  }

  _onDataChange() {
    this.render();
  }
}

export default TripControlsController;
