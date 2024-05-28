import Head from "next/head";
import City from "../components/City";
import Header from "../components/Header";
import Footer from "../components/Footer";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function Home() {
  return (
    <>
      <Head>
        <title>Under the Weather</title>
      </Head>
      <div className="bg-gray-200 min-h-screen">
        <Header />
        <City />
        <Footer />
      </div>
    </>
  );
}

export default Home;
