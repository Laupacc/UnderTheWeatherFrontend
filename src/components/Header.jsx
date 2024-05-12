import React from "react";
import { useDispatch, useSelector } from "react-redux";

function Header() {
  return (
    <>
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800 text-white">
        <a href="index.html">
          <img className="w-12 h-12" src="images/logo.svg" alt="Logo" />
        </a>

        <div className="flex items-center">
          <input
            id="cityNameInput"
            type="text"
            placeholder="Add new city"
            className="px-2 py-1 mr-2 border border-gray-500 rounded"
          />
          <button
            id="addCity"
            className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700"
          >
            <img
              id="glass"
              src="images/glass.png"
              alt="Search"
              className="w-6 h-6"
            />
          </button>
        </div>

        <a href="login.html" id="userButton">
          <img id="userIcon" src="images/user.png" alt="User" />
        </a>
      </div>
    </>
  );
}

export default Header;
