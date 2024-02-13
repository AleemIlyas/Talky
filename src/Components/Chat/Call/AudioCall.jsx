import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import { micCircle, micOffCircle, callOutline } from "ionicons/icons";
import { useLocation } from "react-router";
import { LiveAudioVisualizer } from "react-audio-visualize";

const AudioCall = ({
  CallAnswered,
  callerName,
  onAccept,
  onReject,
  isCalling,
  audioRef,
  endCall,
}) => {
  console.log(isCalling);
  const [isMuted, setIsMuted] = useState(false);
  const loc = useLocation();
  const name = loc.state;

  const handleAccept = () => {
    onAccept(); // Callback to handle accepting the call
  };

  const handleReject = () => {
    onReject(); // Callback to handle rejecting the call
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev); // Toggle mute state
  };

  return (
    <div className="z-50 absolute right-4 top-11 p-4 bg-white border shadow">
      {isCalling ? (
        !CallAnswered ? (
          <div className="flex flex-col items-center justify-center">
            <p>Calling</p>
            <b>{name}</b>
            <img
              className="rounded-full"
              width={50}
              src="https://i.pravatar.cc/114?u=fecs@pravatar.com"
            />
          </div>
        ) : (
          <>
            <div className="">
              <div className="flex flex-col p-3 items-center justify-center">
                <p>Connected With</p>
                <b>{name}</b>
                <img
                  className="rounded-full"
                  width={50}
                  src="https://i.pravatar.cc/114?u=fecs@pravatar.com"
                />
                <audio ref={audioRef} autoPlay={true} muted={false} />
              </div>

              <div className="flex justify-around">
                <IonIcon
                  className="cursor-pointer transition hover:scale-125 my-4 bg-red-500 p-3 rounded-full rotate-90"
                  color="white"
                  onClick={() => endCall()}
                  icon={callOutline}
                ></IonIcon>
              </div>
            </div>
          </>
        )
      ) : !CallAnswered ? (
        <div className="transition animate-bounce">
          <div className="flex flex-col items-center justify-center">
            <p>Incoming call from</p>
            <b>{callerName}</b>
            <img
              className="rounded-full"
              width={50}
              src="https://i.pravatar.cc/114?u=fecs@pravatar.com"
            />
          </div>
          <div className="flex justify-around">
            <IonIcon
              className="cursor-pointer bg-green-300 p-3 rounded-full stroke-white"
              onClick={handleAccept}
              icon={callOutline}
            ></IonIcon>
            <IonIcon
              className="cursor-pointer bg-red-500 p-3 rounded-full rotate-90"
              color="white"
              onClick={handleReject}
              icon={callOutline}
            ></IonIcon>
          </div>
        </div>
      ) : (
        <div className="">
          <div className="flex flex-col items-center justify-center">
            <p>Connected With</p>
            <b>{callerName}</b>
            <img
              className="rounded-full"
              width={50}
              src="https://i.pravatar.cc/114?u=fecs@pravatar.com"
            />
            <audio ref={audioRef} autoPlay={true} muted={false} />
          </div>

          <div className="flex justify-around">
            <IonIcon
              className="bg-red-500 transition hover:scale-125 my-4 p-3 rounded-full rotate-90"
              color="white"
              onClick={() => endCall()}
              icon={callOutline}
            ></IonIcon>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioCall;
