import React, { useEffect, useState, useRef } from "react";
import FlashMessage from "react-flash-message";
import { Formik, Field, Form } from "formik";
import { client } from "../../client";
import { changeAvatarUser, fetchUser } from "../../utils/helper";
import { changedUserDetails } from "../../utils/helper";
// import Modal from "../UI/Modal";
import { userQuery } from "../../utils/data";
import Spinner from "../UI/Spinner";
import Modal from "react-modal";
const customStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: "40",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "0",
    // width: "",
    zIndex: "50",
  },
};

Modal.setAppElement("#modal--overlay");

const Edit = ({ fetchDataAfterChanged }) => {
  const [user, setUser] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(false);
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState("");

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [errors, setErrors] = useState(null);
  const [showError, setShowError] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const [gender, setGender] = useState(null);
  const genderRef = useRef();
  //
  useEffect(() => {
    let isCancelled = false;

    fetchUser().then((data) => {
      let userInfo = data;
      let id = userInfo?.id;
      const query = userQuery(id);
      const fetchData = setTimeout(() => {
        setUser(null);
        client.fetch(query).then((data) => {
          if (!isCancelled && data) {
            const userdata = { ...data[0] };
            console.log(userdata);
            setUser(userdata);
          } else {
            setUser(null);
            clearTimeout(fetchData);
          }
        });
      }, 800);
    });
    return () => {
      isCancelled = true;
    };
  }, [isChanging]);

  // useEffect(() => {
  //   let isCancelled = false;

  //   return () => {
  //     isCancelled = true;
  //   };
  // }, []);

  useEffect(() => {
    let isCancelled = false;
    let setChanging;
    let showError;
    if (errors) {
      setShowError(true);
      showError = setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else {
      setChanging = setTimeout(() => {
        if (!isCancelled) {
          setIsChanging(false);
        }
      }, 200);
    }

    return () => {
      isCancelled = true;
      clearTimeout(setChanging);
      clearTimeout(showError);
    };
  }, [errors, isChanging, user]);
  //
  const uploadImage = (e) => {
    setLoadingAvatar(true);
    const file = [...e.target.files];
    const { type, name } = file[0];
    if (
      type === "image/png" ||
      type === "image/jpg" ||
      type === "image/svg" ||
      type === "image/jpeg" ||
      type === "image/gif" ||
      type === "image/tiff"
    ) {
      return client.assets
        .upload("image", file[0], {
          contentType: type,
          filename: name,
        })
        .then((doc) => {
          const { url } = doc;
          setPreviewAvatarUrl(url);
          changeAvatarUser(user, url);
          setLoadingAvatar(false);
          setPreviewAvatar(true);
          fetchDataAfterChanged(url);
        })
        .catch((e) => {
          console.log("Image upload error", e);
        });
    }
  };
  const closeModalHandler = () => {
    setIsOpenModal(false);
    document.body.style.overflowY = "scroll";
  };
  const validateInput = (values) => {
    if (!values.email) {
      setErrors((prev) => ({
        ...prev,
        email: "Email must not be empty",
      }));
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Invalid email address.Try again!",
      }));
    }
    if (!values.username) {
      setErrors((prev) => ({
        ...prev,
        username: "Username must not be empty",
      }));
      // errors.username = "Username must not be empty";
    } else if (values.username.length < 6 || values.username.length > 20) {
      console.log("WTF");
      setErrors((prev) => ({
        ...prev,
        username: "Username must have more than 6 and less than 20 characters",
      }));
    }
    setTimeout(() => {
      setErrors(null);
    }, 3500);
  };
  const changedUserDetailsHelper = (values) => {
    if (!errors) {
      if (genderRef?.current.value) {
        values.gender = genderRef.current.value;
      } else if (user.gender) {
        values.gender = user.gender;
      } else {
        values.gender = "other";
      }

      changedUserDetails(user._id, {
        email: values.email,
        fullname: values.name,
        gender: values.gender,
        bio: values.bio,
        username: values.username,
      });
      setIsChanging(true);
    }
  };

  return (
    <>
      <div className="h-full w-full flex flex-row py-[2rem] relative border-l border-slate-300">
        {isChanging && <Spinner classes="absolute top-[50%] left-[50%]" />}
        {user && !isChanging && (
          <Formik
            initialValues={{
              email: user.email,
              name: user.fullname,
              bio: user.bio,
              gender: gender,
              username: user.username,
            }}
            onSubmit={(values, { setSubmitting }) => {
              changedUserDetailsHelper(values);
              setSubmitting(false);
            }}
          >
            {({
              values,
              // errors,
              // touched,
              handleChange,
              handleBlur,
              handleSubmit,
              // isSubmitting,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="flex items-center my-[.5rem] ">
                  <label className="md:w-[30%] mr-0  px-[32px] flex flex-row-reverse">
                    <input
                      accept="image/jpeg,image/png"
                      type="file"
                      name="upload-image"
                      onChange={uploadImage}
                      className="w-0 h-0 py-[.2rem]"
                    />

                    {!loadingAvatar && !previewAvatar && (
                      <img
                        alt="avartar"
                        className="w-[2.7rem] h-[2.7rem] rounded-full border border-gray-400 "
                        src={user.avatar}
                      />
                    )}
                    {!loadingAvatar && previewAvatar && (
                      <img
                        alt="avartar"
                        className="w-[3rem] h-[3rem] rounded-full border-none shadow-lg "
                        src={previewAvatarUrl}
                      />
                    )}
                  </label>
                  <div className="leading-5">
                    <p className="text-[1.2rem] font-medium">{user.username}</p>
                    <label className="text-[#0095f6] font-medium cursor-pointer">
                      <input
                        accept="image/jpeg,image/png"
                        type="file"
                        name="upload-image"
                        onChange={uploadImage}
                        className="w-0 h-0 py-[.2rem]"
                      />
                      Change Profile Photo
                    </label>
                  </div>
                </div>
                <div className="lg:flex w-full my-[.5rem] mx-[32px] lg:mx-0">
                  <label className="text-[#262626] text-[16px] font-medium w-[30%] text-right lg:px-[32px]">
                    Name
                  </label>
                  <div className="lg:w-[50%]  md:w-[30rem] w-[20rem] ">
                    <input
                      className="border border-gray-300 w-full py-[.2rem] "
                      type="text"
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name || user?.fullname}
                    />
                    <div className="text-[#8e8e8e] text-[12px]">
                      <p className="pt-2">
                        Help people discover your account by using the name
                        you're known by: either your full name, nickname, or
                        business name.
                      </p>
                      <p className="pt-2">
                        You can only change your name twice within 14 days.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="lg:flex my-[.5rem] mb-[1rem] mx-[32px] lg:mx-0">
                  <label className="text-[#262626] text-[16px] font-medium w-[30%] text-right lg:px-[32px]">
                    Username
                  </label>
                  <div className="lg:w-[50%]  md:w-[30rem] w-[20rem]">
                    <input
                      className="border border-gray-300 w-full py-[.2rem]"
                      type="text"
                      name="username"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.username ? values.username : user.username}
                    />
                    <div className="text-[#8e8e8e] text-[12px] pt-2">
                      In most cases, you'll be able to change your username back
                      to {user?.username} for another 14 days.{" "}
                      <span className="text-[#0095f6] cursor-pointer">
                        Learn more
                      </span>
                    </div>
                  </div>
                </div>
                <div className="lg:flex my-[.5rem] w-full mx-[32px] lg:mx-0">
                  <label className="text-[#262626] text-[16px] font-medium w-[30%] text-right lg:px-[32px]">
                    Bio
                  </label>
                  <div className="lg:w-[50%]  md:w-[30rem] w-[20rem] border border-gray-200">
                    <textarea
                      className="w-full  py-[.2rem]"
                      name="bio"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.bio ? values.bio : user.bio}
                    ></textarea>
                  </div>
                </div>
                <div className="flex my-[.5rem] mx-[32px] lg:mx-0">
                  <div className="lg:w-[30%]"></div>
                  <div className="text-[#8e8e8e] text-[12px] w-[50%]">
                    <p className="font-medium text-[14px]">
                      Personal Information
                    </p>{" "}
                    Provide your personal information, even if the account is
                    used for a business, a pet or something else. This won't be
                    a part of your public profile.
                  </div>
                </div>
                <div className="lg:flex my-[.5rem] mx-[32px] lg:mx-0">
                  <label className="text-[#262626] text-[16px] font-medium w-[30%] text-right lg:px-[32px]">
                    Email
                  </label>
                  <div className="lg:w-[50%]  md:w-[30rem] w-[20rem]">
                    <input
                      className="border border-gray-300 w-full py-[.2rem]"
                      type="text"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      placeholder={user?.email}
                    />
                    {/* <ErrorMessage name="email" /> */}
                  </div>
                </div>
                {/* {errors.email && touched.email && errors.email} */}
                <div className="lg:flex my-[.5rem] mx-[32px] lg:mx-0">
                  <label className="text-[#262626] text-[16px] font-medium w-[30%] text-right lg:px-[32px]">
                    Gender
                  </label>
                  <div className="lg:w-[50%]  md:w-[30rem] w-[20rem]">
                    <div
                      onClick={() => {
                        setIsOpenModal(true);
                        document.body.style.overflow = "hidden";
                      }}
                    >
                      {/* {gender && console.log(gender)} */}
                      <input
                        disabled
                        className="border border-gray-300 w-full py-[.2rem] bg-white capitalize"
                        type="text"
                        name="gender"
                        id="gender"
                        ref={genderRef}
                        onBlur={handleBlur}
                        value={`${
                          gender ? gender : user.gender ? user.gender : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>
                <div className="lg:flex my-[.5rem] mx-[32px] lg:mx-0">
                  <label className="text-[#262626] text-[16px] font-medium w-[30%] text-right lg:px-[32px]">
                    Similar Account Suggestions
                  </label>
                  <div className="flex flex-row lg:w-[35%] w-[70%] font-medium text-[14px] items-center">
                    <input
                      className="border border-gray-300 mr-[.5rem] py-[.2rem]"
                      type="checkbox"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <p className="leading-4">
                      Include your account when recommending similar accounts
                      people might want to follow.(J4F)
                    </p>
                  </div>
                </div>
                <div className="md:flex my-[.5rem] mx-[32px] md:mx-0">
                  <div className="md:w-[30%]"></div>
                  <button
                    onClick={() => {
                      validateInput(values);
                    }}
                    className={`bg-[#0095f6] text-white cursor-pointer w-[4.2rem] py-[.2rem] rounded-[5px] `}
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </Formik>
        )}
      </div>

      {isOpenModal && genderRef && (
        <Modal
          isOpen={isOpenModal}
          onRequestClose={closeModalHandler}
          style={customStyles}
          contentLabel="Modal"
        >
          <div className="lg:w-[40vw] md:w-[50vw] w-[80vw]  h-[2.8rem] font-medium flex items-center  border-b border-gray-400 relative rounded-lg">
            <p className="w-full text-center">Gender</p>
            <img
              onClick={closeModalHandler}
              className="w-5 h-5 absolute right-[1rem]"
              alt="closebtn"
              src={process.env.PUBLIC_URL + "/icons/close-btn.svg"}
            />
          </div>
          <Formik
            initialValues={{
              gender: genderRef.current.value
                ? genderRef.current.value
                  ? genderRef.current.value
                  : user.gender
                : "",
            }}
            onSubmit={async (values) => {
              closeModalHandler();
              setGender(values.gender);
            }}
          >
            {({ values }) => (
              <Form className="h-[calc(15rem-2.8rem)] flex flex-col justify-between px-[1rem] py-[1rem] font-medium">
                <div
                  role="group"
                  aria-labelledby="my-radio-group"
                  className="flex flex-col"
                >
                  <label>
                    <Field
                      type="radio"
                      name="gender"
                      value="male"
                      className="w-4 h-4 mr-[.3rem] "
                    />
                    Male
                  </label>
                  <label className="my-[.5rem]">
                    <Field
                      type="radio"
                      name="gender"
                      value="female"
                      className="w-4 h-4 mr-[.3rem] "
                    />
                    Female
                  </label>
                  <label>
                    <Field
                      type="radio"
                      name="gender"
                      value="other"
                      className="w-4 h-4 mr-[.3rem] "
                    />
                    Prefer Not To Say
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#0095f6] text-[#fff] py-[.5rem]  font-medium rounded-lg"
                >
                  Done
                </button>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
      {showError && (
        <FlashMessage duration={3000}>
          <p className="fixed w-full bottom-0 left-0 bg-[#222] text-[#fff]">
            {errors.email || errors.username}
          </p>
        </FlashMessage>
      )}
    </>
  );
};

export default Edit;
