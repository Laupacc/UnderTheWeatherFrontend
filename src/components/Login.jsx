import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import { login, logout } from "../reducers/user";

function Login() {
  // Login and Register states
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [signInError, setSignInError] = useState("");

  // Sign up function
  const handleRegister = () => {
    fetch("https://under-the-weather-backend.vercel.app/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: regUsername, password: regPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log("Success:", data);
          dispatch(login({ username: regUsername, token: data.token }));
          setRegUsername("");
          setRegPassword("");
        } else {
          console.log("User already exists");
          setSignUpError("User already exists. Please sign in instead.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Sign in function
  const handleLogin = () => {
    fetch("https://under-the-weather-backend.vercel.app/users/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: loginUsername,
        password: loginPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log("Success:", data);
          dispatch(login({ username: loginUsername, token: data.token }));
          setLoginUsername("");
          setLoginPassword("");
        } else {
          console.log("Invalid username or password");
          setSignInError("Invalid username or password");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Sign out function
  const handleSignOut = () => {
    dispatch(logout());
    console.log("Logged out");
  };
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="flex justify-center items-center">
        <div className="flex flex-col justify-center items-center p-2 m-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            <input
              type="text"
              placeholder="Username"
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
              className=""
            />
            <input
              type="password"
              placeholder="Password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              className=""
            />
            <button onClick={() => handleRegister()}>Register</button>
            {signUpError && <p>{signUpError}</p>}
          </form>
        </div>
        <div className="flex flex-col justify-center items-center p-2 m-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <input
              type="text"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              className=""
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className=""
            />
            <button onClick={() => handleLogin()}>Login</button>
            {signInError && <p>{signInError}</p>}
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
