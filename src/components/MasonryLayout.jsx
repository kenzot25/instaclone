import React from "react";
import Masonry from "react-masonry-css";

import Post from "./Feed/Post/Post";

import PreviewPost from "./PreviewPost";
// import InfiniteScroll from 'react-infinite-scroll-component';
const breakPointObj = {
  default: 3,
  3000: 3,
  2000: 3,
  600: 2,
};
export const MasonryLayoutFeed = ({
  posts,
  col,
  user,
  fetchDataAfterDelete,
}) => {
  return (
    <Masonry className="flex animate-slide-fwd w-full" breakpointCols={col}>
      {posts?.map((post) => (
        <Post
          key={post._id}
          post={post}
          user={user && user}
          fetchDataAfterDelete={fetchDataAfterDelete}
        />
      ))}
      {/* </InfiniteScroll> */}
    </Masonry>
  );
};
export const MasonryLayoutProfile = ({ posts, col, user }) => {
  return (
    <Masonry className="flex animate-slide-fwd w-full" breakpointCols={col}>
      {posts?.map((post) => (
        <PreviewPost
          key={post._id}
          post={post}
          user={user && user}
          
        />
      ))}
    </Masonry>
  );
};
export const MasonryLayoutExplore = ({ posts, user }) => {
  console.log("In masonry layout for explore");
 
  return (
    <>
      <Masonry
        className="flex animate-slide-fwd w-full"
        breakpointCols={breakPointObj}
      >
        {posts?.map((post) => (
          <PreviewPost key={post._id} post={post} user={user && user} />
        ))}
      </Masonry>
    </>
  );
};
// export default MasonryLayout;
