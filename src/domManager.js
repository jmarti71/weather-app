import { getWeatherData } from './dataManager';
let currentData;
let metricUnits = false;

function initDOMInputs() {
    const locationInput = document.querySelector('.search-box');
    const submitLocation = document.querySelector('.search-box_submit');
    const unitsButton = document.querySelector('.toggle-units-button');

    // Gets weather data upon click only if the searched location is not already being displayed.
    submitLocation.addEventListener('click', () => { 
        !isDisplayed(`${locationInput.value}`) ? 
        getWeatherData(`${locationInput.value}`) : 
        console.log(`Data for ${locationInput.value} already present.`);
    });
    unitsButton.addEventListener('click', () => { toggleUnits(unitsButton); });
};

function pushDataToDOM(data) {
    currentData = data;
    if (metricUnits) {
        applyDataToElements(currentData.Metric);
    }
    else if (!metricUnits) {
        applyDataToElements(currentData.Imperial);
    }
}

function applyDataToElements(data) {
    const element = getDOMWeatherElement();
    element.location.textContent = data.location;
    element.temp.textContent = data.temp;
    element.humidity.textContent = 'Humidity: ' + data.humidity;
    element.feelsLike.textContent = 'Feels like: ' + data.feels_like;
    element.weatherIcon.textContent = determineIcon(data.icon_id);  
    element.weatherText.textContent = data.main_weather;
    element.windSpeed.textContent = 'Wind speed: ' + data.wind_speed;
}

function getDOMWeatherElement() {
    const location = document.querySelector('.location-heading');
    const temp = document.querySelector('.temp');
    const humidity = document.querySelector('.humidity');
    const feelsLike = document.querySelector('.feels-like');
    const weatherIcon = document.querySelector('.main-weather_icon');
    const weatherText = document.querySelector('.main-weather_text');
    const windSpeed = document.querySelector('.wind-speed');

    return {
        location,
        temp,
        humidity,
        feelsLike,
        weatherIcon,
        weatherText,
        windSpeed
    };
}

function toggleUnits(button) {
    if (button.textContent === '°F') {
        button.textContent = '°C';
        metricUnits = true;
        applyDataToElements(currentData.Metric);
    }
    else if (button.textContent === '°C') {
        button.textContent = '°F';
        metricUnits = false;
        applyDataToElements(currentData.Imperial);
    }
}

// Checks if location entered in search box is already being displayed.
function isDisplayed(location) {
    const currentLocation = currentData.Imperial.location.split(',')[0].toLowerCase();
    const enteredLocation = location.includes(',') ? location.split(',')[0].toLowerCase() : location.toLowerCase();
    return currentLocation === enteredLocation ? true : false;
}

function determineIcon(iconID) {
        switch(true) {
            case iconID >= 200 && iconID <= 232:
                return 'rainy';
            case iconID >= 300 && iconID <= 531:
                return 'rainy';
            case iconID >= 600 && iconID <= 622:
                return 'ac_unit';
            case iconID >= 701 && iconID <= 771:
                return 'water';
            case iconID === 781: 
                return 'tornado';
            case iconID === 800:
                return 'circle';
            case iconID >= 801 && iconID <= 804:
                return 'cloudy';
        }
}

function domErrorHandler (code) {
    const errorText = document.querySelector('.error-message');  
    if (code === 200) {
        errorText.className = 'error-message hide';
    } else if (code !== 200) {
        errorText.className = 'error-message show';
    }
}

export { pushDataToDOM, initDOMInputs, domErrorHandler};