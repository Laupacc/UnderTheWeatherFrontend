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
            className="bg-gray-100 rounded-md shadow-md m-2 p-6 w-auto flex flex-col justify-around items-center"
          >
            <div className="flex flex-col items-center justify-center">
              <p className="font-semibold">{city.cityName}</p>
              <p>{city.description}</p>
              <div className="flex items-center justify-center">
                <img
                  className="w-8 h-8 mr-2"
                  src={`images/${city.main}.png`}
                  alt="Weather Icon"
                />
                <div className="flex">
                  <p className="mr-2">{city.tempMin}°C</p>
                  <span>-</span>
                  <p className="ml-2">{city.tempMax}°C</p>
                </div>
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
