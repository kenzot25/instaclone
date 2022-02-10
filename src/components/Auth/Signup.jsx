import React, { useEffect, useRef, useState } from "react";
// import GoogleLogin from "react-google-login";
import { Link, useNavigate } from "react-router-dom";
import FlashMessage from "react-flash-message";
import { client } from "../../client";
// import { setUser } from "../../utils/helper";
// import { v4 as uuidv4 } from "uuid";
const Signup = () => {
  const navigate = useNavigate();
  const emailRef = useRef();
  const nameRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [errors, setErrors] = useState(null);
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/");
    }
  }, [navigate]);
  // const responseGoogle = (response) => {
  //   setUser(response.profileObj);
  //   navigate("/", { replace: true });
  // };
  const formSubmitHanlder = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const name = nameRef.current.value;
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    // console.log(email, name, username, password);
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDP-nAkcMi63Al8V0raPRZF_HLQ1YqZjb4",
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
        // setIsLoading(false);
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
        console.log(data);
        // const expirationTime = new Date(
        //   new Date().getTime() + +data.expiresIn * 1000
        // );
        // authCtx.login(data.idToken, expirationTime.toISOString());
        // navigate("/", { replace: true });
        const { email, localId } = data;
        const id = localId;
        localStorage.setItem("token", data.idToken);
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: email,
            id: id,
            name: name,
          })
        );
        const doc = {
          _id: id,
          _type: "user",
          username: username,
          fullname: name,
          avatar:
            "https://iupac.org/wp-content/uploads/2018/05/default-avatar.png",
          email: email,
        };
        client.createIfNotExists(doc).then(() => {
          navigate("/", { replace: true });
        });
      })
      .catch((error) => {
        if (error.message === "EMAIL_EXISTS") {
          setErrors("Email exiting.Please try another!");
        } else if (
          error.message ===
          "WEAK_PASSWORD : Password should be at least 6 characters"
        ) {
          setErrors("Password should be at least 6 characters");
        } else {
          setErrors(error.message);
        }
        setTimeout(() => {
          setErrors(null);
        }, 2000);
      });
  };
  return (
    <>
      <div className="border-2 w-[22rem] items-center mx-auto mt-8 justify-center bg-[#fff]">
        <p className="logo text-center text-5xl mt-4">Instagram</p>
        <p className="text-center font-medium mt-4 mx-[2.8rem] text-[1rem] text-[#8e8e8e]">
          Sign up to see photos and videos from your friends.
        </p>
        {/* <GoogleLogin
          clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
          render={(renderProps) => (
            <button
              type="button"
              className="mx-auto mt-4 text-white font-bold cursor-pointer flex justify-center items-center px-3 rounded-lg cursor-pointer outline-none "
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
        /> */}
        <div className="flex justify-between items-center w-full px-12 pt-4">
          <div className="w-full h-0.5 bg-neutral-400"></div>
          <p className="mx-2 text-[#8e8e8e]">OR</p>
          <div className="w-full h-0.5 bg-neutral-400"></div>
        </div>
        <form className="flex flex-col mt-6 px-12" onSubmit={formSubmitHanlder}>
          <input
            required
            ref={emailRef}
            className="border-2 mb-2 p-1 bg-gray-100 text-[.9rem]"
            type="text"
            placeholder="Mobile Number or Email"
          />
          <input
            required
            ref={nameRef}
            className="border-2 mb-2 p-1 bg-gray-100 text-[.9rem]"
            type="text"
            placeholder="Full Name"
          />
          <input
            required
            ref={usernameRef}
            className="border-2 mb-2 p-1 bg-gray-100 text-[.9rem]"
            type="text"
            placeholder="Username"
          />
          <input
            required
            ref={passwordRef}
            className="border-2 mb-2 p-1 bg-gray-100 text-[.9rem]"
            type="password"
            placeholder="Password"
          />
          <button className="cursor-pointer text-white bg-cyan-300 p-1 rounded-md hover:bg-cyan-500 mt-2 mb-4">
            Sign up
          </button>
        </form>

        <div className="px-12"></div>
        <div className="px-12 pb-[1rem]">
          <p className="text-[#00376b] text-[12px] text-center">
            Forgot Password?
          </p>
        </div>
      </div>
      <div className="flex text-[14px]  border-2 w-[22rem] items-center mx-auto mt-4 justify-center py-[1rem] bg-[#fff]">
        <div>
          Have an account?
          <Link to="/login" className="text-[#0095f6] font-medium ">
            {" "}
            Sign in
          </Link>
        </div>
      </div>
      {errors && (
        <FlashMessage duration={3000}>
          <p className="fixed w-full bottom-0 left-0 pl-[1rem] bg-[#222] text-[#fff]">
            {errors}
          </p>
        </FlashMessage>
      )}
    </>
  );
};

export default Signup;
