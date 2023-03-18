import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries.js';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const inputCountrieName = input.addEventListener(
  'input',
  debounce(evt => {
    let name = input.value;

    if (input.value === '') {
      return;
    }

    fetchCountries(name)
      .then(data => {
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        if (data.length === 1) {
          countryList.insertAdjacentHTML(
            'beforeend',
            renderListOfCountries(data)
          );
          countryInfo.insertAdjacentHTML(
            'beforeend',
            renderInfoOfCountrie(data)
          );
        } else if (data.length >= 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else {
          countryList.insertAdjacentHTML(
            'beforeend',
            renderListOfCountries(data)
          );
        }
      })
      .catch(alertWrongName);
  }, DEBOUNCE_DELAY)
);

const renderListOfCountries = data => {
  const resoult = data
    .map(({ name, flags }) => {
      return `<li>
    <img src="${flags.svg}" alt="Flag of ${name.official}" width = 40px height = 40px>
    <h2>${name.official}</h2>
</li>`;
    })
    .join('');
  return resoult;
};

const renderInfoOfCountrie = data => {
  const resoult = data
    .map(({ capital, population, languages }) => {
      return `<p><b>Capital: </b>${capital}</p>
        <p><b>Population: </b>${population}</p>
        <p><b>Languages: </b>${Object.values(languages).join(', ')}</p>`;
    })
    .join('');
  return resoult;
};

function alertWrongName() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
