console.log('hi');

const weatherApp = {
	userInput: null,
	startApp (input) {
		this.userInput = input;
		this.checkInputType();
	},
	checkInputType () {
		if (isNaN(this.userInput.value)) {
			this.userInput = `q=${this.userInput}`;
 		} else {
 			this.userInput = `zip=${userInput}`;
 		}
 		this.currentWeatherApp(this.userInput);
	},
	currentWeatherApp (zipCode) {
		console.log('Weather app function');
		$.ajax({
			url: `https://api.openweathermap.org/data/2.5/weather?${zipCode},us&appid=e131115e6491a3ae223530b75af706a0`,
			method: 'GET',
			dataType: 'json',
			makeFarenheit (kelvin) {
				let farenheit = (kelvin - 273.15) * 9 / 5 + 32;
				return Math.round(farenheit);
			},
			success (weatherData) {
				$('#city-name').text(weatherData.name);
				$('#temp').text(`Currently: ${this.makeFarenheit(weatherData.main.temp)}F`);
				$('#descriptor').text(weatherData.weather[0].description.toUpperCase());
				$('#high-temp').text(`Today's high: ${this.makeFarenheit(weatherData.main.temp_max)}F`);
				$('#low-temp').text(`Today's low: ${this.makeFarenheit(weatherData.main.temp_min)}F`);
				$('#current-weather-photo').attr('src', `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`);
			},
			fail (err) {
				console.error(err);
			}
		});
		console.log('Forecast');
		$.ajax({
			url:`https://api.openweathermap.org/data/2.5/forecast?${zipCode},us&appid=e131115e6491a3ae223530b75af706a0`,
			method: 'GET',
			dataType: 'json',
			makeFarenheit (kelvin) {
				let farenheit = (kelvin - 273.15) * 9 / 5 + 32;
				return Math.round(farenheit);
			},
			success (forecastData) {
				console.log(forecastData.list.length);
				let firstEntry = forecastData.list[0];
				forecastData.list.unshift(firstEntry);
				for (let i = 0; i < 5; i++) {
					let firstEntry = forecastData.list[i * 8]
					let day = new Date(forecastData.list[i*8].dt_txt);
					let minTemp = this.makeFarenheit(Math.min(forecastData.list[i * 8].main.temp_min, forecastData.list[i * 8 + 1].main.temp_min, forecastData.list[i * 8 + 2].main.temp_min, forecastData.list[i * 8 + 3].main.temp_min, forecastData.list[i * 8 + 4].main.temp_min, forecastData.list[i * 8 + 5].main.temp_min, forecastData.list[i * 8 + 6].main.temp_min), forecastData.list[i * 8 + 7].main.temp_min);
					let maxTemp = this.makeFarenheit(Math.max(forecastData.list[i * 8].main.temp_max, forecastData.list[i * 8 + 1].main.temp_max, forecastData.list[i * 8 + 2].main.temp_max, forecastData.list[i * 8 + 3].main.temp_max,forecastData.list[i * 8 + 4].main.temp_max, forecastData.list[i * 8 + 5].main.temp_max, forecastData.list[i * 8 + 6].main.temp_max), forecastData.list[i * 8 + 7].main.temp_max);
					let dayFormat = new Intl. DateTimeFormat('en-US', {weekday: 'long'}).format(day);
					$(`#day${i + 1}`).text(dayFormat);
					$(`#day${i + 1}-high`).text(`High: ${maxTemp}`);
					$(`#day${i + 1}-low`).text(`Low: ${minTemp}`);
					$(`#day${i + 1}-icon`).attr('src', `http://openweathermap.org/img/w/${forecastData.list[i * 8 + 5].weather[0].icon}.png`)
					console.log(forecastData.list[i * 8 + 5]);
					$(`#day${i + 1}-description`).text(`${forecastData.list[i * 8 + 5].weather[0].main}`)
				}
			},
			fail (err) {
				console.error(err);
			}
		})
	}
}
// There are 8 3 hr increments for each day
// [0-7], [8-15], [16-23], [24-31], [32-39] indexed
// but the midnight item never exists for the first day. Real annoying


// (K − 273.15) × 9/5 + 32 = F


$('#button').on('click', (e) => {
	e.preventDefault();
	weatherApp.startApp($('#zip-code').val());
});