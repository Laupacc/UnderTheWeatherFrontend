import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import Login from "./Login.jsx";
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
import Paper from "@mui/material/Paper";
import debounce from "lodash.debounce";
import { Popover } from "@mui/material";
import { GiWindsock } from "react-icons/gi";
import { IoCalendarNumberOutline } from "react-icons/io5";
import {
  LiaSortAlphaDownSolid,
  LiaSortAlphaDownAltSolid,
} from "react-icons/lia";
import {
  FaTemperatureHigh,
  FaTemperatureLow,
  FaCloudRain,
  FaRegSnowflake,
} from "react-icons/fa6";
import { WiHumidity } from "react-icons/wi";
import { BsCloudsFill } from "react-icons/bs";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";

function Header() {
  const dispatch = useDispatch();

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

  // Memoize options to prevent unnecessary re-renders
  const memoizedOptions = useMemo(() => options, [options]);

  // Sort popover
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Sort selection in popover
  const [selectedSort, setSelectedSort] = useState("");

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

  // Handle unit change from switch
  const handleUnitChange = () => {
    const newUnit = enabled ? "Celsius" : "Fahrenheit";
    setEnabled(!enabled);
    dispatch(setUnitTemp(newUnit));
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  // const handleSort = (criteria, order) => {
  //   dispatch(setSortCriteria(criteria));
  //   dispatch(setSortOrder(order));
  //   setAnchorEl(null);
  //   setSelectedSort(`${criteria}-${order}`);
  // };

  const handleSort = (event, criteria, order = null) => {
    if (event.target.checked) {
      dispatch(setSortCriteria(criteria));
      if (order) {
        dispatch(setSortOrder(order));
        setSelectedSort(`${criteria}-${order}`);
      } else {
        setSelectedSort(criteria);
      }
      setAnchorEl(null);
    }
  };

  return (
    <>
      {/* Header background and title */}
      <div
        className="px-4 py-2 rounded-b-3xl text-white sticky top-0 flex flex-col justify-center items-center"
        style={{
          background:
            "radial-gradient(circle, rgba(28,181,224,1) 0%, rgba(0,0,70,1) 100%)",
        }}
      >
        <div className="flex justify-between items-center w-full mb-2">
          <h1 className="font-UndertheWeather text-4xl sm:text-6xl md:text-7xl text-gray-200">
            Under the Weather
          </h1>
          <Login />
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center sm:justify-evenly sm:w-full">
          {/* Add current location */}
          <button
            className="bg-custom-blue6 hover:bg-custom-blue7 text-white hover:text-slate-700  text-sm font-bold py-2 px-4 mb-3 rounded-full shadow-md shadow-gray-700 h-8 sm:h-11 md:h-8 flex justify-center items-center"
            onClick={handleLocation}
          >
            Add Current Location
          </button>
          {/* Add city form */}
          <form
            onSubmit={handleSubmit}
            className="mb-2 flex justify-center items-center"
          >
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
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: { xs: 200, sm: 170, md: 200, lg: 220, xl: 240 },
                height: 34,
                marginRight: 2,
                marginLeft: 2,
                color: "bg-custom-blue2",
                backgroundColor: "rgba(241, 245, 249, 0.5)",
                borderRadius: 10,
              }}
              freeSolo
              id="city"
              clearOnEscape
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
              renderOption={(props, option) => {
                return (
                  <li {...props}>
                    <div className="flex items-center">
                      <span className="text-sky-800 ml-1">{option.name}</span>
                      <span className="text-gray-400 ml-2 mr-1">
                        {option.iso2}
                      </span>
                    </div>
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Enter a city name"
                  required
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                />
              )}
              PaperComponent={({ children }) => (
                <Paper
                  sx={{
                    backgroundColor: "#F1F5F9",
                    borderRadius: "2rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {children}
                </Paper>
              )}
            />
            <button
              className="bg-custom-blue6 hover:bg-custom-blue7 text-white hover:text-slate-700 text-sm font-bold py-2 px-4 rounded-full shadow-md shadow-gray-700 h-8 sm:h-11 md:h-8 flex justify-center items-center"
              type="submit"
            >
              Add City
            </button>
          </form>
          <div className="flex justify-center items-center mb-2">
            {/* Switch between Celsius and Fahrenheit */}
            <div className="flex items-center mr-2 sm:mx-6 xl:mx-2 ">
              <span className="text-white text-lg mr-2">°C</span>
              <Switch
                checked={enabled}
                onChange={handleUnitChange}
                className={`group inline-flex h-6 w-11 items-center rounded-full ${
                  enabled ? "bg-orange-500" : "bg-red-600"
                } transition`}
              >
                <span
                  className={`${
                    enabled ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-slate-100 transition`}
                />
              </Switch>
              <span className="text-slate-100 text-lg ml-2">°F</span>
            </div>
            {/* Sort button and popover */}
            <button
              aria-describedby={open ? "sort-popover" : undefined}
              className="ml-2 sm:ml-0 bg-custom-blue6 hover:bg-custom-blue7 text-white hover:text-slate-700 text-sm font-bold py-2 px-4 rounded-full shadow-md shadow-gray-700 h-8 sm:h-11 md:h-8 flex justify-center items-center"
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
              PaperProps={{
                style: {
                  backgroundColor: "#E2E8F0",
                  borderRadius: "1rem",
                },
              }}
            >
              {/* <div className="flex flex-col p-4">
                <button
                  onClick={() => handleSort("lastAdded")}
                  className={`${
                    selectedSort === "lastAdded"
                      ? "p-1 bg-sky-800 rounded-lg text-white"
                      : "p-1 text-sky-800 hover:bg-sky-800 hover:text-white rounded-lg"
                  }`}
                >
                  <div className="flex justify-center items-center">
                    <IoCalendarNumberOutline size={20} className="mr-2" />
                    Last Added
                  </div>
                </button>
                <button
                  onClick={() => handleSort("firstAdded")}
                  className={`${
                    selectedSort === "firstAdded"
                      ? "p-1 bg-sky-800 rounded-lg text-white"
                      : "p-1 text-sky-800 hover:bg-sky-800 hover:text-white rounded-lg"
                  }`}
                >
                  <div className="flex justify-center items-center">
                    <IoCalendarNumberOutline size={20} className="mr-2" />
                    First Added
                  </div>
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
                    <LiaSortAlphaDownSolid size={20} className="mr-2" />
                    City Name (A-Z)
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
                    <LiaSortAlphaDownAltSolid size={20} className="mr-2" />
                    City Name (Z-A)
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
                  </div>
                </button>
              </div> */}
              <FormGroup className="flex flex-col p-4">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedSort === "lastAdded"}
                      onChange={(e) => handleSort(e, "lastAdded")}
                      sx={{
                        "&.Mui-checked": {
                          color: "orange",
                        },
                      }}
                    />
                  }
                  label={
                    <div className="flex justify-center items-center">
                      <IoCalendarNumberOutline size={20} className="mr-2" />
                      Last Added
                    </div>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedSort === "firstAdded"}
                      onChange={(e) => handleSort(e, "firstAdded")}
                      sx={{
                        "&.Mui-checked": {
                          color: "orange",
                        },
                      }}
                    />
                  }
                  label={
                    <div className="flex justify-center items-center">
                      <IoCalendarNumberOutline size={20} className="mr-2" />
                      First Added
                    </div>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedSort === "alphabetical-asc"}
                      onChange={(e) => handleSort(e, "alphabetical", "asc")}
                      sx={{
                        "&.Mui-checked": {
                          color: "orange",
                        },
                      }}
                    />
                  }
                  label={
                    <div className="flex justify-center items-center">
                      <LiaSortAlphaDownSolid size={20} className="mr-2" />
                      City Name (A-Z)
                    </div>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedSort === "alphabetical-desc"}
                      onChange={(e) => handleSort(e, "alphabetical", "desc")}
                      sx={{
                        "&.Mui-checked": {
                          color: "orange",
                        },
                      }}
                    />
                  }
                  label={
                    <div className="flex justify-center items-center">
                      <LiaSortAlphaDownAltSolid size={20} className="mr-2" />
                      City Name (Z-A)
                    </div>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedSort === "temperature-asc"}
                      onChange={(e) => handleSort(e, "temperature", "asc")}
                      sx={{
                        "&.Mui-checked": {
                          color: "orange",
                        },
                      }}
                    />
                  }
                  label={
                    <div className="flex justify-center items-center">
                      <FaTemperatureHigh size={20} className="mr-2" />
                      Temperature (Low to High)
                    </div>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedSort === "temperature-desc"}
                      onChange={(e) => handleSort(e, "temperature", "desc")}
                      sx={{
                        "&.Mui-checked": {
                          color: "orange",
                        },
                      }}
                    />
                  }
                  label={
                    <div className="flex justify-center items-center">
                      <FaTemperatureLow size={20} className="mr-2" />
                      Temperature (High to Low)
                    </div>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedSort === "wind-asc"}
                      onChange={(e) => handleSort(e, "wind", "asc")}
                      sx={{
                        "&.Mui-checked": {
                          color: "orange",
                        },
                      }}
                    />
                  }
                  label={
                    <div className="flex justify-center items-center">
                      <GiWindsock size={26} className="mr-2" />
                      Wind Speed (Low to High)
                    </div>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedSort === "wind-desc"}
                      onChange={(e) => handleSort(e, "wind", "desc")}
                      sx={{
                        "&.Mui-checked": {
                          color: "orange",
                        },
                      }}
                    />
                  }
                  label={
                    <div className="flex justify-center items-center">
                      <GiWindsock size={26} className="mr-2" />
                      Wind Speed (High to Low)
                    </div>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedSort === "humidity-asc"}
                      onChange={(e) => handleSort(e, "humidity", "asc")}
                      sx={{
                        "&.Mui-checked": {
                          color: "orange",
                        },
                      }}
                    />
                  }
                  label={
                    <div className="flex justify-center items-center">
                      <WiHumidity size={28} className="mr-2" />
                      Humidity (Low to High)
                    </div>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedSort === "humidity-desc"}
                      onChange={(e) => handleSort(e, "humidity", "desc")}
                      sx={{
                        "&.Mui-checked": {
                          color: "orange",
                        },
                      }}
                    />
                  }
                  label={
                    <div className="flex justify-center items-center">
                      <WiHumidity size={28} className="mr-2" />
                      Humidity (High to Low)
                    </div>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedSort === "clouds-asc"}
                      onChange={(e) => handleSort(e, "clouds", "asc")}
                      sx={{
                        "&.Mui-checked": {
                          color: "orange",
                        },
                      }}
                    />
                  }
                  label={
                    <div className="flex justify-center items-center">
                      <BsCloudsFill size={20} className="mr-2" />
                      Cloud coverage (Low to High)
                    </div>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedSort === "clouds-desc"}
                      onChange={(e) => handleSort(e, "clouds", "desc")}
                      sx={{
                        "&.Mui-checked": {
                          color: "orange",
                        },
                      }}
                    />
                  }
                  label={
                    <div className="flex justify-center items-center">
                      <BsCloudsFill size={20} className="mr-2" />
                      Cloud coverage (High to Low)
                    </div>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedSort === "rain-asc"}
                      onChange={(e) => handleSort(e, "rain", "asc")}
                      sx={{
                        "&.Mui-checked": {
                          color: "orange",
                        },
                      }}
                    />
                  }
                  label={
                    <div className="flex justify-center items-center">
                      <FaCloudRain size={20} className="mr-2" />
                      Rain Chance (Low to High)
                    </div>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedSort === "rain-desc"}
                      onChange={(e) => handleSort(e, "rain", "desc")}
                      sx={{
                        "&.Mui-checked": {
                          color: "orange",
                        },
                      }}
                    />
                  }
                  label={
                    <div className="flex justify-center items-center">
                      <FaCloudRain size={20} className="mr-2" />
                      Rain Chance (High to Low)
                    </div>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedSort === "snow-asc"}
                      onChange={(e) => handleSort(e, "snow", "asc")}
                      sx={{
                        "&.Mui-checked": {
                          color: "orange",
                        },
                      }}
                    />
                  }
                  label={
                    <div className="flex justify-center items-center">
                      <FaRegSnowflake size={20} className="mr-2" />
                      Snow Chance (Low to High)
                    </div>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedSort === "snow-desc"}
                      onChange={(e) => handleSort(e, "snow", "desc")}
                      sx={{
                        "&.Mui-checked": {
                          color: "orange",
                        },
                      }}
                    />
                  }
                  label={
                    <div className="flex justify-center items-center">
                      <FaRegSnowflake size={20} className="mr-2" />
                      Snow Chance (High to Low)
                    </div>
                  }
                />
              </FormGroup>
            </Popover>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="sticky top-52 sm:top-20 bg-white">
        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="warning">{error}</Alert>}
        {fetchError && <Alert severity="error">{fetchError}</Alert>}
      </div>
    </>
  );
}

export default Header;
