import Head from "next/head";
import City from "../components/City";
import Header from "../components/Header";
import React, { useState, useEffect } from "react";

function Home() {
  return (
    <>
      <Head>
        <title>Under the Weather</title>
      </Head>
      <Header />
      <City />
      {/* <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col p-8 bg-gray-200 rounded-lg">
          <div className="mb-4">
            <p className="text-xl font-bold">SIGN-UP</p>
            <div className="h-px bg-gray-600 my-2 "></div>
          </div>
          <input
            id="registerName"
            type="text"
            placeholder="Name"
            className="input-field"
          />
          <input
            id="registerEmail"
            type="email"
            placeholder="E-mail"
            className="input-field"
          />
          <input
            id="registerPassword"
            type="password"
            placeholder="Password"
            className="input-field"
          />
          <button id="register" className="btn-primary">
            Register
          </button>
        </div>
        <div className="flex flex-col ml-8 p-8 bg-gray-200 rounded-lg">
          <div className="mb-4">
            <p className="text-xl font-bold">SIGN-IN</p>
            <div className="h-px bg-gray-600 my-2"></div>
          </div>
          <input
            id="connectionEmail"
            type="email"
            placeholder="E-mail"
            className="input-field"
          />
          <input
            id="connectionPassword"
            type="password"
            placeholder="Password"
            className="input-field"
          />
          <button id="connection" className="btn-primary">
            Connect
          </button>
        </div>
      </div> */}
    </>
  );
}

export default Home;
