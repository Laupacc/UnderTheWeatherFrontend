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

  // Clear alerts after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setError("");
      setSuccess("");
      setFetchError("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [error, success, fetchError]);

  // Add city to the backend
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("https://weatherapp-backend-umber.vercel.app/weather/current", {
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
          setSuccess(`${data.weather.cityName} had been added to your list!`);
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
        console.error("Error:", error);
        setFetchError(
          "An error occurred while processing your request. Please verify the city name and try again."
        );
        setSuccess("");
        setError("");
      });
  };

  return (
    <>
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800 text-white">
        <form onSubmit={handleSubmit}>
          <input
            className="text-black"
            type="text"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            placeholder="Enter a city name"
          />
          <button type="submit">Add City</button>
        </form>
      </div>
      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="warning">{error}</Alert>}
      {fetchError && <Alert severity="error">{fetchError}</Alert>}
    </>
  );
}

export default Header;
