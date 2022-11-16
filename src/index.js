import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

let getEl = selector => document.querySelector(selector);
getEl('#search-box').addEventListener(
  'input',
  debounce(onInput, DEBOUNCE_DELAY)
);

function onInput(e) {
  const inputValue = e.target.value.trim();
  console.log(inputValue);
  if (inputValue === '') {
    getEl('.country-list').innerHTML = '';
    getEl('.country-info').innerHTML = '';
  } else {
    fetchCountries(inputValue)
      .then(renderCountry)
      .catch(error => console.log(error));
  }
}

function renderCountry(data) {
  console.log(data);
  if (data.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (data.length === 1) {
    getEl('.country-list').innerHTML = '';
    getEl('.country-info').innerHTML = renderCountryInfo(data[0]);
  } else {
    const list = data.map(country => renderCountryList(country)).join('');
    getEl('.country-list').insertAdjacentHTML('beforeend', list);
    getEl('.country-info').innerHTML = '';
  }
}

function renderCountryList({ name, flags }) {
  return `
    <li class="country__list">
        <img src=${flags.svg} alt="${name.official}" width="50">
        <h2 class="country__list-name">${name.official}</h2>
    </li>
    `;
}

function renderCountryInfo({ name, capital, population, flags, languages }) {
  return `
    <div >
            <img  src=${flags.svg} alt="${name.official}" width="100">
            <h2 class="country__name">${name.official}</h2>
       
            <p class="capital"><span class="country__text">Capital</span>: ${capital}</p>
            <p class="population"><span class="country__text">Population</span>: ${population}</p>
            <p class="languages"><span class="country__text">Languages</span>: ${Object.values(
              languages
            )}</p>
    </div>
    `;
}
