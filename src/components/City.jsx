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
        setCityNames(
          data.weather.map((city) => ({
            ...city,
            sunrise: new Date(city.sunrise * 1000).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            sunset: new Date(city.sunset * 1000).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }))
        );
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-3">
        {cityNames.map((city) => (
          <div
            key={city.cityName}
            className="bg-blue-200 rounded-lg shadow-xl m-4 p-6 w-auto flex flex-col justify-around items-center text-center text-gray-800 "
          >
            <div className="flex flex-col items-center justify-center">
              <p className="font-semibold text-slate-700 text-3xl">
                {city.cityName
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </p>
              <div className="flex justify-center items-center mb-5">
                <div className="flex flex-col justify-center items-center">
                  <div className="flex">
                    <img
                      src="images/thermometer.png"
                      alt="Temperature"
                      className="w-8 h-8"
                    />
                    <p className="text-3xl">
                      {Math.round(city.temp * 2) / 2}°C
                    </p>
                  </div>
                  <p>Feels like: {Math.round(city.feels_like * 2) / 2}°C</p>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <img
                    className="w-16 m-3"
                    src={`images/${city.icon}.png`}
                    alt="Weather Icon"
                  />
                  <p>
                    {city.description.charAt(0).toUpperCase() +
                      city.description.slice(1)}{" "}
                  </p>
                </div>
              </div>

              <div className="flex justify-center items-center p-2 m-2">
                <div className="flex flex-col justify-center items-center">
                  <p className="m-2">{Math.round(city.tempMin * 2) / 2}°C</p>
                  <img
                    src="images/thermometer_down.png"
                    alt="Temperature"
                    className="w-8 h-8"
                  />
                </div>
                <div className="flex flex-col justify-center items-center">
                  <p className="m-2">{Math.round(city.tempMax * 2) / 2}°C</p>
                  <img
                    src="images/thermometer_up.png"
                    alt="Temperature"
                    className="w-8 h-8"
                  />
                </div>
              </div>
              <div className="flex justify-center items-center m-2">
                <img
                  src="images/hygrometer.png"
                  alt="Humidity"
                  className="w-8 h-8"
                />
                <p className="m-2">Humidity: {city.humidity}%</p>
              </div>
              <div className="flex justify-center items-center m-2">
                <img src="images/windsock.png" alt="Wind" className="w-8 h-8" />
                <p className="m-2">Wind: {city.wind} m/s</p>
              </div>
              <p className="m-2">Clouds: {city.clouds}%</p>
              <p className="m-2">Rain: {city.rain} mm</p>
              <p className="m-2">Snow: {city.snow} mm</p>
            </div>
            <div className="flex justify-center items-center m-2 p-2">
              <div className="flex flex-col justify-center items-center m-2">
                <img
                  src="images/sunrise.png"
                  alt="Sunrise"
                  className="w-8 h-8"
                />
                <p>{city.sunrise}</p>
              </div>
              <div className="flex flex-col justify-center items-center m-2">
                <img src="images/sunset.png" alt="Sunset" className="w-8 h-8" />
                <p>{city.sunset}</p>
              </div>
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
