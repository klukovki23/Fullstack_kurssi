
import { useState, useEffect } from 'react'
import axios from 'axios'


const Filter = ({ value, onChange }) => (
  <div>
    find countries: <input value={value} onChange={onChange} />
  </div>
);

const Countries = ({ countries, onSelect }) => (
  <div>
    <ul>
      {countries.map((c) => (
        <li key={c.cca3}>{c.name.common} <button onClick={() => onSelect(c)}>Show</button></li>
      ))}
    </ul>
  </div>
)

const CountryDetails = ({ country }) => {
  const languages = country.languages
    ? Object.values(country.languages)
    : [];
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (!country.capital || country.capital.length === 0) return;

    const apiKey = import.meta.env.VITE_SOME_KEY;
    console.log(apiKey);
    const capital = country.capital[0];

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${apiKey}`
      )
      .then((response) => setWeather(response.data))
      .catch((err) => console.error("Weather fetch error:", err));
  }, [country]);



  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital: {country.capital}</div>
      <div>area: {country.area}</div>

      <h3>Languages:</h3>
      <ul>
        {languages.map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img
        src={country.flags?.png}

        width="200"
        height="auto"
      />
      {weather && (
        <div>
          <h3>Weather in {country.capital[0]}</h3>
          <div>Temperature: {weather.main.temp} °C</div>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
          <div>Wind: {weather.wind.speed} m/s</div>
        </div>
      )}


    </div>
  );
};

const App = () => {

  const [allCountries, setAllCountries] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);



  useEffect(() => {
    console.log('effect run, country is now', allCountries)
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setAllCountries(response.data)
      });

  }, []);

  const filtered = allCountries.filter((c) =>
    c.name.common.toLowerCase().includes(query.trim().toLowerCase())
  );

  useEffect(() => {
    if (filtered.length === 1) {
      setSelected(filtered[0]);
    } else {
      setSelected(null);
    }
  }, [query, allCountries]);


  let content = null;
  if (filtered.length > 10) {
    content = <div>Too many matches, specify another filter</div>;
  } else if (filtered.length > 1 && !selected) {
    content = <Countries countries={filtered} onSelect={setSelected} />;
  } else if (selected) {
    content = <CountryDetails country={selected} />;
  } else {
    content = <div>No matches</div>;
  }

  return (
    <div>
      <h2>Country search</h2>
      <Filter value={query} onChange={(e) => setQuery(e.target.value)} />
      {content}
    </div>
  )
}

export default App
