import { useLocation } from "react-router";
import { IonIcon } from "@ionic/react";
import { call } from "ionicons/icons";
import PropTypes from "prop-types";

export default function Profile({ makeCall }) {
  const location = useLocation();
  const name = location.state;
  return (
    <div className="fixed h-full flex items-center flex-col justify-center bg-gray-300 w-1/5">
      <div className="flex items-center justify-center flex-col">
        <img
          className="rounded-full border-2 border-black"
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          alt="user profile Image"
          width={150}
        />
        <h1 className="text-center text-2xl font-bold">{name}</h1>
      </div>
      <IonIcon
        className="mt-3 rounded-xl text-2xl hover:cursor-pointer border-[2px] border-green-400 p-3 hover:fill-green-800 transition-all fill-green-700"
        icon={call}
        onClick={makeCall}
      ></IonIcon>
    </div>
  );
}

Profile.propTypes = {
  makeCall: PropTypes.func,
};
