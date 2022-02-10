import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ProfilePopUp = ({ user, onClickOutSide }) => {
  const ref = useRef();
  const navigate = useNavigate();
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      onClickOutSide();
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });
  const logoutHandler = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div ref={ref} className="relative mx-auto z-[0]  text-[.8rem]  ">
      <div className="noti_before absolute text-[#fff] right-[5px] bottom-[-1rem] z-[10]"></div>
      <div className="flex flex-col justify-between  w-[15rem] h-[13rem] bg-[#fff]  text-[#fff] absolute right-[-20px] bottom-[-13.9rem] z-1 rounded-lg shadow-noti">
        <div className="text-[#000] h-[80%] flex flex-col justify-evenly">
          <div
            className="flex flex-row items-center"
            onClick={() => navigate(`/profile/${user?._id}`)}
          >
            <img
              alt=""
              className="w-4 h-4 m-2"
              src={process.env.PUBLIC_URL + "/user-icon.svg"}
            />
            <p>Profile</p>
          </div>
          <div
            className="flex flex-row items-center"
            onClick={() => navigate(`/profile/${user?._id}/saved`)}
          >
            <img
              alt=""
              className="w-4 h-4 m-2"
              src={process.env.PUBLIC_URL + "/icons/bookmark.svg"}
            />
            <p>Saved</p>
          </div>
          <div
            className="flex flex-row items-center"
            onClick={() => navigate(`/accounts/edit/`)}
          >
            <img
              alt=""
              className="w-4 h-4 m-2"
              src={process.env.PUBLIC_URL + "/icons/settings.svg"}
            />
            <p>Settings</p>
          </div>
          <div className="flex flex-row items-center">
            <img
              alt=""
              className="w-4 h-4 m-2"
              src={process.env.PUBLIC_URL + "/icons/switch.svg"}
            />
            <p>Switch Accounts</p>
          </div>
        </div>
        <div
          className="h-[20%] border-t border-slate-400 p-2 text-[#000]"
          onClick={logoutHandler}
        >
          Log Out
        </div>
      </div>
    </div>
  );
};
export const NotiPopUp = ({ onClickOutSide }) => {
  const ref = useRef();
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      onClickOutSide();
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });
  return (
    <>
      <div
        ref={ref}
        className="relative mx-auto z-[0]  text-[0.8rem]  mt-[1.6rem]"
      >
        <div className="noti_before absolute text-[#fff] right-[10px] bottom-[-1rem] z-[10]"></div>
        <div className="flex flex-col justify-center items-center py-[4rem] px-[1rem] md:w-[30rem] w-[20rem] h-[15rem] bg-[#fff] text-center text-[#fff] absolute right-[-20px] bottom-[-15.9rem] z-1 rounded-lg shadow-noti">
          <img
            alt=""
            className="w-[4rem] h-[4rem]"
            src={process.env.PUBLIC_URL + "/icons/heart-noti.svg"}
          />
          <p className="text-[#000] my-[.8rem]">Activity On Your Posts</p>
          <p className="text-[#000]">
            When someone likes or comments on one of your posts, you'll see it
            here.
          </p>
        </div>
      </div>
    </>
  );
};
