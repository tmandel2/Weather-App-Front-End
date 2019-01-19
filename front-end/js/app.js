console.log('hi');


currentWeatherApp = (zipCode) => {
	console.log('Weather app function');
	$.ajax({
		url: `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=e131115e6491a3ae223530b75af706a0`,
		method: 'GET',
		dataType: 'json',
		makeFarenheit (kelvin) {
			let farenheit = (kelvin - 273.15) * 9 / 5 + 32;
			return Math.round(farenheit);
		},
		iconChooser (data) {
			let id = data.weather[0].id;
			if (id < 300) {
				return '11d';
			} else if (id < 500) {
				return '09d';
			} else if (id < 505) {
				return '10d';
			} else if (id === 511) {
				return '13d';
			} else if (id < 532) {
				return '09d';
			} else if (id < 623) {
				return '13d';
			} else if (id < 782) {
				return '50d';
			} else if (id < 801) {
				return '01d';
			} else if (id === 801) {
				return '02d';
			} else if (id === 802) {
				return '03d';
			} else if (id === 803 || id === 804) {
				return '04d';
			}
		},
		success (weatherData) {
			$('#city-name').text(weatherData.name);
			$('#temp').text(`Currently: ${this.makeFarenheit(weatherData.main.temp)}F`);
			$('#descriptor').text(weatherData.weather[0].description.toUpperCase());
			$('#high-temp').text(`Today's high: ${this.makeFarenheit(weatherData.main.temp_max)}F`);
			$('#low-temp').text(`Today's low: ${this.makeFarenheit(weatherData.main.temp_min)}F`);
			$('#current-weather-photo').attr('src', `http://openweathermap.org/img/w/${this.iconChooser(weatherData)}.png`);
		},
		fail (err) {
			console.error(err);
		}
	})
}

// forecastWeatherApp = (zipCode) => {
// 	console.log('Forecast');
// 	$.ajax({
// 		url: `api.openweathermap.org/data/2.5/forecast?zip=${zipCode},us&appid=e131115e6491a3ae223530b75af706a0`,
// 		method: 'GET',
// 		dataType: 'json',
// 		success (forecastData) {
// 			$('#city-name').text(weatherData.name);
// 			$('#temp').text(`Currently: ${this.makeFarenheit(weatherData.main.temp)}F`);
// 			$('#descriptor').text(weatherData.weather[0].description.toUpperCase());
// 			$('#high-temp').text(`Today's high: ${this.makeFarenheit(weatherData.main.temp_max)}F`);
// 			$('#low-temp').text(`Today's low: ${this.makeFarenheit(weatherData.main.temp_min)}F`);
// 			$('#current-weather-photo').attr('src', `http://openweathermap.org/img/w/${this.iconChooser(weatherData)}.png`);
// 		},
// 		fail (err) {
// 			console.error(err);
// 		}
// 	})
// }





// (K − 273.15) × 9/5 + 32 = F


$('#button').on('click', (e) => {
	e.preventDefault();
	currentWeatherApp($('#zip-code').val());
	// forecastWeatherApp($('#zip-code').val());
});