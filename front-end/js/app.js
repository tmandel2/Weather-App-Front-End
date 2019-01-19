console.log('hi');


weatherApp = (zipCode) => {
	console.log('Weather app function');
	$.ajax({
		url: `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=e131115e6491a3ae223530b75af706a0`,
		method: 'GET',
		dataType: 'json',
		makeFarenheit (kelvin) {
			let farenheit = (kelvin - 273.15) * 9 / 5 + 32;
			return Math.round(farenheit);
		},
		success (weatherData) {
			// let farenheit = (weatherData.main.temp - 273.15) * 9 / 5 + 32
			$('#city-name').text(weatherData.name);
			$('#temp').text(`Currently: ${this.makeFarenheit(weatherData.main.temp)}F`);
			$('#descriptor').text(weatherData.weather[0].description);
			$('#high-temp').text(`Today's high: ${this.makeFarenheit(weatherData.main.temp_max)}F`);
			$('#low-temp').text(`Today's low: ${this.makeFarenheit(weatherData.main.temp_min)}F`);
		},
		fail (err) {
			console.error(err);
		}
	})
}





// (K − 273.15) × 9/5 + 32 = F


$('#button').on('click', (e) => {
	e.preventDefault();
	weatherApp($('#zip-code').val());
});