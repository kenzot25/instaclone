import { NavLink, useLocation } from "react-router-dom";

import ChangePassword from "./ChangePassword";
import Edit from "./Edit";

const Main = ({ fetchDataAfterChanged }) => {
  const location = useLocation();
  return (
    <div className="mt-[6rem] flex  bg-[#fff]  mx-auto  lg:w-[70%] md:w-[80%]  w-full border border-slate-300 h-full">
      <div className="lg:w-[22%] lg:visible w-[0%] invisible flex flex-col ">
        <NavLink
          to="/accounts/edit"
          className={({ isActive }) =>
            isActive
              ? "border-l-2 border-[#000] font-medium  p-4"
              : "border-0 p-4"
          }
        >
          Edit profile
        </NavLink>
        <NavLink
          to="/accounts/password/change/"
          className={({ isActive }) =>
            isActive
              ? "border-l-2 border-[#000] font-medium  p-4"
              : "border-0 p-4"
          }
        >
          Change Password
        </NavLink>
      </div>
      <div className="lg:w-[78%] w-full mx-auto ">
        {location.pathname.includes("/accounts/edit") && (
          <Edit fetchDataAfterChanged={(url) => fetchDataAfterChanged(url)} />
        )}
        {location.pathname.includes("/accounts/password/change/") && (
          <ChangePassword
            fetchDataAfterChanged={(url) => fetchDataAfterChanged(url)}
          />
        )}
      </div>
    </div>
  );
};

export default Main;
