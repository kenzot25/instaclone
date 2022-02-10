import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Feed from "../components/Feed/Feed";
import Search from "../components/Search";
import Explore from "../components/Explore";
import PostDetail from "../components/Feed/Post/PostDetail";
// import { useEffect } from "react";

const Posts = ({ user }) => {
  document.body.style.overflowY = "scroll";
  // const navigate = useNavigate();
  // const location = useLocation();
  // useCallback(() => {
  //   navigate("/");
  // }, [location.pathname]);
  const [searchTerm, setSearchTerm] = useState("");
  console.log("Changed in Posts");
  return (
    <>
      <div className="flex flex-col justify-between  mx-auto  lg:w-[70%] md:w-[80%]  w-full">
        <div className="h-auto w-full">
          <Routes>
            <Route path="/explore" element={<Explore user={user && user} />} />
            <Route
              path="/search"
              element={
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              }
            />

            <Route
              path={`/p/:postID`}
              element={<PostDetail user={user && user} />}
            />
            <Route path={`/p/`} element={<Feed user={user && user} />} />
            <Route path="/*" element={<Feed user={user && user} />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Posts;
