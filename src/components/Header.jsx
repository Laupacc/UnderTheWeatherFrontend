import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { addCity } from "../reducers/city.js";
import { useEffect } from "react";
import Alert from "@mui/material/Alert";

function Header() {
  const dispatch = useDispatch();
  const cities = useSelector((state) => state.city);

  const [cityName, setCityName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fetchError, setFetchError] = useState("");

  const [lat, setLat] = useState([]);
  const [lon, setLon] = useState([]);

  // Clear alerts after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setError("");
      setSuccess("");
      setFetchError("");
    }, 3500);
    return () => clearTimeout(timer);
  }, [error, success, fetchError]);

  // Get current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLat(position.coords.latitude);
      setLon(position.coords.longitude);
    });
  }, []);

  // Add current location to the backend
  const handleLocation = (e) => {
    e.preventDefault();
    fetch(
      "https://under-the-weather-backend.vercel.app/weather/current/location",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat: lat,
          lon: lon,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.result) {
          dispatch(addCity(data.weather.cityName));
          setSuccess(
            `${data.weather.cityName
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")} has been added to your list!`
          );
          setError("");
          setFetchError("");
        } else {
          setError("This city is already in your list");
          setSuccess("");
          setFetchError("");
        }
      })
      .catch((error) => {
        setFetchError(
          "An error occurred while processing your request. Please verify the city name and try again."
        );
        setSuccess("");
        setError("");
      });
  };

  // Add city to the backend
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://under-the-weather-backend.vercel.app/weather/current", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cityName: cityName }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(addCity(data.weather.cityName));
          setSuccess(
            `${data.weather.cityName
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")} has been added to your list!`
          );
          setError("");
          setFetchError("");
          setCityName("");
        } else {
          setError("This city is already in your list");
          setSuccess("");
          setFetchError("");
          setCityName("");
        }
      })
      .catch((error) => {
        setFetchError(
          "An error occurred while processing your request. Please verify the city name and try again."
        );
        setSuccess("");
        setError("");
      });
  };

  return (
    <>
      <div className="px-4 py-2 bg-custom-blue5 text-white sticky top-0 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="font-UndertheWeather text-4xl sm:text-7xl text-gray-200">
          Under the Weather
        </h1>
        <button
          className="bg-custom-blue2 hover:bg-custom-blue4 text-white text-sm sm:text-base  font-bold py-2 px-4 mb-3 sm:mb-0 rounded"
          onClick={handleLocation}
        >
          Add Current Location
        </button>
        <form onSubmit={handleSubmit} className="flex mb-2 sm:mb-0">
          <input
            className="text-black px-4 sm:px-8 rounded mr-4 ml-4"
            type="text"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            placeholder="Enter a city name"
            required
          />
          <button
            className="bg-custom-blue2 hover:bg-custom-blue4 text-white text-sm sm:text-base font-bold py-2 px-4 rounded"
            type="submit"
          >
            Add City
          </button>
        </form>
      </div>
      <div className="sticky top-36 sm:top-20 bg-white">
        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="warning">{error}</Alert>}
        {fetchError && <Alert severity="error">{fetchError}</Alert>}
      </div>
    </>
  );
}

export default Header;
