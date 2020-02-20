import { useEffect } from 'react';
import CountryCode from './CountryCode';

const TravelAdvisory = (country) => {
  const countryID = CountryCode(country);
  const helperURL = 'https://www.reisewarnung.net/api?country=';
  const proxyurl = 'https://cors-anywhere.herokuapp.com/';
  const apiURL = helperURL + countryID;

  useEffect(() => {
    if (countryID) {
      fetch(proxyurl + apiURL)
        .then((res) => res.json())
        .then((response) => console.log(response.data.lang.en.advice));
    } else {
      console.log('enter a country');
    }
  });
};

export default TravelAdvisory;
