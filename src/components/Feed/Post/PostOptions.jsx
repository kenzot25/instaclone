import React from "react";
import { useState } from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { client } from "../../../client";
import { followHelper } from "../../../utils/helper";
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
const PostOptions = ({
  modalIsOpen,
  closeHandler,
  isAuthor,
  userID,
  post,
  fetchDataAfterDelete,
  deletePostHandler,
  isFollowing,
  changeFollowState,
  notHaveGoToPost,
}) => {
  const deletePost = async () => {
    // setDeletingPost(true);
    await client.delete(post._id).then(() => {
      // setDeletingPost(false);
      fetchDataAfterDelete && fetchDataAfterDelete();
      closeHandler();
    });
  };

  return (
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
            <p
              className="cursor-pointer text-[#ED4956] font-medium "
              onClick={() => {
                isFollowing
                  ? followHelper("unfollow", userID, post.postedBy._id)
                  : followHelper("follow", userID, post.postedBy._id);

                changeFollowState();
              }}
            >
              {isFollowing ? "Unfollow" : "Follow"}
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
              onClick={() => {
                deletePostHandler ? deletePostHandler() : deletePost();
              }}
            >
              Delete
            </p>
          </>
        )}
        <hr />
        {!notHaveGoToPost && (
          <>
            <Link
              className="cursor-pointer"
              to={`/p/${post?._id}`}
              onClick={() => {
                document.body.style.overflowY = "scroll";
              }}
            >
              Go to post
            </Link>
            <hr />
          </>
        )}

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
  );
};

export default PostOptions;
