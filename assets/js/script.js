var limit = 5;
var testlat = 33.44;
var testlon = -90.04;
var APIkey = `ec45c559fdda3ac235725be56933003e`;


// Variables
var suggestedCities = [];
var cityName;

// convert kelvin to celsius
var kelvinToCelsius = function(kelvin) {
    return (Math.round(kelvin - 273.15));
}

var getDateTime = function(offset) {
    // get base time
    var baseTime = luxon.DateTime.now().setZone('UTC');    

    // get offset
    var offset = weather.timezone_offset;
    
    // get local time of city
    return baseTime.plus({seconds: offset});
}

var getDateTimeString = function(time) {
    return time.toLocaleString({ weekday: 'long', month: 'long', day: '2-digit' });
}

// display current weather
var displayCurrentWeather = function() {
    var current = weather.current;
    var iconUrl = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;

    // determine time
    var time = getDateTime(weather.offset);
    var timeString = getDateTimeString(time);

    // determine temperature
    var temp = kelvinToCelsius(weather.current.temp)
    
    $(`#current-date`).text(timeString);
    $(`#current-city`).text(cityName);
    $(`#current-icon`).attr("src", iconUrl);
    $(`#temp`).text(`${temp}\u00B0`);
    $(`#humidity`).text(`${current.humidity}%`)
    $(`#wind_speed`).text(`${current.wind_speed} m/s`);
    $(`#uvi`).text(`${current.uvi}`)
}

var displayForecastedWeather = function() {
    var day = weather.daily;

    var forecastEl = $(`.forecast-weather`);
    forecastEl.empty();

    for (var i = 1; i <= 5; i++) {
        var dayCardEl = $(`<div>`).addClass(`card day`);

        // determine day
        var time = getDateTime(weather.timezone_offset);
        time = time.plus({days: i}); // get the following day
        var timeString = getDateTimeString(time);

        // determine low and high temp in celsius
        var max = kelvinToCelsius(day[i].temp.max);
        var min = kelvinToCelsius(day[i].temp.min);

        // create date element
        var dayDateEl = $(`<p>`).text(timeString);
        
        // create main info element
        var dayMainInfoEl = $('<div>').addClass(`forecast-main-info`);
        var dayIcoEl = $(`<img>`).attr(`src`, `https://openweathermap.org/img/wn/${day[i].weather[0].icon}.png`)
        var dayTempEl = $(`<p>`).text(`${min}\u00B0/${max}\u00B0`);
        dayMainInfoEl.append(dayIcoEl, dayTempEl);

        // create other info element
        var dayWindEl = $(`<p>`).text(`${day[i].wind_speed} m/s`);
        var dayHumidityEl = $(`<p>`).text(`${day[i].humidity}%`);

        // display onto html document
        dayCardEl.append(dayDateEl, dayMainInfoEl, dayWindEl, dayHumidityEl);
        forecastEl.append(dayCardEl);
    }
}

// gets the weather
// lat : latitude of city
// lon : longtitude of city
var getWeather = function(lat, lon) {
    var apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIkey}`; //&exclude=${part}
    
    fetch(`${apiURL}`)
    .then(response => response.json())
    .then(data => {
            weather = data;
            displayCurrentWeather();
            displayForecastedWeather();
        });
}
    
// gets the longitude and latitude of the city
var getCity = function() {
    var location = $("#city").val();
    var geoCode = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${APIkey}`;

    fetch(geoCode)
        .then(response => response.json())
        .then(data => {
            getWeather(data[0].lat, data[0].lon);
            savePrevCity(data[0].name, data[0].state, data[0].country);
            cityName = data[0].name;

            // clears input
            $("#city").val("");

            // clear options list
            $("#city-options").empty();          
        });
}

// returns string depending if state is undefined or not
var locationString = function(city, state, country) {
    // if state exists display [City, State, Country]
    if (state) {
        return `${city}, ${state}, ${country}`;
    }
    // else display [City, Country]
    else {
        return `${city}, ${country}`;
    }
}

// displays a list of suggested cities depending on what is being inputed
var displaySuggestedCityList = function() {
    var suggestedCityListEl = $("#city-options");

    // clear options list
    suggestedCityListEl.empty();
        
    for (var i = 0; i < suggestedCities.length; i++) {
        // create suggestedCityEl
        var suggestedCityEl = $(`<option>`)
            .attr('value', locationString(suggestedCities[i].name,suggestedCities[i].state,suggestedCities[i].country));    

        suggestedCityListEl.append(suggestedCityEl);
    }
}

// pulls a list of cities depending on what is written in the input
var getCityList = function() {
cityName = $("#city").val();

var geoCode = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${APIkey}`;

    fetch(geoCode)
        .then(response => response.json())
        .then(data => {
            suggestedCities = data;
            displaySuggestedCityList();
        });
}

// update previously searched cities
var savePrevCity = function(city, state, country) {  
    // generates proper string of [City, Country] or [City, State, Country]
    var prevCity = locationString(city, state, country);

    // create list item with city name
    var prevCityEl = $(`<li>`)
        .text(prevCity)
        .addClass(`prev-city`);
    
    // add created list item to previous searched cities
    var prevCityListEl = $(`.prev-cities`);
    prevCityListEl.append(prevCityEl);
}

// event listeners
$("#city").on(`keyup change`, getCityList);
$("#submit").on(`click`, getCity);

// getCityList();