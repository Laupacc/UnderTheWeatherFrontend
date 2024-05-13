import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { addCity } from "../reducers/city.js";
import { useEffect } from "react";

function Header() {
  const dispatch = useDispatch();
  const cities = useSelector((state) => state.city);

  const [cityName, setCityName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("https://weatherapp-backend-umber.vercel.app/weather", {
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
          setSuccessMessage(
            `${data.weather.cityName} had been added to your list!`
          );
          setCityName(""); // Clear input field
          setError(""); // Clear any previous errors
        } else {
          setError("City could not be added. Please try again.");
          setCityName(""); // Clear input field
          setSuccessMessage(""); // Clear any previous success messages
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("An error occurred while processing your request.");
        setSuccessMessage(""); // Clear any previous success messages
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
      {error && <div className="text-red-500">{error}</div>}
      {successMessage && <div className="text-green-500">{successMessage}</div>}
    </>
  );
}

export default Header;
