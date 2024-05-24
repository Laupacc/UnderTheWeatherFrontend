import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import { login, logout } from "../reducers/user";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [isLoginVisible, setIsLoginVisible] = useState(true);

  // Clear error messages after 3 seconds
  useEffect(() => {
    if (signUpError) {
      const timer = setTimeout(() => setSignUpError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [signUpError]);

  useEffect(() => {
    if (signInError) {
      const timer = setTimeout(() => setSignInError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [signInError]);

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
          setOpen(false);
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
          setOpen(false);
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
    console.log("Logged out");
    dispatch(logout());
    toast("👏🏼 Logged out successfully");
  };
  //   bg-slate-100 bg-opacity-70 hover:bg-opacity-90

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <div>
        {user.token ? (
          <button
            className="flex justify-center items-center m-2 w-20 h-8 rounded-full bg-slate-100 bg-opacity-60 hover:bg-opacity-90 hover:text-slate-600"
            onClick={handleSignOut}
          >
            Logout
          </button>
        ) : (
          <button
            className="flex justify-center items-center m-2 w-20 h-8 rounded-full bg-slate-100 bg-opacity-60 hover:bg-opacity-90 hover:text-slate-600"
            onClick={handleOpen}
          >
            Login
          </button>
        )}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="Login Modal"
          aria-describedby="Login Modal"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 320,
              minHeight: 400,
              background:
                "radial-gradient(circle, rgba(28,181,224,1) 0%, rgba(0,0,70,1) 100%)",
              border: "1px solid #0E2F44",
              borderRadius: "1rem",
              boxShadow: 24,
              p: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            {isLoginVisible && (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                  }}
                >
                  <div className="flex flex-col justify-center items-center">
                    <input
                      type="text"
                      placeholder="Username"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="p-2 m-2 w-56 rounded-lg text-center bg-slate-100 bg-opacity-50"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="p-2 m-2 w-56 rounded-lg text-center bg-slate-100 bg-opacity-50"
                    />
                    <button
                      className="m-2 p-2 w-44 rounded-full bg-slate-100 bg-opacity-70 hover:bg-opacity-90"
                      onClick={() => handleLogin()}
                    >
                      Login
                    </button>
                    {signInError && <p className="text-white">{signInError}</p>}
                  </div>
                </form>
                <div className="flex flex-col justify-center items-center">
                  <p className="text-blue-300">Don't have an account?</p>
                  <button
                    className="text-xl text-blue-300 hover:text-white"
                    onClick={() => {
                      setIsRegisterVisible(true);
                      setIsLoginVisible(false);
                    }}
                  >
                    Register
                  </button>
                </div>
              </>
            )}
            {isRegisterVisible && (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRegister();
                  }}
                >
                  <div className="flex flex-col justify-center items-center">
                    <input
                      type="text"
                      placeholder="Username"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      className="p-2 m-2 w-56 rounded-lg text-center bg-slate-100 bg-opacity-50 "
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="p-2 m-2 w-56 rounded-lg text-center bg-slate-100 bg-opacity-50 "
                    />
                    <button
                      className="m-2 p-2 w-44 rounded-full bg-slate-100 bg-opacity-70 hover:bg-opacity-90"
                      onClick={() => handleRegister()}
                    >
                      Register
                    </button>
                  </div>
                  {signUpError && <p className="text-white">{signUpError}</p>}
                </form>
                <div className="flex flex-col justify-center items-center">
                  <p className="text-blue-300">Already have an account?</p>
                  <button
                    className="text-xl text-blue-300 hover:text-white"
                    onClick={() => {
                      setIsRegisterVisible(false);
                      setIsLoginVisible(true);
                    }}
                  >
                    Back to Login
                  </button>
                </div>
              </>
            )}
          </Box>
        </Modal>
        <ToastContainer
          className={"flex justify-center items-center text-lg"}
          position="top-right"
          autoClose={2000}
          closeOnClick
          rtl={false}
          theme="colored"
          transition={Zoom}
        />
      </div>
    </>
  );
}

export default Login;
