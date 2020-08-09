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
  const [lineType, setLineType] = useState("cases")

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
  };

  // when selecting a country or worldwide from dropdown
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const { data } =
      countryCode === "worldwide"
        ? await Axios.get("https://disease.sh/v3/covid-19/all")
        : await Axios.get(
            `https://disease.sh/v3/covid-19/countries/${countryCode}`
          );
    setCountry(countryCode);
    setCountryInfo(data);
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
              onChange={onCountryChange}
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
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
        </div>

        <Map />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>live cases by country</h3>
          <Table countries={tableData} />
          <h3>worldwide new cases</h3>
          <LineGraph type={lineType}  />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
