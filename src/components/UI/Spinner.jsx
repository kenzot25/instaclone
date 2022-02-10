import React from "react";
// import Loader from "react-loader-spinner";
import { Triangle } from "react-loader-spinner";

const Spinner = () => {
  let classes =
    "absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]";

  return (
    <div className={classes}>
      <Triangle color="#888" className="m-5" />
    </div>
  );
};

export default Spinner;
