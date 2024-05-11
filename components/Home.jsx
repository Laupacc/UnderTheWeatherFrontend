import Head from "next/head";
import React, { useState, useEffect } from 'react';
import './style.css';
import { useDispatch, useSelector } from "react-redux";

function Home() {
  return (
    <div id="container">
      <div className="connexionCard">
        <div>
          <p>SIGN-UP</p>
          <div className="divider"></div>
        </div>
        <input id="registerName" type="text" placeholder="Name" />
        <input id="registerEmail" type="email" placeholder="E-mail" />
        <input id="registerPassword" type="password" placeholder="Password" />
        <button id="register">Register</button>
      </div>
      <div className="connexionCard">
        <div>
          <p>SIGN-IN</p>
          <div className="divider"></div>
        </div>
        <input id="connectionEmail" type="email" placeholder="E-mail" />
        <input id="connectionPassword" type="password" placeholder="Password" />
        <button id="connection">Connect</button>
      </div>
    </div>
  );
}

export default Home;
