console.log('hi');

const weatherApp = {
	userInput: null,
	currentDate: null,
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
		let forecastDateArray = []
		let usedDatesDayNumber = []
		let usedDates = []
		// console.log('Weather app function');
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
				this.currentDate = new Date(Date.now()).getDate();
			},
			fail (err) {
				console.error(err);
			}
		});
		// console.log('Forecast');
		$.ajax({
			url:`https://api.openweathermap.org/data/2.5/forecast?${zipCode},us&appid=e131115e6491a3ae223530b75af706a0`,
			method: 'GET',
			dataType: 'json',
			makeFarenheit (kelvin) {
				let farenheit = (kelvin - 273.15) * 9 / 5 + 32;
				return Math.round(farenheit);
			},
			mostFrequent (weatherArray) {
				let most = 0;
				let number = 0;
				let counterArr;
				for (let i=0; i < weatherArray.length; i++) {
						for (let j = i; j < weatherArray.length; j++) {
							if (weatherArray[i].weather[0].main == weatherArray[j].weather[0].main) {
							number++;
							}
							if (most < number) {
							most = number; 
							counterArr = weatherArray[i].weather[0];
							}
						}
					number = 0;
				}
				// console.log(counterArr);
				return counterArr;
			},
			extractDates (forecastData) {
				for (let i = 0; i < forecastData.length; i++) {
					let date = new Date(forecastData[i].dt_txt);
					forecastDateArray.push(date);
				}
				// console.log(forecastDateArray);
				usedDates[0] = forecastDateArray[0];
				usedDatesDayNumber[0] = forecastDateArray[0].getDate();
				for (let i = 1; i < forecastDateArray.length; i++) {
					if(forecastDateArray[i].getDate() !== forecastDateArray[i - 1].getDate()) {
						usedDatesDayNumber.push(forecastDateArray[i].getDate());
						usedDates.push(forecastDateArray[i]);
					}
				}
				// console.log(usedDates);
				// console.log(usedDatesDayNumber);
			},
			updatePage (forecastData) {
				for (let i = 0; i < usedDatesDayNumber.length; i++) {
					const arrayOfWeather = [];
					const arrayOfMin = [];
					const arrayOfMax = [];
					// let firstEntry = forecastData.list[i * 8]
					for(let k = 0; k < forecastDateArray.length; k++) {
						if (usedDatesDayNumber[i] === forecastDateArray[k].getDate()){
							arrayOfWeather.push(forecastData[k]);
						}
					}
					// let day = new Date(forecastData[i*8].dt_txt);
					// let arrayOfWeather = [forecastData[i * 8], forecastData[i * 8 + 1], forecastData[i * 8 + 2], forecastData[i * 8 + 3], forecastData[i * 8 + 4], forecastData[i * 8 + 5], forecastData[i * 8 + 6], forecastData[i * 8 + 7]];
					let mostFrequent = this.mostFrequent(arrayOfWeather);
					// console.log(mostFrequent);
					for(let l = 0; l < arrayOfWeather.length; l++){
						arrayOfMin.push(this.makeFarenheit(arrayOfWeather[l].main.temp_min));
						arrayOfMax.push(this.makeFarenheit(arrayOfWeather[l].main.temp_max));
					}
					// console.log(arrayOfWeather);

					// console.log(mostFrequent);
					let minTemp = Math.min(...arrayOfMin);
					let maxTemp = Math.max(...arrayOfMax);
					if (mostFrequent.icon.includes('n')) {
						mostFrequent.icon = mostFrequent.icon.replace(/n/, 'd');
						// console.log(mostFrequent.icon);
					};
					$(`#day${i + 1}`).text(new Intl.DateTimeFormat('en-US', {weekday: 'long'}).format(usedDates[i]));
					$(`#day${i + 1}-high`).text(`High: ${maxTemp}`);
					$(`#day${i + 1}-low`).text(`Low: ${minTemp}`);
					$(`#day${i + 1}-icon`).attr('src', `https://openweathermap.org/img/w/${mostFrequent.icon}.png`)
					$(`#day${i + 1}-description`).text(`${mostFrequent.main}`)
				}
				if(usedDatesDayNumber.length === 6) {
					$(`#day${1}`).html(`${new Intl.DateTimeFormat('en-US', {weekday: 'long'}).format(usedDates[0])}<br/>from ${new Intl.DateTimeFormat('en-US', {hour: 'numeric'}).format(forecastDateArray[0])}`);
					$(`#day${6}`).html(`${new Intl.DateTimeFormat('en-US', {weekday: 'long'}).format(usedDates[5])}<br/>until ${new Intl.DateTimeFormat('en-US', {hour: 'numeric'}).format(forecastDateArray[forecastDateArray.length - 1])}`);
				} else {
					$(`#day6-info`).css('visibility', 'hidden');
				}
			},
			success (forecastData) {
				// if (forecastData.list.length < 40) {
				// 	forecastData.list.unshift(forecastData.list[0]);
				// 	this.success(forecastData);
				// } else {
					this.extractDates(forecastData.list);
					this.updatePage(forecastData.list);
				// }
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