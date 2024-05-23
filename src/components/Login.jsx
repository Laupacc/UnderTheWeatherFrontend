import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import { login, logout } from "../reducers/user";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Login() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  // Login and Register states
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [signInError, setSignInError] = useState("");

  // Modal states
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // New state for register part visibility
  const [isRegisterVisible, setIsRegisterVisible] = useState(false);

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

      <div>
        {user.token ? (
          <Button onClick={handleSignOut}>Logout</Button>
        ) : (
          <Button onClick={handleOpen}>Login</Button>
        )}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
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

            <button onClick={() => setIsRegisterVisible(true)}>
              Create an Account
            </button>
            {isRegisterVisible && (
              <>
                <button onClick={() => setIsRegisterVisible(false)}>
                  Back to Login
                </button>
                <div>
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
              </>
            )}
          </Box>
        </Modal>
      </div>
    </>
  );
}

export default Login;
