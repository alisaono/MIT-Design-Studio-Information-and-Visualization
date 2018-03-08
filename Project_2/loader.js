//Fetching weather data
$.ajax({
  url: 'https://api.darksky.net/forecast/d3c6dce0b69fbca038c6ac07f44e57c0/42.361145,-71.057083',
  dataType: 'JSONP',
  type: 'GET',
  async: false,
  crossDomain: true,
  complete: function (data) {
    if (data.readyState == '4' && data.status == '200') {
      drawHourlyWeather(data.responseJSON.hourly.data)
      drawDailyWeather(data.responseJSON.daily.data)
      drawMapWeather(data.responseJSON.daily.data[0])
    } else {
      console.error("DATA FETCH FAILED")
    }
  }
})

// Test with locally stored weather data
// drawHourlyWeather(weatherHourly.hourly.data)
// drawDailyWeather(weatherDaily.daily.data)
// drawMapWeather(weatherDaily.daily.data[0])
