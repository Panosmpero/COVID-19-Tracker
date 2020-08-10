import React from "react";
import numeral from "numeral";
import { TileLayer, Map as LeafletMap, Circle, Popup } from "react-leaflet";

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    rgb: "rgb(204, 16, 52)",
    half_op: "rgba(204, 16, 52, 0.5)",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    rgb: "rgb(125, 215, 29)",
    half_op: "rgba(125, 215, 29, 0.5)",
    multiplier: 1200,
  },
  deaths: {
    hex: "#fb4443",
    rgb: "rgb(251, 68, 67)",
    half_op: "rgba(251, 68, 67, 0.5)",
    multiplier: 2000,
  },
};

const Map = ({ center, zoom, countries, type, onClick }) => {
  
  const drawCircles = (data, type) =>
    data.map((country, id) => (
      <Circle
        center={[country.countryInfo.lat, country.countryInfo.long]}
        fillOpacity={0.4}
        fillColor={casesTypeColors[type].hex}
        color={casesTypeColors[type].hex}
        radius={Math.sqrt(country[type]) * casesTypeColors[type].multiplier}
        key={`map-key-${id}`}
        value={country.countryInfo.iso3}
        onClick={(e) => onClick(e.target.options.value)}
      >
        <Popup>
          <div className="popup-container">
            <div
               className="popup-flag"
              style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
            />
            <div className="popup-name">{country.country}</div>
            <div>Cases: {numeral(country.cases).format("0,0")} </div>
            <div>Deaths: {numeral(country.deaths).format("0,0")}</div>
            <div>Recovered: {numeral(country.recovered).format("0,0")}</div>
          </div>
        </Popup>
      </Circle>
    ));

  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {drawCircles(countries, type)}
      </LeafletMap>
    </div>
  );
};

export default Map;
