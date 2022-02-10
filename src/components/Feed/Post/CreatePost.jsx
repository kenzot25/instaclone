import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper";
import { v4 as uuidv4 } from "uuid";
import { client } from "../../../client";
import Spinner from "../../UI/Spinner";
import { fetchUser } from "../../../utils/helper";
import { userQuery } from "../../../utils/data";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const CreatePost = ({ closeModal }) => {
  //

  const [isReady, setIsReady] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  document.body.style.scrollBehavior = "none";
  document.body.style.overflow = "hidden";

  useEffect(() => {
    let isCancelled = false;
    fetchUser().then((data) => {
      let userInfo = data;
      let id = userInfo?.id;
      const query = userQuery(id);
      client.fetch(query).then((data) => {
        if (!isCancelled && data) {
          const userdata = { ...data[0] };
          setUser(userdata);
        }
      });
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  //
  const [description, setDescription] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [isFillField, setIsFillField] = useState(false);
  /** Event: File input change  */
  const [loading, setLoading] = useState(false);
  // const [fields, setFields] = useState(false);

  const [imageAsset, setImageAsset] = useState([]);
  // const [wrongImageType, setWrongImageType] = useState(false);

  const uploadImage = (e) => {
    setIsReady(false);
    setIsPreview(true);
    const files = [...e.target.files];
    files.map((file) => {
      const { type, name } = file;
      console.log(file);
      if (
        type === "image/png" ||
        type === "image/jpg" ||
        type === "image/svg" ||
        type === "image/jpeg" ||
        type === "image/gif" ||
        type === "image/tiff"
      ) {
        // setWrongImageType(false);
        setLoading(true);

        return client.assets
          .upload("image", file, {
            contentType: type,
            filename: name,
          })
          .then((doc) => {
            setImageAsset((prev) => [...prev, doc]);
            setLoading(false);
          })
          .catch((e) => {
            console.log("Image upload error", e);
          });
      } else {
        return setIsReady(false);
        // setWrongImageType(true);
      }
    });
  };

  const savePost = () => {
    if (description && hashtag && imageAsset.length > 0) {
      const images = [];
      imageAsset.map((image) => {
        return images.push({
          _type: "image",
          _key: uuidv4(),
          asset: {
            _type: "reference",
            _ref: image._id,
          },
        });
      });
      const doc = {
        _type: "post",
        description,
        hashtag,
        images: images,
        userId: user._id,
        postedBy: {
          _type: "postedBy",
          _ref: user._id,
        },
      };
      client.create(doc).then(() => {
        closeModal();
        navigate("/");
        window.scrollTo(0, 0);
      });
    } else {
      document.body.style.overflowY = "scroll";
      navigate("/");
    }
  };
  useEffect(() => {
    if (description.trim().length > 0 && hashtag.trim().length > 0) {
      setIsFillField(true);
    } else {
      setIsFillField(false);
    }
  }, [description, hashtag]);
  return (
    <>
      <div>
        {/* <Modal
          isOpen={isBackDropOpen}
          // onAfterOpen={afterOpenModal}
          onRequestClose={closeHandler}
          style={customStyles}
          contentLabel="Modal"
          // classes={`  transition-all duration-500`}
        > */}
        <div
          className={`overflow-hidden transition-all duration-500 h-[24rem] z-50   w-[90vw]  lg:w-[30vw] md:w-[50vw] box-borderflex flex-col items-center  ${
            isCreate && "lg:w-[55vw] w-[90vw]"
          }`}
        >
          <div className="w-full text-center  h-[48px]">
            {isReady && <p className="font-medium py-2 ">Create new post</p>}
            {isPreview && (
              <>
                <div className="flex items-center justify-between px-[1rem] py-2 ">
                  <img
                    onClick={() => {
                      setIsPreview(false);
                      setIsReady(true);
                      setImageAsset([]);
                    }}
                    alt="creating-img"
                    className="w-8 h-8 cursor-pointer"
                    src="https://img.icons8.com/ios-filled/50/000000/left.png"
                  />
                  <p className="font-medium h-[1.5rem]">Preview</p>
                  <p
                    className="font-medium text-[#0095f6] cursor-pointer"
                    onClick={() => {
                      setIsReady(false);
                      setIsPreview(false);
                      setIsCreate(true);
                    }}
                  >
                    Next
                  </p>
                </div>
                <hr className=""></hr>
              </>
            )}
            {isCreate && (
              <>
                {console.log(isFillField)}
                <div className="flex items-center justify-between px-[1rem] py-2">
                  <img
                    onClick={() => {
                      setIsReady(false);
                      setIsCreate(false);
                      setIsPreview(true);
                    }}
                    alt="creating-img"
                    className="w-8 h-8 cursor-pointer"
                    src="https://img.icons8.com/ios-filled/50/000000/left.png"
                  />
                  <p className="font-medium ">Create new post</p>
                  <button
                    className={`font-medium text-[#0095f6] cursor-pointer ${
                      isFillField ? "opacity-100" : " opacity-60"
                    }`}
                    onClick={() => {
                      isFillField && savePost();
                    }}
                  >
                    Share
                  </button>
                </div>
                <hr className=""></hr>
              </>
            )}
          </div>

          {loading && <Spinner />}
          {/* {wrongImageType && <p>Wrong image type</p>} */}

          {isReady && (
            <div className="flex  items-center flex-col  w-full  z-10 ">
              {!loading && (
                <div className="">
                  <label>
                    <div className="flex flex-col items-center items-center justify-center">
                      <div className="flex flex-col justify-center items-center">
                        <img
                          alt="icon"
                          className="pt-[5rem] "
                          src="https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/64/000000/external-image-miscellaneous-kiranshastry-lineal-kiranshastry-1.png"
                        />
                        <p className="my-4 text-[1.3rem]">Upload your photos</p>
                        <p className="py-0.5 px-2 bg-[#0095F6] text-white font-medium rounded-md cursor-pointer">
                          Select from computer
                        </p>
                      </div>
                    </div>
                    <input
                      accept="image/jpeg,image/png"
                      type="file"
                      name="upload-image"
                      multiple
                      onChange={uploadImage}
                      className="w-0 h-0"
                    />
                  </label>
                </div>
              )}
            </div>
          )}
          {isPreview && (
            <div className=" w-full h-full z-10 relative overflow-hidden  rounded-b-[1rem] fixedBtn">
              {imageAsset && (
                <div className="w-full h-full ">
                  <Swiper
                    modules={[Navigation, Pagination, A11y]}
                    navigation
                    pagination={{ clickable: true }}
                  >
                    {imageAsset?.map((img) => (
                      <SwiperSlide key={img._id}>
                        <div className="w-full h-full ">
                          <img
                            className="absolute object-cover object-center m-auto  h-full w-full"
                            src={img?.url}
                            alt="uploaded-pic"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
            </div>
          )}
          {isCreate && (
            <div className="w-full h-[calc(100%-48px)] flex justify-between border-0.5 border-slate-300  relative overflow-hidden rounded-b-[1rem]  ">
              <div className="sm:w-[50%] w-[0] h-full box-border">
                <Swiper
                  modules={[Navigation, Pagination, A11y]}
                  navigation
                  pagination={{ clickable: true }}
                >
                  {imageAsset?.map((img) => (
                    <SwiperSlide key={img._id}>
                      <div className="w-full h-full ">
                        <img
                          className="absolute object-center object-cover h-full w-full"
                          src={img?.url}
                          alt="uploaded-pic"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className="w-[100%] md:w-[50%] h-full  flex flex-col  overflow-auto  px-[1rem] box-border">
                <div className="flex my-[1.4rem] items-center ">
                  <img
                    alt="avartar"
                    className="w-8 h-8 rounded-full border-none shadow-lg "
                    src={user?.avatar}
                  />
                  <p className="font-medium text-lg mx-[1rem]">
                    {user?.username}
                  </p>
                </div>
                <div className=" h-[60%] border-b border-slate-300 mb-4">
                  <textarea
                    name="comment"
                    className="w-full text-lg h-full "
                    maxLength={200}
                    placeholder="Write a caption..."
                    value={description}
                    required
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="w-full ">
                  <input
                    type="text"
                    required
                    value={hashtag || ""}
                    onChange={(e) => setHashtag(e.target.value)}
                    placeholder="Add some hashtag..."
                    className="outline-none text-base sm:text-lage"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {/* </Modal> */}
      </div>
    </>
  );
};

export default CreatePost;
