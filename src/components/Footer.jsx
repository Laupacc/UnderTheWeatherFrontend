import Head from "next/head";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function Footer() {
  return (
    <>
      <Head>
        <title>Under the Weather</title>
      </Head>
      <div>
        <footer
          className=" text-slate-200 text-center flex justify-center items-center h-8 w-full bottom-0 rounded-t-lg"
          style={{
            background:
              "radial-gradient(circle, rgba(28,181,224,1) 0%, rgba(0,0,70,1) 100%)",
          }}
        >
          <p>Under the Weather</p>
          <p className="mx-2">|</p>
          <p>©</p>
          <p className="mx-2">|</p>
          <p>2024</p>
        </footer>
      </div>
    </>
  );
}

export default Footer;
