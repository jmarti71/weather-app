import './style.css';
import { getWeatherData } from './dataManager';
import { initDOMInputs } from './domManager';

const initDefault = (() => {
    getWeatherData('Los Angeles');
    initDOMInputs();
})();