const getMonthString = (num) => {
  const monthStrings = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return monthStrings[num];
};

const getDayOfWeekString = (num) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[num];
};

const getWeatherIcon = (symbol) => {
  const icons = [
    { daySymbol: '01d', nightSymbol: '01n', icon: 'fa-sun' },
    { daySymbol: '02d', nightSymbol: '02n', icon: 'fa-cloud-sun' },
    { daySymbol: '03d', nightSymbol: '03n', icon: 'fa-cloud' },
    { daySymbol: '04d', nightSymbol: '04n', icon: 'fa-cloud-sun' },
    { daySymbol: '09d', nightSymbol: '09n', icon: 'fa-cloud-sun-rain' },
    { daySymbol: '10d', nightSymbol: '10n', icon: 'fa-cloud-showers-heavy' },
    { daySymbol: '11d', nightSymbol: '11n', icon: 'fa-bolt' },
    { daySymbol: '13d', nightSymbol: '13n', icon: 'fa-snowflake' },
    { daySymbol: '50d', nightSymbol: '50n', icon: 'fa-smog' },
  ];

  const result = icons.find((obj) => {
    return obj.daySymbol == symbol || obj.nightSymbol == symbol;
  });

  return result.icon;
};

const getWeather = async (city) => {
  try {
    const api_key = 'c82d1caf4dd79e51d0725a2f5b0614bf';
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${api_key}`
    );
    const data = await response.json();

    const cityHeading = document.querySelector('.city-heading');
    cityHeading.textContent = data.city.name;

    const daysDiv = document.querySelector('.days');
    while (daysDiv.firstChild) {
      daysDiv.removeChild(daysDiv.firstChild);
    }

    let hourDigit1 = data.list[0].dt_txt[11];
    let hourDigit2 = data.list[0].dt_txt[12];

    const weatherInfo = data.list.filter((obj) => {
      return obj.dt_txt[11] == hourDigit1 && obj.dt_txt[12] == hourDigit2;
    });

    weatherInfo.forEach((day) => {
      const fullDate = new Date(day.dt_txt);
      const month = getMonthString(fullDate.getMonth());
      const date = fullDate.getDate();
      const year = fullDate.getFullYear();
      const dateStr = `${month} ${date}, ${year}`;
      const dayOfWeek = getDayOfWeekString(fullDate.getDay());

      const iconSymbol = day.weather[0].icon;
      const iconClass = getWeatherIcon(iconSymbol);
      const temp = Math.round(day.main.temp);
      const desc = day.weather[0].description;

      const daysDiv = document.querySelector('.days');
      const colDiv = document.createElement('div');
      const dateDiv = document.createElement('div');
      const dayDiv = document.createElement('div');
      const iconDiv = document.createElement('div');
      const icon = document.createElement('i');
      const tempDiv = document.createElement('div');
      const descDiv = document.createElement('div');

      colDiv.classList.add('col');
      daysDiv.append(colDiv);

      dateDiv.classList.add('date');
      dateDiv.textContent = dateStr;
      colDiv.append(dateDiv);

      dayDiv.classList.add('day-of-week');
      dayDiv.textContent = dayOfWeek;
      colDiv.append(dayDiv);

      iconDiv.classList.add('icon');
      colDiv.append(iconDiv);

      icon.classList.add('fas', iconClass);
      iconDiv.append(icon);

      tempDiv.classList.add('temp');
      tempDiv.textContent = `${temp}°`;
      colDiv.append(tempDiv);

      descDiv.classList.add('desc');
      descDiv.textContent = desc;
      colDiv.append(descDiv);
    });
  } catch (error) {
    console.log(error);
  }
};

const searchBox = document.querySelector('#search-box');
const searchBtn = document.querySelector('#search-btn');

const generateNewWeather = () => {
  let searchValue = searchBox.value;
  if (searchValue) {
    getWeather(searchValue);
    searchBox.value = '';
  } else {
    alert('You need to input a city.');
  }
};

searchBox.onkeyup = (e) => {
  if (e.key == 'Enter') {
    generateNewWeather();
  }
};
searchBtn.addEventListener('click', generateNewWeather);

getWeather('New York');
