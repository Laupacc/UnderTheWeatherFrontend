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
          "https://weatherapp-backend-umber.vercel.app/weather"
        );
        const data = await response.json();
        if (data.weather) {
          const formattedCities = data.weather.map((city) => ({
            ...city,
            sunrise: new Date(city.sunrise * 1000).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            sunset: new Date(city.sunset * 1000).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
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

  // Get forecast data for a city
  const fetchForecast = async (cityName) => {
    try {
      const response = await fetch(
        `https://weatherapp-backend-umber.vercel.app/weather/forecast/${cityName}`
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

  return (
    <>
      {typeof cityNames !== "undefined" || cityNames.length !== 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-3 bg-gray-200">
          {cityNames.map((city) => (
            <div
              key={city.cityName}
              className="bg-gradient-to-br from-lime-100 to-sky-300 rounded-lg shadow-xl m-4 p-6 w-auto flex flex-col justify-around items-center text-center text-gray-800 "
            >
              <div className="flex flex-col items-center justify-center">
                <Typography
                  variant="h4"
                  align="center"
                  gutterBottom
                  className="text-slate-600"
                >
                  {city.cityName
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </Typography>
                <div className="flex justify-between items-center mb-5">
                  <div className="flex flex-col justify-center items-center">
                    <div className="flex">
                      <img
                        src="images/thermometer.png"
                        alt="Temperature"
                        className="w-8 h-8"
                      />
                      <Typography variant="h4" align="center" gutterBottom>
                        {Math.round(city.temp * 2) / 2}°C
                      </Typography>
                    </div>
                    <Typography variant="body1" align="center" gutterBottom>
                      Feels like: {Math.round(city.feels_like * 2) / 2}°C
                    </Typography>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <img
                      className="w-16 m-3"
                      src={`images/${city.icon}.png`}
                      alt="Weather Icon"
                    />
                    <Typography variant="body1" align="center" gutterBottom>
                      {city.description
                        ? city.description.charAt(0).toUpperCase() +
                          city.description.slice(1)
                        : "Description Not Available"}
                    </Typography>
                  </div>
                </div>

                <div className="flex justify-center items-center p-2 m-2">
                  <div className="flex flex-col justify-center items-center">
                    <Typography variant="body1" align="center" gutterBottom>
                      {Math.round(city.tempMin * 2) / 2}°C
                    </Typography>
                    <img
                      src="images/thermometer_down.png"
                      alt="Temperature"
                      className="w-8 h-8"
                    />
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <Typography variant="body1" align="center" gutterBottom>
                      {Math.round(city.tempMax * 2) / 2}°C
                    </Typography>
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
                  <Typography variant="body1" align="center" gutterBottom>
                    Humidity: {city.humidity}%
                  </Typography>
                </div>
                <div className="flex justify-center items-center m-2">
                  <img
                    src="images/windsock.png"
                    alt="Wind"
                    className="w-8 h-8"
                  />
                  <Typography variant="body1" align="center" gutterBottom>
                    Wind: {city.wind} m/s
                  </Typography>
                </div>
                <Typography variant="body1" align="center" gutterBottom>
                  Clouds: {city.clouds}%
                </Typography>
                <Typography variant="body1" align="center" gutterBottom>
                  Rain: {city.rain} mm
                </Typography>
                <Typography variant="body1" align="center" gutterBottom>
                  Snow: {city.snow} mm
                </Typography>
              </div>
              <div className="flex justify-center items-center m-2 p-2">
                <div className="flex flex-col justify-center items-center m-2">
                  <img
                    src="images/sunrise.png"
                    alt="Sunrise"
                    className="w-8 h-8"
                  />
                  <Typography variant="body1" align="center" gutterBottom>
                    {city.sunrise}
                  </Typography>
                </div>
                <div className="flex flex-col justify-center items-center m-2">
                  <img
                    src="images/sunset.png"
                    alt="Sunset"
                    className="w-8 h-8"
                  />
                  <Typography variant="body1" align="center" gutterBottom>
                    {city.sunset}
                  </Typography>
                </div>
              </div>

              <button onClick={() => handleForecast(city.cityName)}>
                View Forecast
              </button>
              <button
                className="mt-8 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:bg-red-600"
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
            overflow: "auto",
            width: {
              xs: "65%", // For mobile
              sm: "75%", // For desktop
            },
            height: {
              xs: "75%", // For mobile
              sm: "52%", // For desktop
            },
          }}
        >
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
          {selectedDayForecast && (
            <div className="flex flex-wrap sm:flex-nowrap justify-center items-center">
              {selectedDayForecast.map((forecast) => (
                <div
                  key={forecast.dt}
                  className="flex flex-col justify-between items-center m-3 p-3 bg-gradient-to-br from-emerald-100 to-sky-300 rounded-lg shadow-xl"
                  style={{
                    minWidth: "7rem",
                    maxWidth: "7rem",
                    minHeight: "15rem",
                    maxHeight: "15rem",
                  }}
                >
                  <Typography
                    variant="h6"
                    align="center"
                    fontWeight={600}
                    className="text-gray-600"
                  >
                    {forecast.dt_txt.split(" ")[1].slice(0, 5)}
                  </Typography>
                  <img
                    src={`images/${forecast.weather[0].icon}.png`}
                    alt="Weather Icon"
                    className="w-12 m-3 sm:w-16"
                  />
                  <Typography
                    variant="h5"
                    align="center"
                    fontWeight={600}
                    gutterBottom
                    className="text-blue-700"
               
                  >
                    {Math.round(forecast.main.temp * 2) / 2}°C
                  </Typography>
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
