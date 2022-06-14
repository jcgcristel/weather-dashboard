var limit = 5;
var testlat = 33.44;
var testlon = -90.04;
var APIkey = `ec45c559fdda3ac235725be56933003e`;


// variables
var lat;
var lon;


// gets the weather depending on the longitude and latitude
var getWeather = function(lat, lon) {
    var apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIkey}`; //&exclude=${part}
    
    fetch(`${apiURL}`)
    .then(response => response.json())
    .then(data => {
           console.log(data);
           // display weather
        });
    }
    
// gets the longitude and latitude of the city
var getCity = function(location) {
    var geoCode = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${APIkey}`;

    fetch(geoCode)
        .then(response => response.json())
        .then(data => {
            getWeather(data[0].lat, data[0].lon);
            savePrevCity(data[0].name, data[0].state, data[0].country);
            // clears input
            $("#city").val("");
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
        
    for (var i = 0; i < cityList.length; i++) {
        // create suggestedCityEl
        var suggestedCityEl = $(`<option>`)
            .attr('value', locationString(cityList[i].name,cityList[i].state,cityList[i].country));    

        suggestedCityListEl.append(suggestedCityEl);
    }
}

// pulls a list of cities depending on what is written in the input
var getCityList = function() {
var cityName = $("#city").val();
var geoCode = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${APIkey}`;

    fetch(geoCode)
        .then(response => response.json())
        .then(data => {
            cityList = data;
            displaySuggestedCityList();
        });
}

// displays the list 
var parseSubmission = function() {
    var submittedCity = $("#city").val();
    getCity(submittedCity);
}

// update previously searched cities
var savePrevCity = function(city, state, country) {  
    var prevCity = locationString(city, state, country);
    console.log(prevCity);

    var cityListEl = $(`.prev-cities`);

    var cityListItem = $(`<li>`)
        .text(prevCity)
        .addClass(`prev-city`);
    
    cityListEl.append(cityListItem);
}

$("#city").on(`keyup change`, getCityList);
$("#submit").on(`click`, parseSubmission);

// getCityList();