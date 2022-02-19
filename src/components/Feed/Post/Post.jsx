import React, { useEffect, Suspense, lazy } from "react";
// Swipper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useState } from "react";
// import { client } from "../../../client";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../UI/Spinner";
import {
  addCommentHelper,
  likePostHelper,
  savePostHelper,
} from "../../../utils/helper";
import Picker from "emoji-picker-react";
// import Modal from "react-modal";
import PostOptions from "./PostOptions";
import { client } from "../../../client";
// import PostDetail from "./PostDetail";
// import { v4 as uuidv4 } from "uuid";
//  Lazy loading import
const { SKIN_TONE_MEDIUM_DARK } = lazy(() => import("emoji-picker-react"));
const ReactTimeAgo = lazy(() => import("react-time-ago"));
// const Modal = lazy(() => import("../../UI/Modal"));
const Loading = lazy(() => import("../../UI/Loading"));

// Main Func
const Post = ({ post, user, fetchDataAfterDelete }) => {
  // console.log(post);
  const navigate = useNavigate();
  const [isAuthor, setIsAuthor] = useState(false);
  // const [isBackDropOpen, setIsBackDropOpen] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);

  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  // const [deletingPost, setDeletingPost] = useState(false);
  const [isEmoji, setIsEmoji] = useState();
  const [numsLike, setNumsLike] = useState(null);
  const [doubleTapImage, setDoubleTapImage] = useState(false);
  // Handler 3 dots button
  const clickControlHandler = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };
  const closeHandler = () => {
    setIsOpen(false);
    document.body.style.overflowY = "scroll";
  };

  // End of handler 3 dots
  // Handler Like button
  const [isLiked, setIsLiked] = useState(false);
  const likePostHandler = ({ type }) => {
    if (type === "onlyLike") {
      if (!isLiked) {
        setIsLiked(true);
        setNumsLike((prev) => prev + 1);
        likePostHelper("like", post, user);
      }
      return;
    }
    //
    if (!isLiked) {
      setIsLiked(true);
      setNumsLike((prev) => prev + 1);
      likePostHelper("like", post, user);
    } else {
      setIsLiked(false);
      setNumsLike((prev) => prev - 1);
      likePostHelper("unlike", post, user);
    }
  };
  // End of handler like btn
  // Handler num of likes in post
  useEffect(() => {
    if (post?.postedBy._id === user?._id) {
      setIsAuthor(true);
    }
    if (!post.like) {
      setIsLiked(false);
    } else {
      setNumsLike(post?.like?.length);
      post.like.map((wholike) => {
        if (wholike?.postedBy?._id === user?._id) {
          setIsLiked(true);
        }
        return null;
      });
    }
  }, [post.like, post?.postedBy._id, user?._id]);

  const addComment = () => {
    if (comment) {
      setAddingComment(true);
      addCommentHelper(post._id, user, comment, () => {
        navigate(`/p/${post._id}`);
      });
      setComment("");
      setAddingComment(false);
      // navigate(`/p/${post._id}`);
    }
  };
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
  };
  useEffect(() => {
    if (doubleTapImage) {
      setTimeout(() => {
        setDoubleTapImage(false);
      }, 1000);
    }

    chosenEmoji && setComment((prev) => prev + `${chosenEmoji.emoji}`);
  }, [chosenEmoji, doubleTapImage]);
  // Hanlder save post
  const alreadySaved = !!post.save?.filter(
    (item) => item?.postedBy?._id === user?._id
  )?.length;
  const [isSaved, setIsSaved] = useState(alreadySaved);
  const savePost = () => {
    if (!isSaved) {
      setIsSaved(true);
      savePostHelper("save", post._id, user._id);
    } else {
      setIsSaved(false);
      savePostHelper("unsave", post._id, user._id);
    }
  };
  const [isFollowing, setIsFollowing] = useState(() => {
    client.fetch(`*[_id =="${post.postedBy._id}"]`).then((data) => {
      data[0].follower.map((u) => {
        if (u.userId === user._id) {
          console.log("following");
          return setIsFollowing(true);
        }
        return null;
      });
    });
  });
  return (
    <>
      <Suspense fallback={<Spinner />}>
        {modalIsOpen && (
          <PostOptions
            modalIsOpen={modalIsOpen}
            closeHandler={closeHandler}
            isAuthor={isAuthor}
            userID={user._id}
            post={post}
            fetchDataAfterDelete={fetchDataAfterDelete}
            isFollowing={isFollowing}
            changeFollowState={() => {
              setIsFollowing((prev) => !prev);
            }}
          />
        )}
        <div className="bg-[#fff] mt-8 flex flex-col border-[1px] ">
          {/* Avatar and name */}
          <div className="flex items-center justify-between my-2 px-4">
            <div className="flex items-center flex-row">
              <Link to={`/profile/${post?.postedBy._id}`}>
                <img
                  className="rounded-full w-10 h-10 mr-4 cursor-pointer"
                  src={post.postedBy.avatar}
                  alt="user avatar"
                />
              </Link>
              <Link to={`/profile/${post?.postedBy._id}`}>
                <p className="font-medium username cursor-pointer">
                  {post.postedBy.username}
                </p>
              </Link>
            </div>
            {/* ... button */}
            <div
              onClick={clickControlHandler.bind(
                null,
                post.postedBy._id,
                post._id
              )}
            >
              <img
                alt="loading-icon"
                className="w-6 cursor-pointer"
                src={process.env.PUBLIC_URL + "/icons/more.svg"}
              />
            </div>
          </div>
          {/* Image */}
          <div className="mb-4 relative overflow-hidden w-full  aspect-square">
            {post && (
              <div className="w-full  aspect-square">
                <Swiper
                  modules={[Navigation, Pagination, A11y]}
                  navigation
                  pagination={{ clickable: true }}
                >
                  {post?.images?.map((img) => (
                    <SwiperSlide key={img._key}>
                      <div className="w-full h-full ">
                        <img
                          onDoubleClick={() => {
                            setDoubleTapImage(true);
                            likePostHandler({ type: "onlyLike" });
                          }}
                          alt="slide-img"
                          className="absolute object-center object-cover h-full w-full"
                          src={img?.asset?.url}
                        />
                        {doubleTapImage && (
                          <img
                            alt=""
                            className={`z-[40] absolute opacity-80 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] animate-like`}
                            src={
                              process.env.PUBLIC_URL + "/icons/heart-white.svg"
                            }
                          />
                        )}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
          {/* Button control */}
          <div className="flex flex-row justify-between px-4">
            <div className="flex items-center ">
              {/* Like btn */}
              <img
                alt="like-btn"
                onClick={likePostHandler}
                className="w-7 h-7 mr-4 cursor-pointer"
                src={`${
                  !isLiked
                    ? `${process.env.PUBLIC_URL + "/icons/heart.svg"}`
                    : `${process.env.PUBLIC_URL + "/icons/heart-red.svg"}`
                }`}
              />
              {/* Comment btn */}
              <img
                onClick={(e) => {
                  e.target.parentElement.parentElement.parentElement.lastElementChild
                    .querySelector("input")
                    .focus();
                }}
                alt="comment-btn"
                className="w-7 h-7 mr-4 cursor-pointer"
                src={process.env.PUBLIC_URL + "/icons/comment.svg"}
              />
              {/* Send btn */}
              <img
                alt="send-btn"
                className="w-7 h-7 mr-4 cursor-pointer"
                src={process.env.PUBLIC_URL + "/icons/share.svg"}
              />
            </div>
            {/* Save btn */}
            <div>
              <img
                onClick={savePost}
                alt="save-btn"
                className="w-6 h-6 cursor-pointer"
                src={`${
                  !isSaved
                    ? `${process.env.PUBLIC_URL + "/icons/bookmark.svg"}`
                    : `${process.env.PUBLIC_URL + "/icons/bookmark-fill.svg"}`
                }`}
              />
            </div>
          </div>
          {/* Infomation of post */}
          <div className="px-4 mt-4 mb-2 font-medium">
            {numsLike?.length === 0 ||
              (!numsLike && (
                <p className="font-normal">Be the first one like this post!</p>
              ))}
            {numsLike === 1 && <p>{numsLike} like</p>}
            {numsLike > 1 && <p>{numsLike} likes</p>}
          </div>
          <div className="px-4 flex mb-2">
            <p className="font-medium mr-2">{post.postedBy.username}</p>
            <p>{post?.description}</p>
          </div>
          {post.comments?.length > 0 && (
            <>
              <Link
                to={`/p/${post?._id}`}
                className="text-[#8e8e8e] px-4 cursor-pointer mb-1 "
              >
                View all {post.comments?.length}{" "}
                {post.comments?.length === 1 ? "comment" : "comments"}
              </Link>
              <p className="text-[#8e8e8e] text-[.6rem] uppercase px-4 cursor-pointer mb-4">
                <ReactTimeAgo
                  date={Date.parse(post?._createdAt)}
                  locale="en-US"
                  className=""
                />
              </p>
            </>
          )}

          <div className="flex border-t-[1px] py-3 px-4 items-center relative">
            {isEmoji && (
              <div className="absolute bottom-[3.5rem] left-[0] z-[10]">
                <Picker
                  onEmojiClick={onEmojiClick}
                  disableAutoFocus={true}
                  skinTone={SKIN_TONE_MEDIUM_DARK}
                  groupNames={{ smileys_people: "PEOPLE" }}
                  native
                />
              </div>
            )}
            <img
              onClick={() => setIsEmoji((prev) => !prev)}
              alt="emoji-btn"
              className="w-6 h-6 "
              src={process.env.PUBLIC_URL + "/icons/emoji-btn.svg"}
            />

            <input
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              className="px-4 py-1 w-full outline-none"
              type="text"
              placeholder="Add a comment..."
            />
            {!addingComment ? (
              <button
                disabled={comment.length === 0}
                onClick={addComment}
                className={`text-[#0095f6]  font-medium cursor-pointer ${
                  comment.length > 0 ? "opacity-100" : "opacity-30"
                }`}
              >
                Post
              </button>
            ) : (
              <Loading />
            )}
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default Post;
