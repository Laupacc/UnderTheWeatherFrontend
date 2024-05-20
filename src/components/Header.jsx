import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback, useEffect } from "react";
import { addCity, setUnitTemp } from "../reducers/city.js";
import Alert from "@mui/material/Alert";
import { Switch } from "@headlessui/react";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { DebounceInput } from "react-debounce-input";
import debounce from "lodash.debounce";

function Header() {
  const dispatch = useDispatch();
  const unit = useSelector((state) => state.city.unit);

  // City name
  const [cityName, setCityName] = useState("");

  // Alerts
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fetchError, setFetchError] = useState("");

  // Current location coordinates
  const [lat, setLat] = useState([]);
  const [lon, setLon] = useState([]);

  // Toggle switch
  const [enabled, setEnabled] = useState(false);

  // Autocomplete options
  const [options, setOptions] = useState([]);

  // Get all cities from API for autocomplete feature
  useEffect(() => {
    fetch("https://under-the-weather-backend.vercel.app/cityautocomplete")
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setOptions(data.cities);
        } else {
          setFetchError(data.error);
        }
      })
      .catch((error) => {
        setFetchError("An error occurred while fetching the city names");
      });
  }, []);

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

  // Add current location to the database
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

  // Add city to the database
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
          // setCityName("");
        } else {
          setError("This city is already in your list");
          setSuccess("");
          setFetchError("");
          // setCityName("");
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

  const handleUnitChange = () => {
    const newUnit = enabled ? "Celsius" : "Fahrenheit";
    setEnabled(!enabled);
    dispatch(setUnitTemp(newUnit));
  };

  // Debounce the input change
  const debouncedSetCityName = useCallback(
    debounce((value) => setCityName(value), 500),
    []
  );

  const handleInputChange = (event, value) => {
    debouncedSetCityName(value);
  };

  return (
    <>
      <div className="px-4 py-2 bg-custom-blue5 text-white sticky top-0 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="font-UndertheWeather text-5xl lg:text-7xl text-gray-200 mb-2 sm:mb-0">
          Under the Weather
        </h1>

        <div className="flex items-center mb-2 sm:mx-6 xl:mx-2 ">
          <span className="text-white text-lg mr-2">°C</span>
          <Switch
            checked={enabled}
            onChange={handleUnitChange}
            className={`group inline-flex h-6 w-11 items-center rounded-full ${
              enabled ? "bg-sky-300" : "bg-sky-300"
            } transition`}
          >
            <span
              className={`${
                enabled ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-slate-500 transition`}
            />
          </Switch>
          <span className="text-white text-lg ml-2">°F</span>
        </div>

        <button
          className="bg-custom-blue2 hover:bg-custom-blue4 text-white text-sm sm:text-base font-bold py-2 px-4 mb-3 sm:mb-0 rounded"
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
          {/* <Autocomplete
            sx={{
              width: 250,
              marginRight: 10,
              marginLeft: 10,
              color: "#000",
              backgroundColor: "#fff",
              borderRadius: 1,
            }}
            freeSolo
            id="city"
            options={options}
            getOptionLabel={(option) => `${option.name} (${option.iso2})`}
            onInputChange={handleInputChange}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Enter a city name"
                required
                variant="outlined"
              />
            )}
          /> */}

          <button
            className="bg-custom-blue2 hover:bg-custom-blue4 text-white text-sm sm:text-base font-bold py-2 px-4 rounded mr-4"
            type="submit"
          >
            Add City
          </button>
        </form>
      </div>
      <div className="sticky top-52 sm:top-20 bg-white">
        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="warning">{error}</Alert>}
        {fetchError && <Alert severity="error">{fetchError}</Alert>}
      </div>
    </>
  );
}

export default Header;
