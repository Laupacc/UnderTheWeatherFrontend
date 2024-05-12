import React, { useState, useEffect } from "react";
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
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {cities.map((city) => (
          <div
            key={city.cityName}
            className="flex flex-col justify-between p-4 bg-white rounded-lg shadow-md"
          >
            <div>
              <p className="font-semibold">{city.cityName}</p>
              <p>{city.description}</p>
              <div className="flex items-center">
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
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:bg-red-600"
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
