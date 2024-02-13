import { useLocation } from "react-router";
import { IonIcon } from "@ionic/react";
import { call } from "ionicons/icons";

export default function ChatHeader({ makeCall }) {
  const location = useLocation();
  const name = location.state ?? "";
  return (
    <div className="w-11/12 m-auto flex items-center justify-between h-1/6">
      <div className="w-1/2 flex items-center">
        <img
          className="rounded-full border border-black"
          width={40}
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          alt="Profile_Image"
        />
        <h2 className="ml-4 font-medium text-2xl tracking-tighter">
          {name.toUpperCase()}
        </h2>
      </div>
      <div>
        <IonIcon
          className="text-2xl hover:cursor-pointer hover:fill-green-800 transition-all fill-green-700"
          icon={call}
          onClick={makeCall}
        ></IonIcon>
      </div>
    </div>
  );
}
