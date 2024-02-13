import {
  send,
  mic,
  trashBin,
  pauseOutline,
  caretForwardOutline,
} from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import PropTypes from "prop-types";
import Visualizer from "./VoiceInput/VoiceInput";

export default function MessageInput(props) {
  return (
    <div className="w-full  mt-3">
      {!props.recording ? (
        <div className="w-11/12 sm:m-auto relative flex items-center justify-center">
          <input
            className="w-11/12 p-3 pr-12 outline-none bg-gray-300 rounded-2xl text-black font-semibold"
            type="text"
            placeholder="write something!"
            name="message"
            value={props.value}
            onChange={props.changeHandler}
            id=""
            onKeyDown={props.keyHandler}
          />
          <div className="flex items-center justify-center absolute top-0 bottom-0 -right-[30px] sm:-right-5">
            <span
              onClick={props.recordingHandler}
              className="text-blue-500 hover:cursor-pointer mr-3 rounded-full"
            >
              <IonIcon className="text-2xl fill-blue-500" icon={mic}></IonIcon>
            </span>
            <span
              onClick={props.handler}
              className=" hover:cursor-pointer rounded-full inline-flex items-center justify-center"
            >
              <IonIcon
                className="text-2xl p-3 rounded-full bg-blue-500 fill-white"
                icon={send}
              ></IonIcon>
            </span>
          </div>
        </div>
      ) : (
        <div className={"bg-gray-300 rounded-3xl p-1 w-11/12 m-auto"}>
          <Visualizer mediaRecorder={props.mediaRecorder} />
          <div className="flex justify-evenly">
            <span
              onClick={props.deleteRecording}
              className=" hover:cursor-pointer rounded-full inline-flex items-center justify-center"
            >
              <IonIcon
                className="text-2xl p-3 rounded-full bg-red-500 fill-white hover:bg-red-700"
                icon={trashBin}
              ></IonIcon>
            </span>
            <span
              onClick={props.pauseResumeRecording}
              className=" hover:cursor-pointer rounded-full inline-flex items-center justify-center"
            >
              <IonIcon
                className="text-2xl p-3 rounded-full bg-white  hover:bg-slate-100"
                icon={!props.isPaused ? pauseOutline : caretForwardOutline}
              ></IonIcon>
            </span>
            <span
              onClick={props.sendAudioHandler}
              className=" hover:cursor-pointer rounded-full inline-flex items-center justify-center"
            >
              <IonIcon
                className="text-2xl p-3 rounded-full bg-blue-500 fill-white"
                icon={send}
              ></IonIcon>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

MessageInput.propTypes = {
  value: PropTypes.string,
  handler: PropTypes.func,
  changeHandler: PropTypes.func,
  keyHandler: PropTypes.func,
  recording: PropTypes.bool,
  recordingHandler: PropTypes.func,
  mediaRecorder: PropTypes.object,
  pauseResumeRecording: PropTypes.func,
  isPaused: PropTypes.bool,
  deleteRecording: PropTypes.func,
  sendAudioHandler: PropTypes.func,
};
