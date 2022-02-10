import React, { useEffect, useState } from "react";

import FlashMessage from "react-flash-message";
import { Formik } from "formik";
import { client } from "../../client";
import { changePasswordHelper, fetchUser } from "../../utils/helper";
import { userQuery } from "../../utils/data";
import Spinner from "../UI/Spinner";

const ChangePassword = () => {
  const [user, setUser] = useState(null);

  const [idToken, setIdToken] = useState();
  const [oldPassword, setOldPassword] = useState(null);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);

  const [errors, setErrors] = useState(null);
  const [showError, setShowError] = useState(false);

  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    fetchUser().then((data) => {
      let userInfo = data;
      let id = userInfo?.id;
      const query = userQuery(id);
      client.fetch(query).then((data) => {
        if (!isCancelled && data) {
          const userdata = { ...data[0] };
          setUser(userdata);
        }
      });
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  const validateInput = (values) => {
    setChangePasswordSuccess(false);
    if (values.oldpassword) {
      fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDP-nAkcMi63Al8V0raPRZF_HLQ1YqZjb4",
        {
          method: "POST",
          body: JSON.stringify({
            email: user.email,
            password: values.oldpassword,
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
            return res.json().then(() => {
              return;
            });
          }
        })
        .then((data) => {
          setIdToken(data.idToken);
        })
        .catch(() => {
          setIdToken(null);
        });
    }

    setOldPassword(null);
    if (values.oldpassword) {
      setOldPassword(values.oldpassword);
    }
    if (!values.oldpassword || !values.confirmpassword || !values.newpassword) {
      setErrors("Input field must not be empty");
    } else if (values.confirmpassword !== values.newpassword) {
      setErrors("New password and confirm password must be the same");
    } else if (
      values.confirmpassword.length < 6 ||
      values.newpassword.length < 6
    ) {
      setErrors("New password must be more than 6 characters");
    }
    if (!idToken) {
      setErrors("Old password is wrong.Try again!");
    }

    setTimeout(() => {
      setErrors(null);
    }, 3500);
  };
  const changePasswordHandler = (values) => {
    if (!idToken) {
      setErrors("Old password is wrong.Try again!");
    }
    if (!errors) {
      changePasswordHelper(idToken, values.newpassword);
      setChangePasswordSuccess(true);
    }
  };

  useEffect(() => {
    if (errors) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else {
      setTimeout(() => {
        setIsChanging(false);
      }, 500);
    }
  }, [errors, isChanging]);

  return (
    <>
      <div className="h-full w-full flex flex-row py-[2rem] relative border-l border-slate-300">
        {isChanging && <Spinner classes="absolute top-[50%] left-[50%]" />}
        {user && !isChanging && (
          <Formik
            initialValues={{
              oldpassword: "",
              newpassword: "",
              confirmpassword: "",
            }}
            onSubmit={(values, { setSubmitting }) => {
              changePasswordHandler(values);
              setSubmitting(false);
            }}
          >
            {({
              values,
              // errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              // isSubmitting,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit} className="flex flex-col w-full pl-[1rem] md:p-auto">
                <div className="flex items-center my-[.5rem] ">
                  <label className="md:w-[30%] mr-0  md:px-[32px] flex flex-row-reverse">
                    <img
                      alt="avartar"
                      className="w-[2.7rem] h-[2.7rem] rounded-full border border-gray-400 mr-[1rem] md:m-0"
                      src={user?.avatar}
                    />
                  </label>
                  <div className="leading-5">
                    <p className="text-[1.2rem] font-medium">
                      {user?.username}
                    </p>
                  </div>
                </div>
                <div className="flex w-full my-[.5rem] flex-col md:flex-row">
                  <>
                    <label className="text-[#262626] text-[16px] font-medium md:w-[30%]  md:text-right md:px-[32px]">
                      Old Password
                    </label>
                    <div className="w-[60%]">
                      <input
                        className="border border-gray-400 w-full py-[.4rem] rounded-lg bg-[#fafafa] px-[3px]"
                        type="password"
                        name="oldpassword"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.oldpassword}
                      />
                    </div>
                  </>
                </div>
                <div className="flex my-[.5rem] mb-[1rem] flex-col md:flex-row">
                  <label className="text-[#262626] text-[16px] font-medium md:w-[30%]  md:text-right md:px-[32px]">
                    New Password
                  </label>
                  <div className=" w-[60%]">
                    <input
                      className="border border-gray-400 w-full py-[.4rem] rounded-lg bg-[#fafafa] px-[3px]"
                      type="password"
                      name="newpassword"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.newpassword}
                    />
                  </div>
                </div>

                <div className="flex my-[.5rem] flex-col md:flex-row">
                  <label className="text-[#262626] text-[16px] font-medium md:w-[30%]  md:text-right md:px-[32px]">
                    Confirm New Password
                  </label>
                  <div className="w-[60%]">
                    <input
                      className="border border-gray-400 w-full py-[.4rem] rounded-lg bg-[#fafafa] px-[3px] "
                      type="password"
                      name="confirmpassword"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.confirmpassword}
                    />
                    {/* <ErrorMessage name="email" /> */}
                  </div>
                </div>
                {/* {errors.email && touched.email && errors.email} */}

                <div className="flex my-[.5rem]">
                  <div className="md:w-[30%]"></div>
                  <button
                    onClick={() => {
                      validateInput(values);
                    }}
                    className={`bg-[#0095f6] text-white cursor-pointer w-[9rem] py-[.2rem] rounded-[5px] `}
                    type="submit"
                  >
                    Change Password
                  </button>
                </div>
                <div className="flex my-[.5rem]">
                  <div className="md:w-[30%]"></div>
                  <p
                    className={`text-[#0095f6] font-medium cursor-pointer text-[.85rem]`}
                  >
                    Forgot Password?
                  </p>
                </div>
              </form>
            )}
          </Formik>
        )}
      </div>

      {showError && (
        <FlashMessage duration={3000}>
          <p className="fixed w-full bottom-0 left-0 bg-[#222] text-[#fff]">
            {errors}
          </p>
        </FlashMessage>
      )}
      {changePasswordSuccess && (
        <FlashMessage duration={3000}>
          <p className="fixed w-full bottom-0 left-0 bg-[#222] text-[#fff]">
            Success!!Your password is changed!
          </p>
        </FlashMessage>
      )}
    </>
  );
};

export default ChangePassword;
