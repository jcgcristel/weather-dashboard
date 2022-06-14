var limit = 5;
var testlat = 33.44;
var testlon = -90.04;
var APIkey = `ec45c559fdda3ac235725be56933003e`;


// variables
var lat;
var lon;

var getWeather = function(lat, lon) {
    var apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${testlat}&lon=${testlon}&appid=${APIkey}`; //&exclude=${part}
    
    fetch(`${apiURL}`)
        .then(response => response.json())
        .then(data => {
           console.log(data);
        });
}

// {city name},{state code},{country code}
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

var displaySuggestedCityList = function() {
    var cityListEl = $("#city-options");

    // clear options list
    cityListEl.empty();
        
    for (var i = 0; i < cityList.length; i++) {
        var cityEl = $(`<option>`);
        
        // checks if state is undefined
        if (cityList[i].state) {
            // if all values are present, show state
            cityEl.attr("value", `${cityList[i].name}, ${cityList[i].state}, ${cityList[i].country}`);    
        }
        else {
            // if state is undefined shows only name, country
            cityEl.attr("value", `${cityList[i].name}, ${cityList[i].country}`);         
        }

        cityListEl.append(cityEl);
    }
}

var getCityLonLan = function(location) {
    var geoCode = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${APIkey}`;

    fetch(geoCode)
        .then(response => response.json())
        .then(data => {
            getWeather(data[0].lat, data[0].lon);
        });
}

var parseSubmission = function() {
    var submittedCity = $("#city").val();
    submittedCity = submittedCity.replace(" ", "");
    getCityLonLan(submittedCity);
}

$("#city").on(`keyup change`, getCityList);
$("#submit").on(`click`, parseSubmission);

// getCityList();