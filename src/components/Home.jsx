import Head from "next/head";
import City from "../components/City";
import Header from "../components/Header";
import Login from "../components/Login";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function Home() {
  return (
    <>
      <Head>
        <title>Under the Weather</title>
      </Head>
      <Login />
      <Header />
      <City />
    </>
  );
}

export default Home;
