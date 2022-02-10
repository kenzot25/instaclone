import React, { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { client } from "../client";
import {
  userCreatedPostQuery,
  userQuery,
  userSavedPostsQuery,
} from "../utils/data";
import { MasonryLayoutProfile } from "../components/MasonryLayout";
import Spinner from "../components/UI/Spinner";
// import { v4 as uuidv4 } from "uuid";
import { changeAvatarUser, fetchUser } from "../utils/helper";
// import Modal from "../components/UI/Modal";
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
    borderRadius: "1rem",
  },
};
Modal.setAppElement("#modal--overlay");

const UserProfile = ({ fetchDataAfterChanged }) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [user, setUser] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [previewAvatar, setPreviewAvatar] = useState(false);
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState("");
  const [isAuthor, setIsAuthor] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let isCancelled = false;
    // checkUserExit(userId).then((data) => console.log(data));
    fetchUser().then((data) => {
      let userInfo = data;
      let id = userInfo?.id;
      if (userId === id) {
        console.log("author");
        setIsAuthor(true);
      } else {
        console.log("not author");
        setIsAuthor(false);
      }
      const query = userQuery(userId);

      client.fetch(query).then((data) => {
        if (!isCancelled && data.length > 0) {
          const userdata = { ...data[0] };
          setUser(userdata);
          setTimeout(() => {
            setLoadingUser(false);
          }, 400);
        } else {
          setTimeout(() => {
            setUser(null);
            setLoadingUser(false);
          }, 400);
        }
      });
    });

    return () => {
      isCancelled = true;
    };
  }, [userId]);
  useEffect(() => {
    let isCancelled = false;
    console.log("changed in useEffect");
    let query;
    if (location.pathname.includes("saved")) {
      query = userSavedPostsQuery(userId);
    } else {
      query = userCreatedPostQuery(userId);
    }
    setLoadingPost(true);
    client.fetch(query).then((data) => {
      // console.log(data)
      if (!isCancelled) {
        setData(data);
        setTimeout(() => {
          setLoadingPost(false);
        }, 400);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [userId, location.pathname]);
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
  const [modalIsOpen, setIsOpen] = useState(false);
  const clickControlHandler = () => {
    // location.pathname = "/wtf"
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };
  const closeHandler = () => {
    setIsOpen(false);
    document.body.style.overflowY = "scroll";
  };
  const logoutHandler = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeHandler}
        style={customStyles}
        contentLabel="Modal"
      >
        <div className="bg-white z-50   w-[90vw]  h-[30rem] lg:w-[30vw] md:w-[50vw]  text-center flex flex-col justify-evenly  font-normal text-[.9rem]">
          <Link to="/accounts/password/change/" className="cursor-pointer ">
            Change Password
          </Link>
          <hr />
          <p className="cursor-pointer">Nametag</p>

          <hr />

          <p className=" cursor-pointer ">Apps and Website</p>
          <hr />
          <p className="cursor-pointer ">Notifications</p>
          <hr />
          <p className="cursor-pointer ">Privacy and Security</p>
          <hr />
          <p className="cursor-pointer ">Login and Activity</p>
          <hr />
          <p className="cursor-pointer ">Email for Instagram</p>
          <hr />
          <p className="cursor-pointer ">Report a proplem</p>
          <hr />
          <p className="cursor-pointer " onClick={logoutHandler}>
            Logout
          </p>
          <hr />
          <p onClick={closeHandler} className="cursor-pointer ">
            Cancel
          </p>
        </div>
      </Modal>

      <div
        className={`md:mt-[5rem] mt-[4rem] flex flex-col lg:w-[70%] md:w-[80%]  w-full mx-auto 
        }`}
      >
        {loadingUser && <Spinner />}
        {user && !loadingUser && (
          <>
            <div className="flex md:flex-col lg:flex-row flex-row w-full  items-center  lg:h-[40vh] lg:mb-0 md:mb-[2rem] md:pb-[2rem] ">
              <div className="lg:ml-[5rem] lg:mr-[7.7rem] mb-[1rem] ml-[1rem] mr-[2rem] md:mx-0">
                <label>
                  {isAuthor && (
                    <input
                      accept="image/jpeg,image/png"
                      type="file"
                      name="upload-image"
                      onChange={uploadImage}
                      className="w-0 h-0"
                    />
                  )}
                  {loadingAvatar && (
                    <div className="relative lg:w-[10rem] md:w-[7rem] lg:h-[10rem] md:h-[7rem] w-[5rem] h-[5rem] rounded-full border-none shadow-lg ">
                      <Spinner />
                    </div>
                  )}
                  {!loadingAvatar && !previewAvatar && (
                    <img
                      alt="avartar"
                      className="lg:w-[10rem] md:w-[7rem] lg:h-[10rem] md:h-[7rem] w-[5rem] h-[5rem] rounded-full border-none shadow-lg "
                      src={user?.avatar}
                    />
                  )}
                  {!loadingAvatar && previewAvatar && (
                    <img
                      alt="avartar"
                      className="lg:w-[10rem] md:w-[7rem] lg:h-[10rem] md:h-[7rem] w-[5rem] h-[5rem] rounded-full border-none shadow-lg "
                      src={previewAvatarUrl}
                    />
                  )}
                </label>
              </div>
              <div className="flex flex-col h-full justify-center">
                <div className="flex items-center  justify-start lg:justify-between">
                  <p className="text-[1.8rem] font-thin mr-[1rem] md:mr-0 ">
                    {user?.username}
                  </p>
                  {isAuthor && (
                    <>
                      <Link
                        to="/accounts/edit/"
                        className="hidden md:block cursor-pointer border border-[#DADADA] text-[0.8rem] font-semibold py-1 lg:h-auto h-[2rem]  mx-[1.2rem] lg:mx-0 text-center w-[7rem] rounded-sm"
                      >
                        Edit Profile
                      </Link>
                      <img
                        onClick={() => {
                          clickControlHandler();
                        }}
                        alt=""
                        className="w-6 h-6 cursor-pointer"
                        src={process.env.PUBLIC_URL + "/icons/settings.svg"}
                      />
                    </>
                  )}
                  {!isAuthor && (
                    <>
                      <Link
                        to=""
                        className="hidden md:block  bg-[#0095F6] cursor-pointer text-[#fff] text-[0.9rem] font-semibold py-[.35rem] mx-[1rem] text-center px-[2rem] rounded-[.2rem]"
                        onClick={() => {
                          alert(
                            "Sorry :) We'll update this feature\nAnd,the next button doesn't work,u don't need to try that!"
                          );
                        }}
                      >
                        Follow
                      </Link>
                      <img
                        alt=""
                        className="w-6 h-6 cursor-pointer"
                        src={process.env.PUBLIC_URL + "/icons/threedots.svg"}
                      />
                    </>
                  )}
                </div>
                <div className=" hidden md:flex">
                  <p className="text-[1.2rem] flex">
                    <span className="font-medium mr-2">{data?.length}</span>{" "}
                    posts
                  </p>
                  <p className="text-[1.2rem] mx-[2rem] flex">
                    <span className="font-medium mr-2">0</span> followers
                  </p>
                  <p className="text-[1.2rem] flex">
                    <span className="font-medium mr-2">0</span> following
                  </p>
                </div>
                {/* Edit button for small device */}
                {isAuthor && (
                  <Link
                    to="/accounts/edit/"
                    className="md:hidden mt-[.6rem] cursor-pointer border border-[#DADADA] text-[1rem] font-semibold lg:h-auto py-[.25rem] whitespace-nowrap text-center px-[5rem] rounded-sm"
                  >
                    Edit Profile
                  </Link>
                )}
                {!isAuthor && (
                  <Link
                    to=""
                    className="bg-[#0095F6]
                    text-[#fff] md:hidden mt-[.6rem] cursor-pointer  text-[1rem] font-semibold lg:h-auto py-[.25rem] text-center px-[7rem] rounded-[.2rem]"
                  >
                    Follow
                  </Link>
                )}
                {/* End of Edit button for small device  */}
                <p className="text-[1.2rem] font-medium hidden md:block">
                  {user?.fullname}
                </p>
              </div>
            </div>
            {/* Show fullname for small device */}
            <p className="text-[1rem] font-medium  ml-[1rem]  md:hidden">
              {user?.fullname}
            </p>
            {/* End of Show fullname for small device  */}

            {/* Show nums post,follow in small device */}
            <div className="border-t border-[#DADADA] mt-[1rem] flex items-center justify-around py-[.2rem] md:hidden">
              <p className="text-[1rem] flex flex-col items-center font-light text-[#8e8e8e] ">
                <span className="font-medium = text-[#000]">
                  {data?.length}
                </span>{" "}
                posts
              </p>
              <p className="text-[1rem] mx-[2rem] flex flex-col items-center font-light text-[#8e8e8e]">
                <span className="font-medium = text-[#000]">0</span> followers
              </p>
              <p className="text-[1rem] flex flex-col items-center font-light text-[#8e8e8e]">
                <span className="font-medium = text-[#000]">0</span> following
              </p>
            </div>
            {/* End of show nums post,follow in small device  */}

            <div className="border-t border-[#DADADA] md:mt-[1rem] flex flex-col ">
              <div className="flex md:justify-center items-center justify-around">
                <NavLink
                  to={`${
                    location.pathname.includes("saved") &&
                    location.pathname.includes("tagged")
                      ? location.pathname.replace("/saved", "/tagged", "")
                      : ""
                  } `}
                  className={`py-[1rem] mr-[2.5rem] text-sm flex items-center ${`${
                    !location.pathname.includes("saved") &&
                    !location.pathname.includes("tagged")
                      ? "text-[#262626] font-medium md:border-t border-[#000]"
                      : "text-[#8e8e8e]"
                  }`}`}
                >
                  <svg
                    className="md:w-4 md:h-4  mx-1 hidden md:block  "
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.44762 4V20M4.19048 14.5524L20.1905 14.5524M14.4 4V20M4.19048 9.6L20.1905 9.6M4 4H20V20H4V4Z"
                      stroke={`${
                        !location.pathname.includes("saved") &&
                        !location.pathname.includes("tagged")
                          ? "#262626 "
                          : "#8e8e8e"
                      }`}
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {/* In small device */}
                  <svg
                    className="md:w-4 md:h-4 w-[9] h-[9] md:hidden"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.44762 4V20M4.19048 14.5524L20.1905 14.5524M14.4 4V20M4.19048 9.6L20.1905 9.6M4 4H20V20H4V4Z"
                      stroke={`${
                        !location.pathname.includes("saved") &&
                        !location.pathname.includes("tagged")
                          ? "#0095f6 "
                          : "#8e8e8e"
                      }`}
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {/* End of In small device */}
                  <span className="hidden md:block">POSTS</span>
                </NavLink>
                {isAuthor && (
                  // ${location.pathname.includes("saved") ? location.pathname : "saved"}
                  <NavLink
                    to={`${location.pathname}`}
                    className={` py-[1rem] text-sm flex items-center tracking-wider ${
                      location.pathname.includes("saved")
                        ? "text-[#262626] font-medium border-t md:border-[#000]"
                        : "text-[#8e8e8e] "
                    }  `}
                  >
                    <svg
                      className="md:w-3 md:h-3 w-[6] h-[6] hidden md:block mx-1 "
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.875 2H4.125C3.50625 2 3 2.44939 3 3.00481V22.4648C3 23.0202 3.36563 23.1616 3.82125 22.7728L11.5444 16.1986C11.7244 16.0471 12.0225 16.0471 12.2025 16.1936L20.1731 22.7879C20.6287 23.1666 21 23.0202 21 22.4648V3.00481C21 2.44939 20.4994 2 19.875 2ZM19.3125 20.0209L13.3444 15.0827C12.9281 14.7394 12.405 14.5677 11.8763 14.5677C11.3363 14.5677 10.8019 14.7444 10.3856 15.0979L4.6875 19.9502V3.51479H19.3125V20.0209Z"
                        fill="black"
                        stroke={`${
                          location.pathname.includes("saved")
                            ? "#262626 "
                            : "#9e9e9e "
                        }`}
                        strokeWidth="0.7"
                      />
                    </svg>
                    {/* In small device */}
                    <svg
                      className="w-[6] h-[6]  md:hidden "
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.875 2H4.125C3.50625 2 3 2.44939 3 3.00481V22.4648C3 23.0202 3.36563 23.1616 3.82125 22.7728L11.5444 16.1986C11.7244 16.0471 12.0225 16.0471 12.2025 16.1936L20.1731 22.7879C20.6287 23.1666 21 23.0202 21 22.4648V3.00481C21 2.44939 20.4994 2 19.875 2ZM19.3125 20.0209L13.3444 15.0827C12.9281 14.7394 12.405 14.5677 11.8763 14.5677C11.3363 14.5677 10.8019 14.7444 10.3856 15.0979L4.6875 19.9502V3.51479H19.3125V20.0209Z"
                        fill="black"
                        stroke={`${
                          location.pathname.includes("saved")
                            ? "#0095f6 "
                            : "#9e9e9e "
                        }`}
                        strokeWidth="0.7"
                      />
                    </svg>
                    {/* End of In small device */}
                    <span className="hidden md:block">SAVED</span>
                  </NavLink>
                )}
                {/*Tagged:  to={`${
                    location.pathname.includes("tagged") &&
                    location.pathname.includes("saved")
                      ? ""
                      : "tagged"
                  }`} */}
                <NavLink
                  to={location.pathname}
                  className={`py-[1rem] ml-[2.5rem] text-sm flex items-center tracking-wider ${
                    location.pathname.includes("tagged")
                      ? "text-[#262626] font-medium border-t md:border-[#000]"
                      : "text-[#8e8e8e]"
                  }`}
                >
                  <svg
                    className="md:w-4 md:h-4 w-[9] h-[9] mx-1"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12.5384 2.00003C12.6801 2.0016 12.8145 2.06326 12.9082 2.16969L14.7866 4.30429H19.4735C20.8542 4.30429 21.9735 5.42358 21.9735 6.8043V19.3952C21.9735 20.7759 20.8542 21.8952 19.4735 21.8952H5.5C4.11929 21.8952 3 20.7759 3 19.3952V6.8043C3 5.42358 4.11929 4.30429 5.5 4.30429H10.1935L12.1649 2.16147C12.2609 2.05714 12.3966 1.99846 12.5384 2.00003ZM12.5246 3.24747L10.7809 5.14282C10.6862 5.24573 10.5527 5.30429 10.4129 5.30429H5.5C4.67157 5.30429 4 5.97587 4 6.8043V19.3952C4 20.2236 4.67157 20.8952 5.5 20.8952H5.78935C6.04062 18.3085 8.22109 16.2866 10.8738 16.2866H13.6389C16.2916 16.2866 18.4721 18.3085 18.7234 20.8952H19.4735C20.3019 20.8952 20.9735 20.2236 20.9735 19.3952V6.8043C20.9735 5.97587 20.3019 5.30429 19.4735 5.30429H14.5606C14.4169 5.30429 14.2802 5.24248 14.1853 5.13461L12.5246 3.24747ZM17.7174 20.8952C17.4707 18.8619 15.7388 17.2866 13.6389 17.2866H10.8738C8.77392 17.2866 7.042 18.8619 6.79531 20.8952H17.7174ZM12.4405 13.9429C13.9244 13.9429 15.1274 12.7399 15.1274 11.256C15.1274 9.77211 13.9244 8.56916 12.4405 8.56916C10.9566 8.56916 9.75365 9.77211 9.75365 11.256C9.75365 12.7399 10.9566 13.9429 12.4405 13.9429ZM12.4405 14.9429C14.4767 14.9429 16.1274 13.2922 16.1274 11.256C16.1274 9.21982 14.4767 7.56916 12.4405 7.56916C10.4043 7.56916 8.75365 9.21982 8.75365 11.256C8.75365 13.2922 10.4043 14.9429 12.4405 14.9429Z"
                      fill={`${
                        location.pathname.includes("tagged")
                          ? "#262626"
                          : "#8e8e8e"
                      }`}
                    />
                    <path
                      d="M12.9082 2.16969L13.0959 2.00453V2.00453L12.9082 2.16969ZM12.5384 2.00003L12.5411 1.75005L12.5384 2.00003ZM14.7866 4.30429L14.599 4.46945L14.6736 4.55429H14.7866V4.30429ZM10.1935 4.30429V4.55429H10.3032L10.3775 4.47356L10.1935 4.30429ZM12.1649 2.16147L12.3489 2.33074V2.33074L12.1649 2.16147ZM10.7809 5.14282L10.5969 4.97356L10.7809 5.14282ZM12.5246 3.24747L12.7123 3.08231L12.5287 2.87373L12.3406 3.0782L12.5246 3.24747ZM5.78935 20.8952V21.1452H6.01624L6.03818 20.9194L5.78935 20.8952ZM18.7234 20.8952L18.4745 20.9194L18.4965 21.1452H18.7234V20.8952ZM14.1853 5.13461L13.9976 5.29977V5.29977L14.1853 5.13461ZM17.7174 20.8952V21.1452H17.9996L17.9656 20.8651L17.7174 20.8952ZM6.79531 20.8952L6.54713 20.8651L6.51314 21.1452H6.79531V20.8952ZM13.0959 2.00453C12.9554 1.84489 12.7538 1.7524 12.5411 1.75005L12.5356 2.25002C12.6065 2.2508 12.6737 2.28163 12.7205 2.33484L13.0959 2.00453ZM14.9743 4.13914L13.0959 2.00453L12.7205 2.33484L14.599 4.46945L14.9743 4.13914ZM19.4735 4.05429H14.7866V4.55429H19.4735V4.05429ZM22.2235 6.8043C22.2235 5.28551 20.9923 4.05429 19.4735 4.05429V4.55429C20.7161 4.55429 21.7235 5.56165 21.7235 6.8043H22.2235ZM22.2235 19.3952V6.8043H21.7235V19.3952H22.2235ZM19.4735 22.1452C20.9923 22.1452 22.2235 20.914 22.2235 19.3952H21.7235C21.7235 20.6379 20.7161 21.6452 19.4735 21.6452V22.1452ZM5.5 22.1452H19.4735V21.6452H5.5V22.1452ZM2.75 19.3952C2.75 20.914 3.98122 22.1452 5.5 22.1452V21.6452C4.25736 21.6452 3.25 20.6379 3.25 19.3952H2.75ZM2.75 6.8043V19.3952H3.25V6.8043H2.75ZM5.5 4.05429C3.98122 4.05429 2.75 5.28551 2.75 6.8043H3.25C3.25 5.56165 4.25736 4.55429 5.5 4.55429V4.05429ZM10.1935 4.05429H5.5V4.55429H10.1935V4.05429ZM11.9809 1.99221L10.0095 4.13503L10.3775 4.47356L12.3489 2.33074L11.9809 1.99221ZM12.5411 1.75005C12.3285 1.7477 12.1249 1.83572 11.9809 1.99221L12.3489 2.33074C12.3968 2.27857 12.4647 2.24923 12.5356 2.25002L12.5411 1.75005ZM10.9648 5.31209L12.7086 3.41673L12.3406 3.0782L10.5969 4.97356L10.9648 5.31209ZM10.4129 5.55429C10.6226 5.55429 10.8228 5.46645 10.9648 5.31209L10.5969 4.97356C10.5495 5.02501 10.4828 5.05429 10.4129 5.05429V5.55429ZM5.5 5.55429H10.4129V5.05429H5.5V5.55429ZM4.25 6.8043C4.25 6.11394 4.80964 5.55429 5.5 5.55429V5.05429C4.5335 5.05429 3.75 5.8378 3.75 6.8043H4.25ZM4.25 19.3952V6.8043H3.75V19.3952H4.25ZM5.5 20.6452C4.80964 20.6452 4.25 20.0856 4.25 19.3952H3.75C3.75 20.3617 4.5335 21.1452 5.5 21.1452V20.6452ZM5.78935 20.6452H5.5V21.1452H5.78935V20.6452ZM6.03818 20.9194C6.27713 18.4595 8.35105 16.5366 10.8738 16.5366V16.0366C8.09113 16.0366 5.80412 18.1575 5.54052 20.871L6.03818 20.9194ZM10.8738 16.5366H13.6389V16.0366H10.8738V16.5366ZM13.6389 16.5366C16.1617 16.5366 18.2356 18.4595 18.4745 20.9194L18.9722 20.871C18.7086 18.1575 16.4216 16.0366 13.6389 16.0366V16.5366ZM19.4735 20.6452H18.7234V21.1452H19.4735V20.6452ZM20.7235 19.3952C20.7235 20.0856 20.1639 20.6452 19.4735 20.6452V21.1452C20.44 21.1452 21.2235 20.3617 21.2235 19.3952H20.7235ZM20.7235 6.8043V19.3952H21.2235V6.8043H20.7235ZM19.4735 5.55429C20.1639 5.55429 20.7235 6.11394 20.7235 6.8043H21.2235C21.2235 5.8378 20.44 5.05429 19.4735 5.05429V5.55429ZM14.5606 5.55429H19.4735V5.05429H14.5606V5.55429ZM13.9976 5.29977C14.14 5.46157 14.3451 5.55429 14.5606 5.55429V5.05429C14.4888 5.05429 14.4204 5.02339 14.3729 4.96945L13.9976 5.29977ZM12.3369 3.41263L13.9976 5.29977L14.3729 4.96945L12.7123 3.08231L12.3369 3.41263ZM17.9656 20.8651C17.7039 18.7078 15.8667 17.0366 13.6389 17.0366V17.5366C15.6108 17.5366 17.2376 19.016 17.4692 20.9253L17.9656 20.8651ZM13.6389 17.0366H10.8738V17.5366H13.6389V17.0366ZM10.8738 17.0366C8.64597 17.0366 6.80886 18.7078 6.54713 20.8651L7.04349 20.9253C7.27513 19.016 8.90188 17.5366 10.8738 17.5366V17.0366ZM17.7174 20.6452H6.79531V21.1452H17.7174V20.6452ZM14.8774 11.256C14.8774 12.6019 13.7864 13.6929 12.4405 13.6929V14.1929C14.0625 14.1929 15.3774 12.878 15.3774 11.256H14.8774ZM12.4405 8.81916C13.7864 8.81916 14.8774 9.91018 14.8774 11.256H15.3774C15.3774 9.63404 14.0625 8.31916 12.4405 8.31916V8.81916ZM10.0036 11.256C10.0036 9.91018 11.0947 8.81916 12.4405 8.81916V8.31916C10.8185 8.31916 9.50365 9.63404 9.50365 11.256H10.0036ZM12.4405 13.6929C11.0947 13.6929 10.0036 12.6019 10.0036 11.256H9.50365C9.50365 12.878 10.8185 14.1929 12.4405 14.1929V13.6929ZM15.8774 11.256C15.8774 13.1542 14.3386 14.6929 12.4405 14.6929V15.1929C14.6148 15.1929 16.3774 13.4303 16.3774 11.256H15.8774ZM12.4405 7.81916C14.3386 7.81916 15.8774 9.3579 15.8774 11.256H16.3774C16.3774 9.08175 14.6148 7.31916 12.4405 7.31916V7.81916ZM9.00365 11.256C9.00365 9.3579 10.5424 7.81916 12.4405 7.81916V7.31916C10.2662 7.31916 8.50365 9.08175 8.50365 11.256H9.00365ZM12.4405 14.6929C10.5424 14.6929 9.00365 13.1542 9.00365 11.256H8.50365C8.50365 13.4303 10.2662 15.1929 12.4405 15.1929V14.6929Z"
                      fill={`${
                        location.pathname.includes("tagged")
                          ? "#262626"
                          : "#8e8e8e"
                      }`}
                    />
                  </svg>
                  <span className="hidden md:block">TAGGED</span>
                </NavLink>
              </div>
              <div className="w-full">
                <>
                  {data && !loadingPost && (
                    <>
                      {console.log("changing in profile")}
                      <div className="flex mb-[2rem] w-full">
                        <MasonryLayoutProfile
                          posts={data}
                          col={3}
                          user={user && user}
                        />
                      </div>
                    </>
                  )}
                </>
              </div>
            </div>
          </>
        )}
      </div>
      {!user && !loadingUser && (
        <p className="font-medium absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          404 Not Found
        </p>
      )}
    </>
  );
};

export default UserProfile;
