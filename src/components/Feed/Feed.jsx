import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { client } from "../../client";
import { MasonryLayoutFeed } from "../MasonryLayout";
import Spinner from "../UI/Spinner";

import { feedQuery } from "../../utils/data";

// import CreatePost from "./Post/CreatePost";
// import PostDetail from "./PostDetail";
const Feed = ({ user }) => {
  // const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState(null);
  const [create, setCreate] = useState(false);

  // const pathname = window.location.pathname;
  useEffect(() => {
    // if (pathname === "/create") {
    //   setIsBackDropOpen(true);
    // }

    //  if() setIsBackDropOpen(true)
    let isCancelled = false;
    client.fetch(feedQuery).then((data) => {
      if (!isCancelled) {
        setPosts(data);
        setIsLoading(false);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [user, create]);
  if (isLoading) return <Spinner />;
  if (!posts?.length)
    return <h2 className="my-8 text-center">No post avalible</h2>;

  return (
    <>
      <div className="mt-[4rem] flex  lg:w-8/12 ">
        <div className=" w-full mx-auto">
          {posts && (
            <MasonryLayoutFeed
              posts={posts}
              col={1}
              user={user && user}
              fetchDataAfterDelete={() => setCreate((prev) => !prev)}
            />
          )}
        </div>

        <div className="hidden lg:block">
          <div className="fixed w-full h-[30rem]  my-[4rem] flex flex-col justify-between px-[2rem]">
            <div className="flex items-center">
              <Link to={`/profile/${user?._id}`}>
                <img
                  className="w-[3.5rem] h-[3.5rem] rounded-full mr-[1.2rem]"
                  src={user?.avatar}
                  alt="avatar"
                />
              </Link>
              <div className="flex flex-col justify-around ">
                <Link
                  to={`/profile/${user?._id}`}
                  className="font-medium text-sm"
                >
                  {user?.username}
                </Link>

                <p className="text-[#8e8e8e] text-sm ">{user?.fullname}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Feed;
