import React, { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import PostModal from "./PostModal";
// import Modal from "./UI/Modal";
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
    border: "none",
    // background: "0",
  },
};

Modal.setAppElement("#modal--overlay");

const PreviewPost = ({ post, user }) => {
  console.log(post);
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    modalIsOpen
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflowY = "scroll");
  }, [modalIsOpen]);
  return (
    <>
      <>
        {modalIsOpen && (
          <img
            onClick={() => {
              setIsOpen(false);
              window.history.back();
            }}
            alt="close-btn"
            className="fixed top-[0] right-[0] w-[1.2rem] h-[1.2rem] m-[1rem] z-50"
            src={process.env.PUBLIC_URL + "/icons/close-btn-white.svg"}
          />
        )}

        <Modal
          isOpen={modalIsOpen}
          // onAfterOpen={afterOpenModal}
          onRequestClose={() => {
            setIsOpen(false);
            document.body.style.overflowY = "scroll";
            window.history.back();
          }}
          style={customStyles}
          contentLabel="Modal"
        >
          <div className="lg:h-[85vh] h-[70vh] z-50  md:w-[65vw] w-[90vw] rounded-none">
            <PostModal user={user} post={post} />
          </div>
        </Modal>
      </>

      <div className="mx-2 mb-5">
        <div
          className="my-auto  w-full  aspect-square relative  cursor-pointer"
          onClick={() => {
            window.history.pushState(null, "Title", `/p/${post?._id}`);
            setIsOpen(true);
          }}
        >
          <Link to={``}>
            <div className="bg-[#000000bf] w-full h-full  absolute  opacity-0 hover:opacity-100 z-20  transition-all duration-100">
              <div className="w-full h-full  absolute   z-30  transition-all duration-100   text-white font-medium">
                <div className="flex h-full items-center justify-center ">
                  <div className="flex items-center lg:px-[1rem] md:px-[.6rem] px-[.3rem]">
                    <img
                      alt=""
                      src={process.env.PUBLIC_URL + "/icons/heart-white.svg"}
                      className="lg:w-6 w-4  lg:h-6 h-4  mx-[.5rem]"
                    />
                    <span>{post.like !== null ? post.like.length : 0}</span>
                  </div>
                  <div className="flex items-center lg:px-[1rem] md:px-[.6rem] px-[.3rem]">
                    <img
                      alt=""
                      src={process.env.PUBLIC_URL + "/icons/comment-white.svg"}
                      className="lg:w-6 w-4  lg:h-6 h-4 mx-[.5rem]"
                    />
                    <span>
                      {post.comments !== null ? post.comments.length : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-full w-full  ">
              <img
                alt="img"
                className="h-full w-full object-cover "
                src={post?.images[0]?.asset?.url}
              />
            </div>
            {post.images?.length > 1 && (
              <img
                alt="album-icon"
                className="absolute top-[1rem] right-[1rem] w-5 h-5"
                src={process.env.PUBLIC_URL + "/collection-icon.svg"}
              />
            )}
          </Link>
        </div>
      </div>
    </>
  );
};

export default PreviewPost;
