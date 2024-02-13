import propTypes from "prop-types";
import { NavLink } from "react-router-dom";

export default function Profile({ name, id, handler, hasNewMessage }) {
  return (
    <NavLink
      state={name}
      onClick={handler}
      style={({ isActive }) => {
        return {
          backgroundColor: isActive ? "rgb(229, 231, 235)" : "",
          borderRadius: isActive ? "22px" : "",
          padding: isActive ? "4px" : "4px",
        };
      }}
      to={"/Chat/" + id}
      className={`flex w-full sm:w-10/12 items-center m-auto mt-5 hover:cursor-pointer hover:bg-gray-200 relative ${
        hasNewMessage ? "border-[3px] rounded-full border-gray-400" : ""
      }`}
    >
      {hasNewMessage ? (
        <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs absolute -top-1 -right-1">
          {" "}
          New Message{" "}
        </span>
      ) : (
        ""
      )}
      <img
        className="rounded-full border border-blue-500"
        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        width={60}
        alt=""
      />
      <div className="ml-1 sm:ml-4">
        <h1 className="text-blue-600 text-lg sm:text-xl font-bold">
          {name.toUpperCase()}
        </h1>
      </div>
    </NavLink>
  );
}

Profile.propTypes = {
  name: propTypes.string,
  id: propTypes.string,
  handler: propTypes.func,
  hasNewMessage: propTypes.any,
};
