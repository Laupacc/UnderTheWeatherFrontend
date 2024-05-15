import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCity, removeCity } from "../reducers/city.js";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

function City() {
  const dispatch = useDispatch();
  const cities = useSelector((state) => state.city);

  const [cityNames, setCityNames] = useState([]);
  const [forecastData, setForecastData] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDayForecast, setSelectedDayForecast] = useState(null);
  const [selectedButton, setSelectedButton] = useState(0);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          "https://under-the-weather-backend.vercel.app/weather"
        );
        const data = await response.json();
        if (data.weather) {
          const formattedCities = data.weather.map((city) => ({
            ...city,
            sunrise: new Date(city.sunrise * 1000).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
            sunset: new Date(city.sunset * 1000).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
          }));
          setCityNames(formattedCities.reverse()); // Reverse the order of cities
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, [cities]);

  // Delete city from the backend
  const deleteCity = async (cityName) => {
    try {
      const response = await fetch(
        `https://under-the-weather-backend.vercel.app/weather/${cityName}`,
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

  // Get forecast data for a city
  const fetchForecast = async (cityName) => {
    try {
      const response = await fetch(
        `https://under-the-weather-backend.vercel.app/weather/forecast/${cityName}`
      );
      const data = await response.json();
      if (data.weather.list) {
        setForecastData(data.weather.list);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching forecast:", error);
    }
  };

  // Handle forecast data
  const handleForecast = (cityName) => {
    setSelectedCity(cityName);
    fetchForecast(cityName);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setForecastData(null);
    setSelectedButton(0);
  };

  // Handle day click inside the modal
  const handleDayClick = (dailyForecast, index) => {
    setSelectedDayForecast(dailyForecast);
    setSelectedButton(index);
  };

  // Format date to display in the modal
  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) {
      suffix = "st";
    } else if (day === 2 || day === 22) {
      suffix = "nd";
    } else if (day === 3 || day === 23) {
      suffix = "rd";
    }
    const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
    const month = date.toLocaleDateString("en-US", { month: "long" });
    return `${weekday}, ${month} ${day}${suffix}`;
  };

  // Generate Google search link
  const generateGoogleSearchLink = (cityName) => {
    return `https://www.google.com/search?q=${encodeURIComponent(cityName)}`;
  };

  return (
    <>
      {typeof cityNames !== "undefined" || cityNames.length !== 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-3 bg-gray-200">
          {cityNames.map((city) => (
            <div
              key={city.cityName}
              className="bg-gradient-to-br from-lime-100 to-sky-300 rounded-lg shadow-xl m-4 p-6 w-auto flex flex-col justify-between items-center text-center text-gray-800 "
            >
              {/* City Name */}
              <div className="flex flex-col items-center justify-center">
                <a
                  href={generateGoogleSearchLink(city.cityName)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Typography
                    variant="h4"
                    align="center"
                    gutterBottom
                    className="text-slate-600"
                  >
                    {city.cityName
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </Typography>
                </a>

                {/* Temperature */}
                <div className="flex flex-col justify-center items-center">
                  <div className="flex justify-center items-center">
                    {/* <img
                      src="images/thermometer.png"
                      alt="Temperature"
                      className="w-8 h-8"
                    /> */}
                    <Typography
                      variant="h4"
                      align="center"
                      className="text-blue-700"
                    >
                      {Math.round(city.temp * 2) / 2}°
                    </Typography>
                  </div>
                  <Typography
                    variant="body1"
                    align="center"
                    gutterBottom
                    className="text-slate-600"
                  >
                    Real feel {Math.round(city.feels_like * 2) / 2}°
                  </Typography>
                </div>

                {/* Weather Description */}
                <div className="flex flex-col justify-center items-center">
                  <img
                    className="w-20 m-1"
                    src={`images/${city.icon}.png`}
                    alt="Weather Icon"
                  />
                  <Typography
                    variant="h6"
                    align="center"
                    className="text-slate-600"
                  >
                    {city.description
                      ? city.description.charAt(0).toUpperCase() +
                        city.description.slice(1)
                      : "Description Not Available"}
                  </Typography>
                </div>

                {/* View Forecast Button */}
                <button
                  className="mt-2 mb-4 px-3 py-1 text-lg border-2 border-blue-500 rounded bg-blue-500 text-white hover:text-blue-500 hover:bg-transparent"
                  onClick={() => handleForecast(city.cityName)}
                >
                  5-Day Forecast
                </button>

                <div className="border-2 rounded-lg px-3">
                  {/* Min and Max Temperature */}
                  <div className="flex justify-center items-center">
                    <div className="flex flex-col justify-center items-center my-2 mx-4">
                      <img
                        src="images/thermometerdown1.png"
                        alt="Temperature"
                        className="w-12 h-12"
                      />
                      <Typography
                        variant="h6"
                        align="center"
                        gutterBottom
                        className="text-slate-600"
                      >
                        {Math.round(city.tempMin * 2) / 2}°
                      </Typography>
                    </div>
                    <div className="flex flex-col justify-center items-center my-2 mx-4">
                      <img
                        src="images/thermometerup1.png"
                        alt="Temperature"
                        className="w-12 h-12"
                      />
                      <Typography
                        variant="h6"
                        align="center"
                        gutterBottom
                        className="text-slate-600"
                      >
                        {Math.round(city.tempMax * 2) / 2}°
                      </Typography>
                    </div>
                  </div>
                  {/* Humidity, Wind */}
                  <div className="flex justify-center items-center">
                    <div className="flex flex-col justify-center items-center my-2 mx-4">
                      <img
                        src="images/hygrometer1.png"
                        alt="Humidity"
                        className="w-12 h-12"
                      />
                      <Typography
                        variant="h6"
                        align="center"
                        gutterBottom
                        className="text-slate-600"
                      >
                        {city.humidity}%
                      </Typography>
                    </div>
                    <div className="flex flex-col justify-center items-center my-2 mx-4">
                      <img
                        src="images/windsock1.png"
                        alt="Wind"
                        className="w-12 h-12"
                      />
                      <Typography
                        variant="h6"
                        align="center"
                        gutterBottom
                        className="text-slate-600"
                      >
                        {city.wind} m/s
                      </Typography>
                    </div>
                  </div>
                  {/* Clouds, Rain, Snow  */}
                  <div className="flex justify-center items-center ">
                    <div className="flex flex-col justify-center items-center my-2 mx-4">
                      <img
                        src="images/cloud1.png"
                        alt="Clouds"
                        className="w-12 h-12"
                      />
                      <Typography
                        variant="h6"
                        align="center"
                        gutterBottom
                        className="text-slate-600"
                      >
                        {city.clouds}%
                      </Typography>
                    </div>
                    <div className="flex flex-col  justify-center items-center my-2 mx-4">
                      <img
                        src="images/rain1.png"
                        alt="Rain"
                        className="w-12 h-12"
                      />
                      <Typography
                        variant="h6"
                        align="center"
                        gutterBottom
                        className="text-slate-600"
                      >
                        {city.rain} mm
                      </Typography>
                    </div>
                    <div className="flex flex-col justify-center items-center my-2 mx-4">
                      <img
                        src="images/snow1.png"
                        alt="Snow"
                        className="w-12 h-12"
                      />
                      <Typography
                        variant="h6"
                        align="center"
                        gutterBottom
                        className="text-slate-600"
                      >
                        {city.snow} mm
                      </Typography>
                    </div>
                  </div>

                  {/* Sunrise and Sunset */}
                  <div className="flex justify-center items-center">
                    <div className="flex flex-col justify-center items-center my-2 mx-4">
                      <img
                        src="images/sunrise1.png"
                        alt="Sunrise"
                        className="w-12 h-12"
                      />
                      <Typography
                        variant="h6"
                        align="center"
                        gutterBottom
                        className="text-slate-600"
                      >
                        {city.sunrise}
                      </Typography>
                    </div>
                    <div className="flex flex-col justify-center items-center my-2 mx-4">
                      <img
                        src="images/sunset1.png"
                        alt="Sunset"
                        className="w-12 h-12"
                      />
                      <Typography
                        variant="h6"
                        align="center"
                        gutterBottom
                        className="text-slate-600"
                      >
                        {city.sunset}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delete City Button */}
              <button
                className="mt-4 px-3 py-1 text-lg border-2 border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white"
                onClick={() => deleteCity(city.cityName)}
              >
                Delete City
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center p-4">
          <p className="text-2xl">No cities added yet</p>
        </div>
      )}

      {/* Modal for 5-day forecast */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="forecast"
        aria-describedby="5dayforecast"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "grey.200",
            border: "2px solid #000",
            borderRadius: 10,
            boxShadow: 24,
            p: 4,
            overflow: "scroll",
            width: {
              xs: "85%",
              sm: "80%",
              md: "85%",
              xl: "75%",
            },
            height: {
              xs: "85%",
              sm: "90%",
              md: "65%",
              xl: "60%",
            },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* City name and subtitle */}
          <Typography variant="h4" align="center" gutterBottom>
            {selectedCity &&
              selectedCity
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}{" "}
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            5-Day Forecast
          </Typography>

          {/* Buttons for each day */}
          <div className="flex flex-wrap justify-center mb-4">
            {forecastData &&
              Object.values(
                forecastData.reduce((acc, forecast) => {
                  const date = forecast.dt_txt.split(" ")[0]; // Extracting date from datetime string
                  if (!acc[date]) {
                    acc[date] = [];
                  }
                  acc[date].push(forecast);
                  return acc;
                }, {})
              ).map((dailyForecast, index) => (
                <button
                  key={index}
                  className={`m-3 ${
                    index === selectedButton
                      ? "bg-custom-blue text-white font-medium px-4 py-2 rounded-lg focus:outline-none focus:bg-custom-blue focus:text-white"
                      : "bg-white text-black font-medium px-4 py-2 rounded-lg hover:bg-custom-blue hover:text-white focus:outline-none focus:bg-custom-blue focus:text-white"
                  }`}
                  onClick={() => handleDayClick(dailyForecast, index)}
                >
                  {getFormattedDate(dailyForecast[0].dt_txt.split(" ")[0])}
                </button>
              ))}
          </div>

          {/* Forecast data for the selected day */}
          {selectedDayForecast && (
            <div className="flex flex-wrap md:flex-nowrap justify-center items-center">
              {selectedDayForecast.map((forecast) => (
                <div
                  key={forecast.dt}
                  className="flex flex-col justify-between items-center m-3 p-3 bg-gradient-to-br from-emerald-100 to-sky-300 rounded-lg shadow-xl"
                  style={{
                    minWidth: "4rem",
                    maxWidth: "7rem",
                    minHeight: "15rem",
                    maxHeight: "15rem",
                  }}
                >
                  {/* Time */}
                  <Typography
                    variant="h6"
                    align="center"
                    fontWeight={600}
                    className="text-gray-600"
                  >
                    {forecast.dt_txt.split(" ")[1].slice(0, 5)}
                  </Typography>

                  {/* Weather Icon */}
                  <img
                    src={`images/${forecast.weather[0].icon}.png`}
                    alt="Weather Icon"
                    className="w-12 m-3 sm:w-16"
                  />

                  {/* Temperature */}
                  <Typography
                    variant="h5"
                    align="center"
                    gutterBottom
                    className="text-blue-700"
                  >
                    {Math.round(forecast.main.temp * 2) / 2}°C
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body1"
                    align="center"
                    className="text-gray-600"
                  >
                    {forecast.weather[0].description.charAt(0).toUpperCase() +
                      forecast.weather[0].description.slice(1)}
                  </Typography>
                </div>
              ))}
            </div>
          )}
        </Box>
      </Modal>
    </>
  );
}

export default City;
