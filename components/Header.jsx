import Head from "next/head";
import React, { useState, useEffect } from 'react';
import './style.css';
import { useDispatch, useSelector } from "react-redux";

function Header() {
  return (
    <div id="header">
      <a id="logoButton" href="index.html">
        <img id="logo" src="images/logo.svg" alt="Logo" />
      </a>

      <div className="headerDiv">
        <input id="cityNameInput" type="text" placeholder="Add new city" />
        <button id="addCity">
          <img id="glass" src="images/glass.png" alt="Search" />
        </button>
      </div>

      <a href="login.html" id="userButton">
        <img id="userIcon" src="images/user.png" alt="User" />
      </a>
    </div>
  );
}

export default Header;
