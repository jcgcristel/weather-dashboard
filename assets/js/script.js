var limit = 5;
var testlat = 33.44;
var testlon = -90.04;
var APIkey = `4c340d93543c0ebde7a6871889fd5734`;


// 4c340d93543c0ebde7a6871889fd5734
// dbdaa4d09d3a1843436cedc3ebf6a645
// ec45c559fdda3ac235725be56933003e -> blockesdsdsddddddddfsd
// broken function caused over 1000 fetch requests :|

var test;

// Variables
let suggestedCities = [];
let searchedCities = [];
let cityName;
let weather;

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

// uvi colour indicator
// 0-5: green   / low
// 6-7: orange  / moderate
// 8+ : red     / high
var uviStatus = function(uvi) {
    switch (true) {
        case (uvi >= 0 && uvi <= 5):
            return 'aquamarine';
        case (uvi > 5 && uvi <= 7):
            return 'sandybrown';
        case (uvi > 7):
            return 'firebrick'
    }
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
    $(`#uvi`).text(current.uvi).css("background-color", uviStatus(current.uvi));

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
        var dayTempEl = $(`<p>`).text(`${max}\u00B0`);
        var dayLowEl = $(`<span>`).text(`/ ${min}\u00B0`)
        dayTempEl.append(dayLowEl);
        dayMainInfoEl.append(dayIcoEl, dayTempEl);

        // create other info element
        var dayHumidityEl = $(`<p>`).text(`${day[i].humidity}%`);
        var dayWindEl = $(`<p>`).text(`${day[i].wind_speed} m/s`);

        // display onto html document
        dayCardEl.append(dayDateEl, dayMainInfoEl, dayHumidityEl, dayWindEl);
        forecastEl.append(dayCardEl);
    }
}

var displayWeather = function() {
    displayCurrentWeather();
    displayForecastedWeather();
    savePrevCity(cityName);
}

// gets the weather
// lat : latitude of city
// lon : longtitude of city
var getWeather = function(lat, lon, nextFunction) {
    var apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIkey}`; //&exclude=${part}
    
    fetch(`${apiURL}`)
    .then(response => response.json())
    .then(data => {
            weather = data;
            nextFunction();
        });
}
    
// gets the longitude and latitude of the city
var getCity = function(location, nextFunction) {
    var geoCode = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${APIkey}`;
    var runNext = nextFunction;

    fetch(geoCode)
        .then(response => response.json())
        .then(data => {     
            getWeather(data[0].lat, data[0].lon, runNext);
            // savePrevCity(data[0].name, data[0].state, data[0].country);
            // updatePrevCityWeather();
            
            cityName = locationString(data[0].name, data[0].state, data[0].country);

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
input = $("#city").val();

    if (input) {
        var geoCode = `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=${limit}&appid=${APIkey}`;

            fetch(geoCode)
                .then(response => response.json())
                .then(data => {
                    suggestedCities = data;
                    displaySuggestedCityList();
                });
    }
}

// checks to see if city already exists in history
var cityExists = function(city) {
    var prevCityEl = $('.prev-city');  
    for (var i = 0; i < prevCityEl.length; i++) {
        if (prevCityEl.find('h3')[i].innerText === city) {
            return true;
        }
    }
    return false
}

// update previously searched cities
var savePrevCity = function() {  
    // generates proper string of [City, Country] or [City, State, Country]

    // if city is not in history, log it in history
    if (!cityExists(cityName)) {
        saveCity(cityName);

        // weather variables
        var temp = kelvinToCelsius(weather.current.temp);
        var iconUrl = `https://openweathermap.org/img/wn/${weather.current.weather[0].icon}.png`;

        var prevCities = $(`.prev-cities`);
    
        // create card element
        var prevCityCardEl = $(`<div>`).addClass(`card prev-city`);
        // create city name element
        var prevCityEl = $(`<h3>`).text(cityName);
        
        // create div element to hold weather of city
        var prevCityDivEl = $(`<div>`)    
        var prevCityImgEl =$(`<img>`).attr(`src`, iconUrl);
        var prevCityTempEl = $(`<p>`).text(temp);
        
        // display html
        prevCityDivEl.append(prevCityImgEl, prevCityTempEl);
        prevCityCardEl.append(prevCityEl, prevCityDivEl);
        prevCities.append(prevCityCardEl);
    }
}

var selectPrevCityHandler = function(event) {
    // when selecting prev city card
    if (event.target.closest(".prev-city")) {
        // find city name of card
        var prevCityName = $(event.target)
            .parents('.prev-city')
            .find('h3').text();

        // update weather information based on city name found on card
        getCity(prevCityName)
    }
}

// save previous cities
var saveCity = function(city) {
    // checks if history is capped
    if (searchedCities.length === 5) {
        // delete oldest city
        searchedCities.shift();
        $('.prev-city:first').remove();
        
        searchedCities.push(city);
    }
    else {
        searchedCities.push(city);
    }
}

// var updatePrevCity = function() {

// }

// // update weather of previously searched cit
// var updatePrevCities = function() {
//     for (var i = 0; i < searchedCities.length; i++) {
//         getCity(searchedCities[i]);
//     }
// }

// event listeners
$("#city").on(`keyup change`, getCityList);

$("#search").submit(function(event){
    event.preventDefault();

    //handler for when input is empty
    if ($('#city').val() == '') {
        return;
    }

    getCity($('#city').val(), displayWeather);
});

$(".prev-cities").on('click', selectPrevCityHandler);

// getCityList();