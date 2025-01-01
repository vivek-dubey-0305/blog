import React, { useContext, useRef } from "react";
import InputBox from "../components/input.component.jsx";
import google from "../imgs/google.png";
import { Link, Navigate } from "react-router-dom";
import AnimationWrapper from "../common/page-animation.jsx";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInCookies } from "../common/session.jsx";
import { UserContext } from "../App.jsx";

axios.defaults.withCredentials = true;

const UserAuthForm = ({ type }) => {
  // const authForm = useRef();

  //* Extracting the userAuth from UserContext, so that to render the page according the states
  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  const userAuthThroughServer = async (serverRoute, formData) => {
    await axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData, {
        headers: { "Content-Type": "application/json" },
      })
      .then(({ data }) => {
        //* storing the user data in session
        // storeInSession("user", JSON.stringify(data));
        //*Storing in cookies instead
        storeInCookies("user", JSON.stringify(data));

        // setUserAuth(data);
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let serverRoute = type == "sign-in" ? "/signin" : "/signup";

    let form = new FormData(formElements);

    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    await userAuthThroughServer(serverRoute, formData);
    window.location.reload();
  };

  //? wafter navigation to /, we needa remove the singin/up button
  //* wii do that in the NavBar.component.jsx
  return access_token ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form id="formElements" className="w-[80%] max-w-[400px]">
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type == "sign-in" ? "Already a Member?" : "Join us today!"}
          </h1>
          {type != "sign-in" ? (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-user"
            />
          ) : (
            ""
          )}
          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
          />

          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-lock"
          />

          <button
            onClick={handleSubmit}
            className="btn-dark center mt-14"
            type="submit"
          >
            {type.replace("-", " ")}
          </button>

          <div className="relative w-full flex ic gap-2 my-10 opacity-10 uppercase to-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
            <img src={google} alt="Google" className="w-5" />
            Continue with Google
          </button>

          {type == "sign-in" ? (
            <p className="mt-6 to-dark-grey text-xl text-center">
              Don't Have an account ?
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Join Us Today
              </Link>
            </p>
          ) : (
            <p className="mt-6 to-dark-grey text-xl text-center">
              Already Have an account ?
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign In Here
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
