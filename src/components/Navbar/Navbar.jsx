import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import classes from "./Navbar.module.css";
import { NotiPopUp, ProfilePopUp } from "../UI/Popup";
import { fetchUser } from "../../utils/helper";
import { client } from "../../client";
import { userQuery } from "../../utils/data";
import Modal from "react-modal";
import CreatePost from "../Feed/Post/CreatePost";

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
    border: "none",
  },
};
Modal.setAppElement("#modal--overlay");

const Navbar = ({ urlAvatarAfterChanged }) => {
  // const navigate = useNavigate();
  const [user, setUser] = useState(null);
  // const [modalIsOpen, setIsOpen] = useState(false);
  const location = useLocation();
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

  const [focus, setFocus] = useState(false);
  // Control button state

  const [isProfile, setIsProfile] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [activeNav, setActiveNav] = useState({ previous: "", current: "" });
  useEffect(() => {
    if (location.pathname === "/direct/inbox/") {
      setActiveNav((prev) => {
        return { ...prev, current: "message", previous: "message" };
      });
    } else if (location.pathname === "/explore") {
      setActiveNav((prev) => {
        return { ...prev, current: "explore", previous: "explore" };
      });
    } else {
      setActiveNav((prev) => {
        return { ...prev, current: "home", previous: "home" };
      });
    }
  }, [location.pathname]);
  //
  const notiHanlder = () => {
    setActiveNav((prev) => {
      return { ...prev, current: "noti" };
    });
    //
    setIsProfile(false);
    // if (activeNav.current === "noti") {
    //   setIsNoti(false);
    // } else {
    //   setIsNoti(true);
    // }
    // isNoti ? setIsNoti(false) : setIsNoti(true);
  };
  const closeHandler = () => {
    setActiveNav({ current: activeNav.previous, previous: activeNav.previous });
    document.body.style.overflowY = "scroll";
    window.history.back();
    setIsCreate(false);
    setIsProfile(false);
    // navigate("/");
  };
  return (
    <header className="bg-white  py-[.7rem] fixed w-full z-30 p-0 m-0 border border-b-[#DADADA] px-[1rem] ">
      <div className="  flex justify-between items-center  lg:w-[70%] md:w-[78%]  w-[85%] mx-auto ">
        <div className="text-center logo lg:text-2xl text-[1.5rem] ">
          <NavLink to={"/"} className="m-0 cursor-pointer">
            {/* Instagram */}
            {<img alt="" className="p-0 m-0" src={process.env.PUBLIC_URL + "/logo.svg"}/>}
          </NavLink>
        </div>
        <div className="flex  items-center bg-[#EFEFEF] rounded-lg  w-[17rem] hidden md:flex  h-[2.3rem] ml-[10rem]">
          <img
            alt=""
            className={` h-[1rem] mx-2 ${focus && "hidden"}`}
            src="https://img.icons8.com/ios-glyphs/30/000000/search--v2.png"
          />
          <input
            onFocus={() => {
              setFocus(true);
            }}
            onBlur={() => setFocus(false)}
            className="bg-[#EFEFEF]  rounded-lg outline-0 px-2 h-full w-full"
            placeholder="Search"
          />
        </div>
        <div className="flex justify-between items-center ">
          {/* //Home */}
          <NavLink
            to={`/`}
            onClick={() => {
              setActiveNav((prev) => {
                return { ...prev, current: "home", previous: "home" };
              });
              // setIsNoti(false);
              setIsCreate(false);
              window.scrollTo(0, 0);
            }}
            className={() =>
              activeNav.current === "home"
                ? classes["home-active"]
                : classes.home
            }
          ></NavLink>
          {/* // message */}
          <NavLink
            to={`/direct/inbox/`}
            onClick={() => {
              setActiveNav((prev) => {
                return { ...prev, current: "message", previous: "message" };
              });
              // setIsNoti(false);
              setIsCreate(false);
            }}
            className={() =>
              activeNav.current === "message"
                ? classes["message-active"]
                : classes.message
            }
          ></NavLink>
          {/* // create  */}
          {!isCreate && (
            <div
              id="notification"
              onClick={() => {
                setActiveNav((prev) => {
                  return { ...prev, current: "create" };
                });
                document.body.style.overflowY = "hidden";
                window.history.pushState(null, "Title", `/create`);
                setIsCreate(true);
                setIsProfile(false);
              }}
              className={classes.create}
            ></div>
          )}
          {isCreate && (
            <div
              id="notification"
              onClick={closeHandler}
              className={classes["create-active"]}
            ></div>
          )}

          <Modal
            isOpen={isCreate}
            // onAfterOpen={afterOpenModal}
            onRequestClose={closeHandler}
            style={customStyles}
            contentLabel="Modal"
          >
            <CreatePost closeModal={closeHandler} />
          </Modal>

          {/* Explore */}
          <NavLink
            to={`/explore`}
            onClick={() => {
              // setIsNoti(false);
              setActiveNav((prev) => {
                return { ...prev, current: "explore", previous: "explore" };
              });
            }}
            className={() =>
              activeNav.current === "explore"
                ? classes["explore-active"]
                : classes.explore
            }
          ></NavLink>
          {/*  notification */}

          <>
            {activeNav.current !== "noti" && (
              <div
                id="notification"
                onClick={notiHanlder}
                className={classes.noti_nonactive}
              ></div>
            )}
            {activeNav.current === "noti" && (
              <div
                id="notification"
                onClick={notiHanlder}
                className={classes.noti_active}
              ></div>
            )}

            {activeNav.current === "noti" && (
              <NotiPopUp
                onClickOutSide={() => {
                  // setIsNoti(false);
                  setActiveNav({
                    current: activeNav.previous,
                    previous: activeNav.previous,
                  });
                }}
              />
            )}
          </>

          <div
            className="mx-2 cursor-pointer"
            onClick={() => {
              setActiveNav((prev) => {
                return { ...prev, current: "profile" };
              });
              setIsProfile((prev) => !prev);
              // setIsNoti(false);
            }}
          >
            <img
              src={urlAvatarAfterChanged ? urlAvatarAfterChanged : user?.avatar}
              className="w-[1.75rem] h-[1.75rem]  rounded-full"
              alt="user-profile"
            />
            {isProfile && (
              <ProfilePopUp
                user={user && user}
                onClickOutSide={() => {
                  setIsProfile(false);
                  setActiveNav({
                    current: activeNav.previous,
                    previous: activeNav.previous,
                  });
                }}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
