import ChatHeader from "../../Container/ChatHeader/ChatHeader";
import Messages from "../../Container/Messages/Messages";
import MessageInput from "../../Container/UI/MessageInput/MessageInput";
import Profile from "./Profile/Profile";
import { useParams } from "react-router";
import { useState, useRef, useEffect } from "react";
import { socket } from "../../Components/Socket/Socket";
import { toast, ToastContainer } from "react-toastify";
import propTypes from "prop-types";
import { removeBadge } from "../../store/Slices/chatSlice";
import { useDispatch } from "react-redux";

export default function Chat({ initiateCall }) {
  const [recording, setRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const audioChunksRef = useRef([]);
  const mediaRecorderRef = useRef(null);
  const [message, setMessage] = useState("");
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(removeBadge(id));
  }, [id]);

  useEffect(() => {
    // Start recording logic...

    return () => {
      if (recording) {
        stopRecording();
      }
    };
  }, [id, recording]);

  const changeHandler = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      Sendmessage(e.target.value);
    }
  };

  const Sendmessage = () => {
    if (!!message === false || !!message.trim().length === 0) return;
    socket.emit("sendMessage", { id, msg: message });
    setMessage("");
  };

  const MIME_TYPE = "audio/mp3";

  const startRecording = (stream) => {
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      if (audioChunksRef.current.length > 0) {
        let blob = new Blob(audioChunksRef.current, { type: MIME_TYPE });
        socket.emit("voiceMessage", {
          id,
          data: blob,
          type: MIME_TYPE,
        });
        setRecording(false);
      } else {
        console.log("No recorded audio data to send.");
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current = null;
    setRecording(false);
    setIsPaused(false);
  };

  const recordingHandler = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (recording) {
        isPaused ? mediaRecorderRef.current.resume() : stopRecording();
      } else {
        startRecording(stream);
      }
    } catch (err) {
      toast("Error accessing microphone", {
        type: "error",
      });
    }
  };

  const pauseResumeRecording = () => {
    if (recording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    } else if (recording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const deleteRecording = () => {
    recording && stopRecording();
  };

  const sendAudioHandler = () => {
    mediaRecorderRef.current.stop();
  };

  return (
    <div className="flex felx-row">
      <ToastContainer />

      <div className="sm:w-[75%] w-[100vw] h-full sm:h-screen bg-white">
        <ChatHeader makeCall={initiateCall} />
        <Messages />
        <MessageInput
          value={message}
          changeHandler={changeHandler}
          handler={Sendmessage}
          keyHandler={handleKeyDown}
          recording={recording}
          recordingHandler={recordingHandler}
          mediaRecorder={mediaRecorderRef}
          pauseResumeRecording={pauseResumeRecording}
          isPaused={isPaused}
          deleteRecording={deleteRecording}
          sendAudioHandler={sendAudioHandler}
        />
      </div>
      <div className="sm:w-1/4 sm:block w-0 hidden relative">
        <Profile makeCall={initiateCall} />
      </div>
    </div>
  );
}

Chat.propTypes = {
  initiateCall: propTypes.func,
};
