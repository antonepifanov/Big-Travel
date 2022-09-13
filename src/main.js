import {createTripInfoTemplate} from './view/trip-info.js';
import {createHeaderMenuTemplate} from './view/header-menu.js';
import {createTripCoastTemplate} from './view/trip-coast.js';
import {createFiltersTemplate} from './view/trip-filters.js';
import {createSortingTemplate} from './view/sorting.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMain = document.querySelector(".trip-main");
render(tripMain, createTripInfoTemplate(), "afterbegin");

const tripInfo = tripMain.querySelector(".trip-info");
render(tripInfo, createTripCoastTemplate(), "beforeend");

const pageNav = tripMain.querySelector(".trip-controls__navigation");
render(pageNav, createHeaderMenuTemplate(), "beforeend");

const tripFilters = tripMain.querySelector(".trip-controls__filters");
render(tripFilters, createFiltersTemplate(), "beforeend");

const mainContent = document.querySelector(".trip-events");
render(mainContent, createSortingTemplate(), "beforeend");
