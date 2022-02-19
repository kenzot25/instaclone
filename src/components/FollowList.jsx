import React from "react";
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
const FollowList = () => {
  return (
    <Modal
      isOpen={modalIsOpen}
      // onAfterOpen={afterOpenModal}
      onRequestClose={closeHandler}
      style={customStyles}
      contentLabel="Modal"
    >
      <div className="text-center flex flex-col justify-between lg:w-[30vw] md:[40vw] lg:h-[50vh] h-[65vh] w-[80vw]">
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

export default FollowList;
