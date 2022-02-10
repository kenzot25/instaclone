import React, { useEffect, useRef } from "react";
// import GoogleLogin from "react-google-login";
import { Link, useNavigate } from "react-router-dom";

// import { client } from "../../client";
// import { setUser } from "../../utils/helper";

const Login = () => {
  const navigate = useNavigate();
  // const location = useLocation();

  const emailRef = useRef();
  const passwordRef = useRef();

  let user = localStorage.getItem("user");
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);
  const formSubmitHanlder = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    // console.log(email, name, username, password);
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDP-nAkcMi63Al8V0raPRZF_HLQ1YqZjb4",
      {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Something went wrong!";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        localStorage.setItem("token", data.idToken);
        user = localStorage.getItem("user");
        navigate('/')
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div
        className={`border-2 w-[22rem] items-center mx-auto mt-24 justify-center bg-[#fff] `}
      >
        <p className="logo text-center text-4xl mt-4">Instagram</p>
        <form
          className="flex flex-col mt-12 px-12"
          onSubmit={formSubmitHanlder}
        >
          <input
            ref={emailRef}
            className="border-2 mb-2 p-1 bg-slate-100"
            type="text"
            placeholder="Email"
          />
          <input
            ref={passwordRef}
            className="border-2 mb-2 p-1 bg-slate-100"
            type="password"
            placeholder="Password"
          />
          <button className="cursor-pointer text-white bg-cyan-300 p-2 rounded-md hover:bg-cyan-500 mt-2 mb-4">
            Login
          </button>
        </form>
        <div className="flex justify-between items-center w-full px-12">
          <div className="w-full h-0.5 bg-neutral-400"></div>
          <p className="mx-2 text-[#8e8e8e]">OR</p>
          <div className="w-full h-0.5 bg-neutral-400"></div>
        </div>
        {/* <div className="px-12">
          <GoogleLogin
            clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
            render={(renderProps) => (
              <button
                type="button"
                className="mx-auto mt-4 text-white font-bold cursor-pointer flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none "
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                <img
                  className="w-5 h-5 rounded-full mr-2 bg-white "
                  alt="logo-login"
                  src="https://upload.wikimedia.org/wikipedia/commons/archive/5/53/20161128230037%21Google_%22G%22_Logo.svg"
                />{" "}
                <span className="text-[#4285F4] text-[.9rem] ">
                  Sign in with Google
                </span>
              </button>
            )}
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy="single_host_origin"
          />
        </div> */}
        <div className="px-12 pb-[1rem]">
          <p className="text-[#00376b] text-[12px] text-center">
            Forgot Password?
          </p>
        </div>
      </div>
      <div
        className={`flex text-[14px]  border-2 w-[22rem] items-center mx-auto mt-4 justify-center py-[1rem] bg-[#fff]  `}
      >
        <div>
          Don't have an account?
          <Link to="/signup" className="text-[#0095f6] font-medium ">
            {" "}
            Sign up
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
