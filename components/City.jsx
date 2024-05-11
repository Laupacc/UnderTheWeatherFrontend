import Head from "next/head";
import React, { useState, useEffect } from 'react';
import './style.css';
import { useDispatch, useSelector } from "react-redux";

function City() {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await fetch(
        "https://weatherapp-backend-umber.vercel.app/weather"
      );
      const data = await response.json();
      if (data.weather) {
        setCities(data.weather);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const deleteCity = async (cityName) => {
    try {
      const response = await fetch(
        `https://weatherapp-backend-umber.vercel.app/weather/${cityName}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (data.result) {
        setCities(cities.filter((city) => city.cityName !== cityName));
      }
    } catch (error) {
      console.error("Error deleting city:", error);
    }
  };

  return (
    <div id="cityList">
      {cities.map((city) => (
        <div key={city.cityName} className="cityContainer">
          <p className="name">{city.cityName}</p>
          <p className="description">{city.description}</p>
          <img
            className="weatherIcon"
            src={`images/${city.main}.png`}
            alt="Weather Icon"
          />
          <div className="temperature">
            <p className="tempMin">{city.tempMin}°C</p>
            <span>-</span>
            <p className="tempMax">{city.tempMax}°C</p>
          </div>
          <button
            className="deleteCity"
            onClick={() => deleteCity(city.cityName)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default City;
