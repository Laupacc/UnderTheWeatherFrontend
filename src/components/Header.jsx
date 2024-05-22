import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
  addCity,
  setUnitTemp,
  setSortCriteria,
  setSortOrder,
} from "../reducers/city.js";
import Alert from "@mui/material/Alert";
import { Switch } from "@headlessui/react";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "lodash.debounce";
import { Popover } from "@mui/material";
import { TiSortAlphabeticallyOutline } from "react-icons/ti";
import { GiWindsock } from "react-icons/gi";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import {
  FaTemperatureHigh,
  FaTemperatureLow,
  FaCloudRain,
  FaRegSnowflake,
} from "react-icons/fa6";
import { WiHumidity } from "react-icons/wi";
import { BsCloudsFill } from "react-icons/bs";

function Header({ props }) {
  const dispatch = useDispatch();
  const unit = useSelector((state) => state.city.unit);
  const cities = useSelector((state) => state.city.cities);

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

  const autocompleteRef = useRef(null);

  // Get cities from API for autocomplete feature
  const fetchCities = useCallback(
    debounce(async (query) => {
      if (query.length < 3) return;
      try {
        const response = await fetch(
          `https://under-the-weather-backend.vercel.app/cityautocomplete?query=${query}`
        );
        const data = await response.json();
        if (data.result) {
          setOptions(data.cities);
        } else {
          setFetchError(data.error);
        }
      } catch {
        setFetchError("An error occurred while fetching the city names");
      }
    }, 300),
    []
  );

  // Handle city change from autocomplete
  const handleCityChange = (event, value) => {
    if (value) {
      setCityName(value.name);
    }
  };

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
          setCityName("");
          autocompleteRef.current.value = "";
        } else {
          setError("This city is already in your list");
          setSuccess("");
          setFetchError("");
          setCityName("");
          autocompleteRef.current.value = "";
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

  // Handle unit change from switch
  const handleUnitChange = () => {
    const newUnit = enabled ? "Celsius" : "Fahrenheit";
    setEnabled(!enabled);
    dispatch(setUnitTemp(newUnit));
  };

  // Memoize options to prevent unnecessary re-renders
  const memoizedOptions = useMemo(() => options, [options]);

  // Popover sort
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const [selectedSort, setSelectedSort] = useState("");

  const handleSort = (criteria, order) => {
    dispatch(setSortCriteria(criteria));
    dispatch(setSortOrder(order));
    setAnchorEl(null);
    setSelectedSort(`${criteria}-${order}`);
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
              enabled ? "bg-red-600" : "bg-red-600"
            } transition`}
          >
            <span
              className={`${
                enabled ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
          <span className="text-white text-lg ml-2">°F</span>
        </div>

        <button
          className="bg-custom-blue2 hover:bg-custom-blue4 text-white text-sm sm:text-base font-bold py-2 px-4 mb-3 sm:mb-0 rounded shadow-md shadow-gray-700"
          onClick={handleLocation}
        >
          Add Current Location
        </button>
        <form onSubmit={handleSubmit} className="flex mb-2 sm:mb-0">
          {/* <input
            className="text-black px-4 sm:px-8 rounded mr-4 ml-4"
            type="text"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            placeholder="Enter a city name"
            required
          /> */}
          <Autocomplete
            sx={{
              width: 230,
              height: "100%",
              marginRight: 2,
              marginLeft: 2,
              color: "bg-custom-blue2",
              backgroundColor: "#fff",
              borderRadius: 1,
            }}
            freeSolo
            ref={autocompleteRef}
            id="city"
            options={memoizedOptions}
            getOptionLabel={(option) => `${option.name} (${option.iso2})`}
            onInputChange={(e, value) => fetchCities(value)}
            onChange={handleCityChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Enter a city name"
                required
              />
            )}
          />
          <button
            className="bg-custom-blue2 hover:bg-custom-blue4 text-white text-sm sm:text-base font-bold py-2 px-4 rounded mr-4 shadow-md shadow-gray-700"
            type="submit"
          >
            Add City
          </button>
        </form>
        <button
          aria-describedby={open ? "sort-popover" : undefined}
          className="bg-custom-blue2 hover:bg-custom-blue4 text-white text-sm sm:text-base font-bold py-2 px-4 rounded shadow-md shadow-gray-700"
          onClick={handlePopoverOpen}
        >
          Sort
        </button>
        <Popover
          id="sort-popover"
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <div className="flex flex-col p-4">
            <button
              onClick={() => handleSort("lastAdded")}
              className={`${
                selectedSort === "lastAdded"
                  ? "p-1 bg-sky-800 rounded-lg text-white"
                  : "p-1 text-sky-800 hover:bg-sky-800 hover:text-white rounded-lg"
              }`}
            >
              Last Added
            </button>
            <button
              onClick={() => handleSort("firstAdded")}
              className={`${
                selectedSort === "firstAdded"
                  ? "p-1 bg-sky-800 rounded-lg text-white"
                  : "p-1 text-sky-800 hover:bg-sky-800 hover:text-white rounded-lg"
              }`}
            >
              First Added
            </button>
            <button
              onClick={() => handleSort("alphabetical", "asc")}
              className={`${
                selectedSort === "alphabetical-asc"
                  ? "p-1 bg-sky-800 rounded-lg text-white"
                  : "p-1 text-sky-800 hover:bg-sky-800 hover:text-white rounded-lg"
              }`}
            >
              <div className="flex justify-center items-center">
                City Name (A-Z)
                {/* <TiSortAlphabeticallyOutline size={20} />
                <MdKeyboardDoubleArrowUp size={20} /> */}
              </div>
            </button>
            <button
              onClick={() => handleSort("alphabetical", "desc")}
              className={`${
                selectedSort === "alphabetical-desc"
                  ? "p-1 bg-sky-800 rounded-lg text-white"
                  : "p-1 text-sky-800 hover:bg-sky-800 hover:text-white rounded-lg"
              }`}
            >
              <div className="flex justify-center items-center">
                City Name (Z-A)
                {/* <TiSortAlphabeticallyOutline size={40} />
                <MdKeyboardDoubleArrowDown size={40} /> */}
              </div>
            </button>
            <button
              onClick={() => handleSort("temperature", "asc")}
              className={`${
                selectedSort === "temperature-asc"
                  ? "p-1 bg-sky-800 rounded-lg text-white"
                  : "p-1 text-sky-800 hover:bg-sky-800 hover:text-white rounded-lg"
              }`}
            >
              <div className="flex justify-center items-center">
                <FaTemperatureHigh size={20} className="mr-2" />
                Temperature (Low to High)
                {/* <MdKeyboardDoubleArrowUp size={40} /> */}
              </div>
            </button>
            <button
              onClick={() => handleSort("temperature", "desc")}
              className={`${
                selectedSort === "temperature-desc"
                  ? "p-1 bg-sky-800 rounded-lg text-white"
                  : "p-1 text-sky-800 hover:bg-sky-800 hover:text-white rounded-lg"
              }`}
            >
              <div className="flex justify-center items-center">
                <FaTemperatureLow size={20} className="mr-2" />
                Temperature (High to Low)
                {/* <MdKeyboardDoubleArrowDown size={40} /> */}
              </div>
            </button>
            <button
              onClick={() => handleSort("wind", "asc")}
              className={`${
                selectedSort === "wind-asc"
                  ? "p-1 bg-sky-800 rounded-lg text-white"
                  : "p-1 text-sky-800 hover:bg-sky-800 hover:text-white rounded-lg"
              }`}
            >
              <div className="flex justify-center items-center">
                <GiWindsock size={26} className="mr-2" />
                Wind Speed (Low to High)
                {/* <MdKeyboardDoubleArrowUp size={40} /> */}
              </div>
            </button>
            <button
              onClick={() => handleSort("wind", "desc")}
              className={`${
                selectedSort === "wind-desc"
                  ? "p-1 bg-sky-800 rounded-lg text-white"
                  : "p-1 text-sky-800 hover:bg-sky-800 hover:text-white rounded-lg"
              }`}
            >
              <div className="flex justify-center items-center">
                <GiWindsock size={26} className="mr-2" />
                Wind Speed (High to Low)
                {/* <MdKeyboardDoubleArrowDown size={40} /> */}
              </div>
            </button>
            <button
              onClick={() => handleSort("humidity", "asc")}
              className={`${
                selectedSort === "humidity-asc"
                  ? "p-1 bg-sky-800 rounded-lg text-white"
                  : "p-1 text-sky-800 hover:bg-sky-800 hover:text-white rounded-lg"
              }`}
            >
              <div className="flex justify-center items-center">
                <WiHumidity size={28} className="mr-2" />
                Humidity (Low to High)
                {/* <MdKeyboardDoubleArrowUp size={40} /> */}
              </div>
            </button>
            <button
              onClick={() => handleSort("humidity", "desc")}
              className={`${
                selectedSort === "humidity-desc"
                  ? "p-1 bg-sky-800 rounded-lg text-white"
                  : "p-1 text-sky-800 hover:bg-sky-800 hover:text-white rounded-lg"
              }`}
            >
              <div className="flex justify-center items-center">
                <WiHumidity size={28} className="mr-2" />
                Humidity (High to Low)
                {/* <MdKeyboardDoubleArrowDown size={40} /> */}
              </div>
            </button>
            <button
              onClick={() => handleSort("clouds", "asc")}
              className={`${
                selectedSort === "clouds-asc"
                  ? "p-1 bg-sky-800 rounded-lg text-white"
                  : "p-1 text-sky-800 hover:bg-sky-800 hover:text-white rounded-lg"
              }`}
            >
              <div className="flex justify-center items-center">
                <BsCloudsFill size={20} className="mr-2" />
                Cloud coverage (Low to High)
                {/* <MdKeyboardDoubleArrowUp size={40} /> */}
              </div>
            </button>
            <button
              onClick={() => handleSort("clouds", "desc")}
              className={`${
                selectedSort === "clouds-desc"
                  ? "p-1 bg-sky-800 rounded-lg text-white"
                  : "p-1 text-sky-800 hover:bg-sky-800 hover:text-white rounded-lg"
              }`}
            >
              <div className="flex justify-center items-center">
                <BsCloudsFill size={20} className="mr-2" />
                Cloud coverage (High to Low)
                {/* <MdKeyboardDoubleArrowDown size={40} /> */}
              </div>
            </button>
            <button
              onClick={() => handleSort("rain", "asc")}
              className={`${
                selectedSort === "rain-asc"
                  ? "p-1 bg-sky-800 rounded-lg text-white"
                  : "p-1 text-sky-800 hover:bg-sky-800 hover:text-white rounded-lg"
              }`}
            >
              <div className="flex justify-center items-center">
                <FaCloudRain size={20} className="mr-2" />
                Rain Chance (Low to High)
                {/* <MdKeyboardDoubleArrowUp size={40} /> */}
              </div>
            </button>
            <button
              onClick={() => handleSort("rain", "desc")}
              className={`${
                selectedSort === "rain-desc"
                  ? "p-1 bg-sky-800 rounded-lg text-white"
                  : "p-1 text-sky-800 hover:bg-sky-800 hover:text-white rounded-lg"
              }`}
            >
              <div className="flex justify-center items-center">
                <FaCloudRain size={20} className="mr-2" />
                Rain Chance (High to Low)
                {/* <MdKeyboardDoubleArrowDown size={40} /> */}
              </div>
            </button>
            <button
              onClick={() => handleSort("snow", "asc")}
              className={`${
                selectedSort === "snow-asc"
                  ? "p-1 bg-sky-800 rounded-lg text-white"
                  : "p-1 text-sky-800 hover:bg-sky-800 hover:text-white rounded-lg"
              }`}
            >
              <div className="flex justify-center items-center">
                <FaRegSnowflake size={20} className="mr-2" />
                Snow Chance (Low to High)
                {/* <MdKeyboardDoubleArrowUp size={40} /> */}
              </div>
            </button>
            <button
              onClick={() => handleSort("snow", "desc")}
              className={`${
                selectedSort === "snow-desc"
                  ? "p-1 bg-sky-800 rounded-lg text-white"
                  : "p-1 text-sky-800 hover:bg-sky-800 hover:text-white rounded-lg"
              }`}
            >
              <div className="flex justify-center items-center">
                <FaRegSnowflake size={20} className="mr-2" />
                Snow Chance (High to Low)
                {/* <MdKeyboardDoubleArrowDown size={40} /> */}
              </div>
            </button>
          </div>
        </Popover>
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
