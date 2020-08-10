import React, { useEffect, useState } from "react";
import "./App.scss";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import Axios from "axios";
import InfoBox from "./Components/InfoBox";
import Map from "./Components/Map";
import Table from "./Components/Table";
import LineGraph from "./Components/LineGraph";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [lineType, setLineType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 50, lng: 20 });
  const [mapZoom, setMapZoom] = useState(2.5);
  const [mapCountries, setMapCountries] = useState([]);

  useEffect(() => {
    getInitialTotal();
    getCountries();
  }, []);

  // Get all countries for inital worldwide load
  const getInitialTotal = async () => {
    const { data } = await Axios.get("https://disease.sh/v3/covid-19/all");
    setCountryInfo(data);
  };

  // get countries for dropdown menu
  const getCountries = async () => {
    const { data } = await Axios.get(
      "https://disease.sh/v3/covid-19/countries"
    );
    const countriesData = data.map((country) => ({
      name: country.country,
      value: country.countryInfo.iso3,
    }));

    // descending order sort
    const sortedData = data.sort((a, b) => b.cases - a.cases);

    setTableData(sortedData);
    setCountries(countriesData);
    setMapCountries(data);
  };

  // when selecting a country or worldwide from dropdown
  const onCountryChange = async (e) => {
    const countryCode = e;

    const { data } =
      countryCode === "worldwide"
        ? await Axios.get("https://disease.sh/v3/covid-19/all")
        : await Axios.get(
            `https://disease.sh/v3/covid-19/countries/${countryCode}`
          );
    setCountry(countryCode);
    setCountryInfo(data);

    const lat = data.countryInfo !== undefined ? data.countryInfo.lat : 50;
    const lng = data.countryInfo !== undefined ? data.countryInfo.long : 20;
    const zoom = data.countryInfo ? 4 : 2;
    setMapCenter([lat, lng]);
    setMapZoom(zoom);
  };

  return (
    <div className="App">
      <div className="app__left">
        <div className="app__header">
          <h1>covid-19 tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={(e) => onCountryChange(e.target.value)}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map(({ value, name }, id) => (
                <MenuItem value={value} key={`menu-item-${id}`}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            title="Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
            onClick={() => setLineType("cases")}
            isActive={lineType === "cases"}
            isCase
          />
          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
            onClick={() => setLineType("deaths")}
            isActive={lineType === "deaths"}
            isDeath
          />
          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
            onClick={() => setLineType("recovered")}
            isActive={lineType === "recovered"}
          />
        </div>

        <Map
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
          type={lineType}
          onClick={onCountryChange}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>live cases by country</h3>
          <Table countries={tableData} />
          <h3 className="right-graph-header">worldwide new cases</h3>
          <LineGraph className="right-graph" type={lineType} />
          <div className="app-info">
            <p>API URL: disease.sh</p>
            <p>
              Covid-19 data sourced from Worldometers, updated every 10 minutes
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
