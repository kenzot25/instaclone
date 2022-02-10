import React, { useState, useEffect, Suspense, lazy } from "react";
import { client } from "../client";

import { userQuery } from "../utils/data";
import { fetchUser } from "../utils/helper";
import { Route, Routes, useNavigate } from "react-router-dom";
// import Posts from "./Posts";
import Navbar from "../components/Navbar/Navbar";
import Spinner from "../components/UI/Spinner";
import Main from "../components/Account/Main";
// import CreatePost from "../components/Feed/Post/CreatePost";
const UserProfile = lazy(() => import("./UserProfile"));
const Posts = lazy(() => import("./Posts"));
const Home = () => {
  const navigate = useNavigate();
  const [urlAvatarAfterChanged, setUrlAvatarAfterChanged] = useState(null);
  const [user, setUser] = useState(null);
  // const [isBackDropOpen, setIsBackDropOpen] = useState(true);
  // const createHanlder = () => {
  //   // setCreate((prev) => !prev);
  //   window.scrollTo(0, 0);
  // };
  // const closeModalHandler = () => {
  //   setIsBackDropOpen(false);
  //   navigate("/", { replace: true });
  // };

  useEffect(() => {
    let isCancelled = false;
    console.log("Home Effect");
    fetchUser().then((data) => {
      if (!data) {
        return navigate("/login");
      }
      let userInfo = data;
      let id = userInfo?.id;
      const query = userQuery(id);
      client.fetch(query).then((data) => {
        console.log("Fetch user data in Home");
        if (!isCancelled && data) {
          const userdata = { ...data[0] };
          setUser(userdata);
        }
      });
    });
    if (window.location.pathname === "/create") {
      navigate("/");
    }
    console.log("Home Effect");
    return () => {
      isCancelled = true;
    };
  }, [navigate]);

  const fetchDataAfterChanged = (url) => {
    // setNeedToFetchData((prev) => !prev);
    setUrlAvatarAfterChanged(url);
  };

  return (
    <Suspense fallback={<Spinner />}>
      <div className="flex flex-col  w-full">
        <div className="w-full ">
          <Navbar urlAvatarAfterChanged={urlAvatarAfterChanged} />
        </div>
        <div className="flex-1   mx-auto w-full mb-[2rem]">
          <Routes>
            <Route
              path="/profile/:userId/*"
              element={
                <UserProfile
                  currentUser={user && user}
                  fetchDataAfterChanged={(url) => fetchDataAfterChanged(url)}
                />
              }
            />
            <Route
              path="/accounts/*"
              element={
                <Main
                  user={user && user}
                  fetchDataAfterChanged={(url) => fetchDataAfterChanged(url)}
                />
              }
            />
            <Route
              path="/direct/inbox/"
              element={
                <p className="text-center h-[50vh] mt-[20rem]">
                  We're updating message feature.
                </p>
              }
            />
            {/* <Route
              path="/create"
              element={
                <CreatePost
                  user={user}
                  onCreate={createHanlder}
                  isBackDropOpen={isBackDropOpen}
                  closeModal={closeModalHandler}
                />
              }
            /> */}
            <Route path="/*" element={<Posts user={user && user} />} />
            {/* <Route
              path="*"
              element={
                <p className="font-medium absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                  404 Not Found
                </p>
              }
            /> */}
          </Routes>
        </div>
        <p className="text-xs text-[#8e8e8e] text-center   pb-[2rem] ">
          © 2022 INSTAGRAM FROM TOANDEV
        </p>
      </div>
    </Suspense>
  );
};

export default Home;
