import React from 'react';
import { Column, Message } from 'rbx';
import fetchWithTimeout from './fetchWithTimeout';
import { getCityLat, getCityLng } from './CountryDataHelpers';

const getForecasts = async (longitude, latitude) => {
  const proxyurl = 'https://cors-anywhere.herokuapp.com/';
  const weatherUrl = `http://api.worldweatheronline.com/premium/v1/weather.ashx?key=0d7b6c6176f04e12a1523034202802&q=${latitude.toFixed(3)},${longitude.toFixed(3)}&format=json&num_of_days=7`;
  const weatherResponse = await fetchWithTimeout(proxyurl + weatherUrl, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Transfer-Encoding': 'chunked',
      Connection: 'keep-alive',
      Vary: 'Accept-Encoding',
      'CDN-PullZone': '61832',
      'CDN-Uid': '8fa3a04a-75d9-4707-8056-b7b33c8ac7fe',
      'CDN-RequestCountryCode': 'FI',
      'CDN-EdgeStorageId': '601',
      'X-WWO-Qpd-Left': '488',
      'CDN-CachedAt': '2020-02-28 05:30:52',
      'CDN-RequestId': '744f78f6ea6a7638ab04e662745144fc',
      'CDN-Cache': 'HIT',
      'Cache-Control': 'public, max-age=180',
      'Content-Type': 'application/json',
      Date: 'Fri, 28 Feb 2020 04:31:24 GMT',
      Server: 'BunnyCDN-DE1-601',
    },
  });

  const weatherRes = await weatherResponse.json();
  const weatherObj = {};
  let i;
  let dailyWeather;

  for (i = 0; i < 7; i += 1) {
    dailyWeather = [];
    dailyWeather.push(Math.round(weatherRes.data.weather[i].maxtempF));
    dailyWeather.push(Math.round(weatherRes.data.weather[i].mintempF));
    dailyWeather.push(Math.round(weatherRes.data.weather[i].avgtempF));
    dailyWeather.push(weatherRes.data.weather[i].date);
    weatherObj[i] = dailyWeather;
  }
  const arr = Object.values(weatherObj);

  return (
    <div>
      {
        arr.map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Column.Group key={index}>
            <Column size={3}>
              <Message.Header>
                {weatherObj[index][3]}
              </Message.Header>
              <p>
                Daytime Hi:
                {' '}
                {weatherObj[index][0]}
                {' '}
                &deg;F
              </p>
              <p>
                Daytime Low:
                {' '}
                {weatherObj[index][1]}
                {' '}
                &deg;F
              </p>
              <p className="degrees-text">
                {' '}
                {weatherObj[index][2]}
                {' '}
                &deg;F
              </p>
            </Column>
          </Column.Group>
        ))
      }
    </div>
  );
};

const getHistoricalData = async (longitude, latitude, startDate) => {
  const lastYear = parseFloat(startDate.split('-')[0]) - 1;
  const lastYearDate = [lastYear, startDate.split('-')[1], startDate.split('-')[2]].join('-');
  let endDate = new Date(lastYearDate);
  endDate.setDate(endDate.getDate() + 7);
  [endDate] = endDate.toISOString().split('T');

  const proxyurl = 'https://cors-anywhere.herokuapp.com/';
  const weatherUrl = `http://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=0d7b6c6176f04e12a1523034202802&q=${latitude.toFixed(3)},${longitude.toFixed(3)}&format=json&date=${lastYearDate}&enddate=${endDate}`;
  const weatherResponse = await fetchWithTimeout(proxyurl + weatherUrl, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Transfer-Encoding': 'chunked',
      Connection: 'keep-alive',
      Vary: 'Accept-Encoding',
      'CDN-PullZone': '61832',
      'CDN-Uid': '8fa3a04a-75d9-4707-8056-b7b33c8ac7fe',
      'CDN-RequestCountryCode': 'FI',
      'CDN-EdgeStorageId': '601',
      'X-WWO-Qpd-Left': '488',
      'CDN-CachedAt': '2020-02-28 05:30:52',
      'CDN-RequestId': '744f78f6ea6a7638ab04e662745144fc',
      'CDN-Cache': 'HIT',
      'Cache-Control': 'public, max-age=180',
      'Content-Type': 'application/json',
      Date: 'Fri, 28 Feb 2020 04:31:24 GMT',
      Server: 'BunnyCDN-DE1-601',
    },
  });

  const weatherRes = await weatherResponse.json();
  const weatherObj = {};
  let i;
  let dailyWeather;

  for (i = 0; i < 7; i += 1) {
    dailyWeather = [];
    dailyWeather.push(Math.round(weatherRes.data.weather[i].maxtempF));
    dailyWeather.push(Math.round(weatherRes.data.weather[i].mintempF));
    dailyWeather.push(Math.round(weatherRes.data.weather[i].avgtempF));
    dailyWeather.push(weatherRes.data.weather[i].date);
    weatherObj[i] = dailyWeather;
  }
  const arr = Object.values(weatherObj);

  return (
    <div>
      {
        arr.map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Column.Group key={index}>
            <Column size={3}>
              <Message.Header>
                {weatherObj[index][3]}
              </Message.Header>
              <p>
                Daytime Hi:
                {' '}
                {weatherObj[index][0]}
                {' '}
                &deg;F
              </p>
              <p>
                Daytime Low:
                {' '}
                {weatherObj[index][1]}
                {' '}
                &deg;F
              </p>
              <p className="degrees-text">
                {' '}
                {weatherObj[index][2]}
                {' '}
                &deg;F
              </p>
            </Column>
          </Column.Group>
        ))
      }
    </div>
  );
};

const Weather = async (country, city, startDate) => {
  let latitude;
  let longitude;
  try {
    if (!city) {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${country}.json?access_token=pk.eyJ1IjoiY2xlbWVuc3RpZ2F0b3IiLCJhIjoiY2p6dm8xeWowMHM0djNnbG02ZWM5ZHo4dSJ9.GNbHIUUjyUdJfazjBuExmw&limit=1`;
      const response = await fetchWithTimeout(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const res = await response.json();
      [longitude, latitude] = res.features[0].center;
    } else {
      [longitude, latitude] = [getCityLng(city, country), getCityLat(city, country)];
    }
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);

    if (new Date(startDate).getTime() < Date.now() + 86400000 * 7) {
      return {
        title: 'Weather',
        contents: await getForecasts(longitude, latitude),
      };
    }
    return {
      title: 'Weather (from last year)',
      contents: await getHistoricalData(longitude, latitude, startDate),
    };
  } catch {
    return {
      title: 'Weather',
      contents: 'No information found.',
    };
  }
};

export default Weather;