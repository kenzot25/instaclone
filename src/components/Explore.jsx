import React, { useState, useEffect } from "react";
import { client } from "../client";
import { MasonryLayoutExplore } from "./MasonryLayout";
import Spinner from "./UI/Spinner";
import { feedQuery } from "../utils/data";

// import { useParams } from "react-router-dom";

const Explore = ({ user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState(null);
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    client.fetch(feedQuery).then((data) => {
      if (!isCancelled) {
        setPosts(data);
        setTimeout(() => {
          setIsLoading(false);
        }, 400);
      }
    });
    console.log("Explore Effect");
    return () => {
      isCancelled = true;
    };
  }, [user?.id]);
  if (isLoading) return <Spinner />;
  if (!posts?.length)
    return <h2 className="my-8 text-center">No post avalible</h2>;
  return (
    <>
      <div className="mt-[8rem] flex mb-[2rem]">
        {posts && !isLoading && (
          <>
            <MasonryLayoutExplore posts={posts} col={3} user={user && user} />
          </>
        )}
      </div>
    </>
  );
};

export default Explore;
