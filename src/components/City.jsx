import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCity, removeCity } from "../reducers/city.js";

function City() {
  const dispatch = useDispatch();
  const cities = useSelector((state) => state.city);

  const [cityNames, setCityNames] = useState([]);

  useEffect(() => {
    fetchCities();
  }, [cities]);

  // Fetch cities from the backend
  const fetchCities = async () => {
    try {
      const response = await fetch(
        "https://weatherapp-backend-umber.vercel.app/weather"
      );
      const data = await response.json();
      if (data.weather) {
        setCityNames(data.weather);

        // const sunriseDate = new Date(data.sunrise * 1000);
        // const sunrise = sunriseDate.toLocaleTimeString("en-US");
        // const sunsetDate = new Date(data.sunset * 1000);
        // const sunset = sunsetDate.toLocaleTimeString("en-US");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Delete city from the backend
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
        dispatch(removeCity(data.weather.cityName));
        setCityNames(cities.filter((city) => city.cityName !== cityName));
      }
    } catch (error) {
      console.error("Error deleting city:", error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-3">
        {cityNames.map((city) => (
          <div
            key={city.cityName}
            className="bg-blue-200 rounded-md shadow-md m-2 p-6 w-auto flex flex-col justify-around items-center"
          >
            <div className="flex flex-col items-center justify-center">
              <p className="font-semibold">
                {city.cityName
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </p>
              <img
                className="w-16 h-16"
                src={`images/${city.icon}.png`}
                alt="Weather Icon"
              />

              <p>{city.sunrise}</p>
              <p>{city.sunset}</p>
              <p>
                {city.description.charAt(0).toUpperCase() +
                  city.description.slice(1)}{" "}
              </p>
              <p>Current temp: {city.temp}°C</p>
              <p>Feels like: {city.feels_like}°C</p>
              <p className="mr-2">Min temp: {city.tempMin}°C</p>
              <p className="ml-2">Max temp: {city.tempMax}°C</p>
              <p>Humidity: {city.humidity}%</p>
              <p>Wind: {city.wind} m/s</p>
              <p>Clouds: {city.clouds}%</p>
              <p>Rain: {city.rain} mm</p>
              <p>Snow: {city.snow} mm</p>
            </div>
            <button
              className="mt-8 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:bg-red-600"
              onClick={() => deleteCity(city.cityName)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default City;
