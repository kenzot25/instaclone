import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { postDetailQuery, userCreatedPostQuery } from "../../../utils/data";
import { client } from "../../../client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper";
// import Modal from "./UI/Modal";
import { v4 as uuidv4 } from "uuid";
import Spinner from "../../UI/Spinner";
import { MasonryLayoutExplore } from "../../MasonryLayout";
import Loading from "../../UI/Loading";
import Picker from "emoji-picker-react";
import {
  addCommentHelper,
  deleteCommentHelper,
  likePostHelper,
  savePostHelper,
} from "../../../utils/helper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
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
// lazy import
// const Modal = lazy(() => import("../../UI/Modal"));
const { SKIN_TONE_MEDIUM_DARK } = lazy(() => import("emoji-picker-react"));
const ReactTimeAgo = lazy(() => import("react-time-ago"));
// main func
const PostDetail = ({ user }) => {
  // State
  const [isAuthor, setIsAuthor] = useState(false);
  const [isAuthorComment, setIsAuthorComment] = useState(false);

  const [post, setPost] = useState(null);
  const [morePosts, setMorePosts] = useState(null);
  const [isPostOptions, setIsPostOptions] = useState(false);

  const [doubleTapImage, setDoubleTapImage] = useState(false);
  const [numsLike, setNumsLike] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setIsOpen] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [isEmoji, setIsEmoji] = useState();
  const [isCommentOptions, setIsCommentOptions] = useState(false);
  const [commentID, setCommentID] = useState("");
  //
  const { postID } = useParams();
  const postQuery = postDetailQuery(postID);
  const morePostQuery = userCreatedPostQuery(post?.postedBy?._id);
  const navigate = useNavigate();
  // Func Helper
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
  const fetchPostDetail = useCallback(
    async (isCancelled = false) => {
      await client.fetch(postQuery).then((data) => {
        if (!isCancelled) {
          setPost(data[0]);
          setIsLoading(false);
        }
      });
    },
    [postQuery]
  );
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    fetchPostDetail(isCancelled);
    // console.log(post);
    return () => {
      isCancelled = true;
    };
  }, [postID, fetchPostDetail]);

  // Hanlder save
  const [isSaved, setIsSaved] = useState(false);

  const savePost = () => {
    if (!isSaved) {
      setIsSaved(true);
      savePostHelper("save", postID, user._id);
    } else {
      setIsSaved(false);
      savePostHelper("unsave", postID, user._id);
    }
  };

  useEffect(() => {
    // Like
    if (post) {
      if (post?.postedBy?._id === user?._id) {
        setIsAuthor(true);
      }
      if (!post.like) {
        setIsLiked(false);
      } else {
        setNumsLike(post?.like?.length);
        post.like.map((wholike) => {
          if (wholike?.postedBy?._id === user?._id) {
            return setIsLiked(true);
          } else return null;
        });
      }
      const alreadySaved = !!post.save?.filter(
        (item) => item?.postedBy?._id === user?._id
      )?.length;
      setIsSaved(alreadySaved);
    }
    client.fetch(morePostQuery).then((data) => {
      const fixedData = [...data].filter((p) => p?._id !== post?._id);
      setMorePosts(fixedData);
    });
    // Save
  }, [post, postID, addingComment, morePostQuery, user?._id]);

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
      addCommentHelper(postID, user, comment);
      setTimeout(() => {
        fetchPostDetail();
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
    deleteCommentHelper(postID, commentID, fetchPostDetail);
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

  return (
    <Suspense fallback={<Spinner />}>
      {isPostOptions && post && (
        <Modal
          isOpen={modalIsOpen}
          // onAfterOpen={afterOpenModal}
          onRequestClose={closeHandler}
          style={customStyles}
          contentLabel="Modal"
        >
          <div className="text-center flex flex-col justify-between lg:w-[30vw] md:[40vw] lg:h-[50vh] h-[65vh] w-[80vw]">
            {!isAuthor && (
              <>
                <p className="cursor-pointer text-[#ED4956] font-medium pt-[1rem]">
                  Report
                </p>
                <hr />
                <p className="cursor-pointer text-[#ED4956] font-medium ">
                  Follow
                </p>
              </>
            )}
            {isAuthor && (
              <>
                <p className="cursor-pointer text-[#ED4956] font-medium pt-[1rem]">
                  Edit
                </p>
                <hr />
                <p
                  className="cursor-pointer text-[#ED4956] font-medium "
                  onClick={deletePostHandler}
                >
                  Delete
                </p>
              </>
            )}
            <hr />
            <p className=" cursor-pointer ">Share to...</p>
            <hr />
            <p className="cursor-pointer ">Copy link</p>
            <hr />
            <p className="cursor-pointer ">Embed</p>
            <hr />
            <p onClick={closeHandler} className="cursor-pointer pb-[1rem]">
              Cancel
            </p>
          </div>
        </Modal>
      )}
      {post && (
        <Modal
          isOpen={isCommentOptions}
          onRequestClose={closeCommentOptionsHandler}
          style={customStyles}
          contentLabel="Modal"
        >
          <div className="text-center flex flex-col  justify-between h-[15vh] w-[25rem]">
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
      {!isLoading && !post && (
        <p className="font-medium absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          404 Not Found
        </p>
      )}
      {!isLoading && post && (
        <>
          <div className="mt-[6rem] pb-[3rem] w-full justify-between sm:border-b border-slate-300 lg:h-[90vh] h-auto">
            <div className="flex h-full flex-col lg:flex-row">
              <div className=" relative overflow-hidden lg:w-[63%]  w-full h-full">
                {/* Header card*/}
                <div className=" block lg:hidden bg-white">
                  {headerComponent}
                </div>
                {post && (
                  <div className="aspect-square">
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
                            className="swiper-slide h-full object-cover object-center absolute"
                            src={img?.asset?.url}
                          />
                          {doubleTapImage && (
                            <img
                              alt=""
                              className={`z-[40] absolute opacity-80 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] animate-like`}
                              src={
                                process.env.PUBLIC_URL +
                                "/icons/heart-white.svg"
                              }
                            />
                          )}
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}
              </div>
              <div className="lg:w-[37%] bg-white flex flex-col justify-between w-full lg:h-auto h-full">
                {/* Header card*/}
                <div className="hidden lg:block">{headerComponent}</div>
                {/* Body card: cmt,description,.. */}
                <div className="p-[1rem] max-h-[30rem] lg:h-[24rem] overflow-hidden overflow-y-visible border-b border-slate-200 comment-area">
                  <div className="flex ">
                    <img
                      alt="avartar"
                      onClick={() =>
                        navigate(`/profile/${post?.postedBy?._id}`)
                      }
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
                      <p className="text-xs text-slate-400 mt-[.7rem]">
                        {!isNaN(Date.parse(post?._createdAt)) && (
                          <ReactTimeAgo
                            date={Date.parse(post?._createdAt)}
                            locale="en-US"
                          />
                        )}
                      </p>
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
                          className="flex my-[1rem] justify-between "
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
                                  src={
                                    process.env.PUBLIC_URL + "/icons/more.svg"
                                  }
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
                            : `${
                                process.env.PUBLIC_URL + "/icons/heart-red.svg"
                              }`
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
                            ? `${
                                process.env.PUBLIC_URL + "/icons/bookmark.svg"
                              }`
                            : `${
                                process.env.PUBLIC_URL +
                                "/icons/bookmark-fill.svg"
                              }`
                        }`}
                      />
                    </div>
                  </div>
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
                    <ReactTimeAgo
                      date={Date.parse(post?._createdAt)}
                      locale="en-US"
                    />
                  </p>
                </div>
                {/* Add comment */}
                <div className="flex relative px-[1rem] py-[.6rem] items-center">
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
          {morePosts.length > 0 && (
            <>
              {/* {console.log(morePosts)} */}
              <div className="mt-[2rem]">
                <p className="pb-[1rem]">
                  More posts from
                  <span className="font-medium">
                    {" "}
                    {post?.postedBy.username}
                  </span>
                </p>
                <div>
                  <MasonryLayoutExplore
                    posts={morePosts}
                    col={3}
                    user={user && user}
                  />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </Suspense>
  );
};

export default PostDetail;
