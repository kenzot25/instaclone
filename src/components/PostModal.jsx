import React, { useState, useEffect, Suspense, lazy } from "react";
import { Link, useNavigate } from "react-router-dom";

import { client } from "../client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper";
// import Modal from "./UI/Modal";
import { v4 as uuidv4 } from "uuid";
import Spinner from "./UI/Spinner";
// import { MasonryLayoutExplore } from "../../MasonryLayout";
import Loading from "./UI/Loading";
import Picker from "emoji-picker-react";
import {
  addCommentHelper,
  deleteCommentHelper,
  getInfo,
  likePostHelper,
  savePostHelper,
} from "../utils/helper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// const Modal = lazy(() => import("./UI/Modal"));

import Modal from "react-modal";
import PostOptions from "./Feed/Post/PostOptions";
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
// lazy import
const { SKIN_TONE_MEDIUM_DARK } = lazy(() => import("emoji-picker-react"));
const ReactTimeAgo = lazy(() => import("react-time-ago"));
// main func
const mainUser = getInfo();
const PostModal = ({ user, post }) => {
  // State
  // console.log(user);
  // console.log("Post in postmodal: ");
  // console.log(post);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isAuthorComment, setIsAuthorComment] = useState(false);
  const [isPostOptions, setIsPostOptions] = useState(false);

  const [numsLike, setNumsLike] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);

  const [isLiked, setIsLiked] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [isEmoji, setIsEmoji] = useState();
  const [isCommentOptions, setIsCommentOptions] = useState(false);
  const [commentID, setCommentID] = useState("");
  const [doubleTapImage, setDoubleTapImage] = useState(false);
  //
  const navigate = useNavigate();
  // Func Helper

  //
  const likePostHandler = ({ type }) => {
    if (type === "onlyLike") {
      if (!isLiked) {
        setIsLiked(true);
        setNumsLike((prev) => prev + 1);
        likePostHelper("like", post, user);
      }
      return;
    }
    if (!isLiked) {
      likePostHelper("like", post, user);
      setIsLiked(true);
      setNumsLike((prev) => prev + 1);
    } else {
      likePostHelper("unlike", post, user);
      setIsLiked(false);
      setNumsLike((prev) => prev - 1);
    }
  };
  //

  // Hanlder save
  const [isSaved, setIsSaved] = useState(false);

  const savePost = () => {
    if (!isSaved) {
      setIsSaved(true);
      savePostHelper("save", post._id, user._id);
    } else {
      setIsSaved(false);
      savePostHelper("unsave", post._id, user._id);
    }
  };

  useEffect(() => {
    // Like
    // console.log(post)
    let isCancelled = false;
    // console.log("Post changed in post modal");
    // console.log(post);
    if (post) {
      if (post?.postedBy?._id === mainUser.id) {
        setIsAuthor(true);
      }
      if (!post.like) {
        !isCancelled && setIsLiked(false);
      } else {
        !isCancelled && setNumsLike(post?.like?.length);
        post.like.map((wholike) => {
          console.log(wholike?.postedBy?._id, mainUser.id);
          if (wholike?.postedBy?._id === mainUser.id && !isCancelled) {
            return setIsLiked(true);
          } else return null;
        });
      }
      const alreadySaved = !!post.save?.filter(
        (item) => item?.postedBy?._id === mainUser.id
      )?.length;
      setIsSaved(alreadySaved);
    }
    // Save
    return () => {
      isCancelled = true;
    };
  }, [post, post._id, addingComment, user?._id]);

  // Handler post
  const clickControlHandler = () => {
    setIsOpen(true);
    setIsPostOptions(true);
    document.body.style.overflow = "hidden";
  };
  const closeHandler = () => {
    setIsOpen(false);
    setIsPostOptions(false);
    setIsAuthorComment(false);
    document.body.style.overflowY = "scroll";
  };
  const deletePostHandler = async () => {
    await client.delete(post._id);
    navigate("/");
  };
  // End of Handler post
  // Handler Comment
  const addComment = () => {
    if (comment) {
      setAddingComment(true);
      addCommentHelper(post._id, user, comment);
      setTimeout(() => {
        // fetchPostDetail();
        setComment("");
        setAddingComment(false);
      }, 1000);
    }
  };
  const commentOptionsHanlder = (comment) => {
    setCommentID(comment._key);
    if (comment.postedBy._id === user?._id) {
      setIsAuthorComment(true);
    } else {
      setIsAuthorComment(false);
    }
    setIsOpen(true);
    setIsCommentOptions(true);
    document.body.style.overflow = "hidden";
  };
  const deleteCommentHandler = () => {
    deleteCommentHelper(post._id, commentID);
    setCommentID("");
    closeCommentOptionsHandler();
  };
  const closeCommentOptionsHandler = () => {
    setIsOpen(false);
    setIsCommentOptions(false);
    setIsAuthorComment(false);
    document.body.style.overflowY = "scroll";
  };
  // End of Hanlder comment
  // Emoji
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
  // End of emoji

  const headerComponent = (
    <div className="flex items-center px-[1rem] py-[1rem] border-b border-slate-200">
      <img
        alt="avartar"
        onClick={() => navigate(`/profile/${post?.postedBy?._id}`)}
        className="w-8 h-8 rounded-full "
        src={post?.postedBy?.avatar}
      />
      <div className="flex flex-row justify-between w-full ml-[1rem]">
        <p
          className=" font-medium text-base cursor-pointer"
          onClick={() => navigate(`/profile/${post?.postedBy?._id}`)}
        >
          {post?.postedBy?.username}
        </p>
        {/* ... btn */}
        <div
          onClick={clickControlHandler.bind(
            null,
            post?.postedBy?._id,
            post?._id
          )}
        >
          <img
            alt="loading-btn"
            className="w-6 cursor-pointer"
            src={process.env.PUBLIC_URL + "/icons/more.svg"}
          />
        </div>
      </div>
    </div>
  );
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
    <Suspense fallback={<Spinner />}>
      {isPostOptions && post && (
        <PostOptions
          modalIsOpen={modalIsOpen}
          closeHandler={closeHandler}
          isAuthor={isAuthor}
          userID={user._id}
          post={post}
          deletePostHandler={deletePostHandler}
          isFollowing={isFollowing}
          changeFollowState={() => {
            setIsFollowing((prev) => !prev);
          }}
        />
      )}
      {isCommentOptions && post && (
        <Modal
          isOpen={isCommentOptions}
          onRequestClose={closeCommentOptionsHandler}
          style={customStyles}
          contentLabel="Modal"
        >
          <div className="text-center flex flex-col  justify-between h-[15vh] w-[25rem] ">
            {!isAuthorComment && (
              <>
                <p className="cursor-pointer text-[#ED4956] font-medium pt-[1rem]">
                  Report
                </p>
              </>
            )}
            {isAuthorComment && (
              <>
                <p
                  className="cursor-pointer text-[#ED4956] font-medium pt-[1rem]"
                  onClick={deleteCommentHandler.bind()}
                >
                  Delete
                </p>
              </>
            )}
            <hr />
            <p
              onClick={closeCommentOptionsHandler}
              className="cursor-pointer pb-[1rem]"
            >
              Cancel
            </p>
          </div>
        </Modal>
      )}
      {isLoading && <Spinner />}
      {/* {!isLoading && !post && (
        <p className="font-medium absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          404 Not Found
        </p>
      )} */}
      {!isLoading && post && (
        <div className="w-full justify-between border-b border-slate-300  h-full   sm:border-0">
          <div className="flex h-full flex-col lg:flex-row ">
            <div className=" relative overflow-hidden lg:w-[63%]  w-full h-full ">
              {/* Header card*/}
              {/* <div className=" block lg:hidden bg-white">{headerComponent}</div> */}
              {post && (
                <Swiper
                  modules={[Navigation, Pagination, A11y]}
                  navigation
                  pagination={{ clickable: true }}
                >
                  {post?.images?.map((img) => (
                    <SwiperSlide key={uuidv4()}>
                      <img
                        onDoubleClick={() => {
                          setDoubleTapImage(true);
                          likePostHandler({ type: "onlyLike" });
                        }}
                        alt="slide-img"
                        className="swiper-slide h-full object-cover object-center absolute "
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
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
            <div className="lg:w-[37%] bg-white flex flex-col justify-between w-full lg:h-auto h-[4rem]">
              {/* Header card*/}
              <div className="hidden lg:block">{headerComponent}</div>
              {/* Body card: cmt,description,.. */}
              <div className="hidden lg:block p-[1rem] max-h-[30rem] lg:h-[24rem] overflow-hidden overflow-y-visible border-b border-slate-200 comment-area">
                <div className="flex ">
                  <img
                    alt="avartar"
                    onClick={() => navigate(`/profile/${post?.postedBy?._id}`)}
                    className="w-8 h-8 rounded-full mr-[1rem] "
                    src={post?.postedBy?.avatar}
                  />
                  <div className="flex flex-col">
                    <div className="text-[.9rem]">
                      <span
                        className="font-medium pr-[.3rem]"
                        onClick={() =>
                          navigate(`/profile/${post?.postedBy?._id}`)
                        }
                      >
                        {post?.postedBy?.username}
                      </span>
                      <span>{post?.description}</span>
                    </div>
                    {!isNaN(Date.parse(post?._createdAt)) && (
                      <p className="text-xs text-slate-400 mt-[.7rem]">
                        <ReactTimeAgo
                          date={Date.parse(post?._createdAt)}
                          locale="en-US"
                        />
                      </p>
                    )}
                  </div>
                </div>
                {/* Show comment */}
                {post?.comments &&
                  post.comments
                    .slice(0)
                    .reverse()
                    .map((comment) => (
                      <div
                        key={uuidv4()}
                        className="flex my-[1rem] justify-between  "
                      >
                        <div className="flex">
                          <img
                            onClick={() =>
                              navigate(`/profile/${comment.postedBy._id}`)
                            }
                            alt="avartar"
                            className="w-8 h-8 rounded-full mr-[1rem] "
                            src={comment.postedBy?.avatar}
                          />
                          <div className="flex flex-col comment">
                            <div className="text-[.9rem]">
                              <Link
                                to={`/profile/${comment.postedBy._id}`}
                                className="font-medium pr-[.3rem] cursor-pointer"
                              >
                                {comment.postedBy?.username}
                              </Link>
                              <span>{comment.comment}</span>
                            </div>
                            <div className="flex items-center mt-[.7rem]">
                              <p className="text-xs text-slate-400 ">
                                {comment.createdAt &&
                                  !isNaN(Date.parse(comment.createdAt)) && (
                                    <ReactTimeAgo
                                      date={Date.parse(comment.createdAt)}
                                      locale="en-US"
                                      timeStyle="mini"
                                    />
                                  )}
                              </p>
                              <p className="text-xs text-slate-400 mx-[.5rem]">
                                Reply
                              </p>
                              <img
                                alt="threedots"
                                onClick={commentOptionsHanlder.bind(
                                  null,
                                  comment
                                )}
                                className="w-4 p-0 m-0 cursor-pointer comment-btn"
                                src={process.env.PUBLIC_URL + "/icons/more.svg"}
                              />
                            </div>
                          </div>
                        </div>

                        <img
                          alt="like btn"
                          className="w-3 h-3 cursor-pointer"
                          src="https://img.icons8.com/material-outlined/24/000000/like--v1.png"
                        />
                      </div>
                    ))}
                {/*  */}
              </div>
              {/* Control area: like,some btn:like,cmt,.. */}
              <div className="p-[1rem] border-b border-slate-200">
                {/* Button control */}
                <div className="flex flex-row justify-between">
                  <div className="flex items-center ">
                    {/* Like btn */}
                    <img
                      alt="likebtn"
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
                      alt="commentbtn"
                      onClick={() => {
                        document.getElementById("cmt").focus();
                      }}
                      className="w-7 h-7 mr-4 cursor-pointer"
                      src={process.env.PUBLIC_URL + "/icons/comment.svg"}
                    />
                    {/* Send btn */}
                    <img
                      alt="sendbtn"
                      className="w-7 h-7 mr-4 cursor-pointer"
                      src={process.env.PUBLIC_URL + "/icons/share.svg"}
                    />
                  </div>
                  {/* Save btn */}
                  <div>
                    <img
                      onClick={savePost}
                      alt="savebtn"
                      className="w-6 h-6 cursor-pointer"
                      src={`${
                        !isSaved
                          ? `${process.env.PUBLIC_URL + "/icons/bookmark.svg"}`
                          : `${
                              process.env.PUBLIC_URL +
                              "/icons/bookmark-fill.svg"
                            }`
                      }`}
                    />
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="font-medium my-[.5rem]">
                    {numsLike?.length === 0 ||
                      (!numsLike && (
                        <p className="font-normal">
                          Be the first one who like this post!
                        </p>
                      ))}
                    {numsLike === 1 && <p>{numsLike} like</p>}
                    {numsLike > 1 && <p>{numsLike} likes</p>}
                  </div>
                  <p className="text-sm text-slate-400">
                    {!isNaN(Date.parse(post?._createdAt)) && (
                      <ReactTimeAgo
                        date={Date.parse(post?._createdAt)}
                        locale="en-US"
                      />
                    )}
                  </p>
                </div>
              </div>
              {/* Add comment */}
              <div className="relative px-[1rem] py-[.6rem] items-center hidden lg:flex flex-row">
                {isEmoji && (
                  <div className="absolute bottom-[3rem] left-[0] z-[10]">
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
                  id="cmt"
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
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
          </div>
        </div>
      )}
    </Suspense>
  );
};

export default PostModal;
