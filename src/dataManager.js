import { pushDataToDOM, domErrorHandler} from "./domManager";
const key = '8c6c6a43a00fa7ad758744fb8c23c2b7';
let term = 'weather';

async function getWeatherData(location) {
    let responseCode;
    try {
        const imperialResponse = await fetch(`https://api.openweathermap.org/data/2.5/${term}?q=${location}&APPID=${key}&units=imperial`, { mode: 'cors' });
        const metricResponse = await fetch(`https://api.openweathermap.org/data/2.5/${term}?q=${location}&APPID=${key}&units=metric`, { mode: 'cors' });
        const imperialData = await imperialResponse.json();
        const metricData = await metricResponse.json();
        // If calls are successful, process data and push to DOM
        if (imperialData.cod === 200 & metricData.cod === 200) {
            const weatherData = processWeatherData(imperialData, metricData);
            pushDataToDOM(weatherData);
            responseCode = 200;
        } else {
            responseCode = "NOT OK";
        }
    } catch (error) {
        // Log if exception is thrown
        console.log(error);
    } finally {
        // Display or hide error message based on response code
        domErrorHandler(responseCode);
    }
}

class Data {
    constructor(data) {
        this.location = data.name + ', ' + data.sys.country;
        this.temp = data.main.temp;
        this.feels_like = data.main.feels_like;
        this.humidity = data.main.humidity + '%';
        this.icon_id = data.weather[0].id;
        this.main_weather = data.weather[0].main;
        this.wind_speed = data.wind.speed;
    }
}

// Returns objects for imperial and metric data
function processWeatherData (imperial, metric) {
    const imperialWeatherData = new Data(imperial);
    imperialWeatherData.temp = Math.round(imperialWeatherData.temp) + ' °F';
    imperialWeatherData.feels_like = Math.round(imperialWeatherData.feels_like) + ' °F';
    imperialWeatherData.wind_speed = Math.round(imperialWeatherData.wind_speed) + ' mph';
    
    const metricWeatherData = new Data (metric);
    metricWeatherData.temp = Math.round(metricWeatherData.temp) + ' °C';
    metricWeatherData.feels_like = Math.round(metricWeatherData.feels_like) + ' °C';
    metricWeatherData.wind_speed = Math.round(metricWeatherData.wind_speed) + ' km/h';

    return {
        Imperial: imperialWeatherData,
        Metric: metricWeatherData
    }
}

export { getWeatherData };