import {
  useEffect,
  lazy,
  Suspense,
  useCallback,
  useState,
  useRef,
} from "react";
import Navbar from "../Navbar/Navbar";
const Chat = lazy(() => import("../Chat/Chat"));
import {
  addUserToChat,
  getChats,
  chatHasNewMessage,
} from "../../store/Slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { socket } from "../Socket/Socket";
import { addMessage } from "../../store/Slices/messageSlice";
import { toast, ToastContainer } from "react-toastify";
import { useLocation } from "react-router";
import Peer from "simple-peer";
const AudioCall = lazy(() => import("../Chat/Call/AudioCall"));

export default function Layout() {
  const { id } = useParams();
  const { _id, name } = useSelector((state) => state.user.userData);
  const [peer, setPeer] = useState(null);
  const [stream, setStream] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [CallAnswered, setCallAnswered] = useState(null);
  const [showResponsive, setShowResponsive] = useState(false);
  const remoteAudioRef = useRef(null);
  const timeOutRef = useRef(null);
  const loc = useLocation();
  const callerName = loc.state;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getChats());
  }, []);

  const { chats } = useSelector((state) => state.chat);

  const extractIds = useCallback(() => {
    return chats.map((item) => item._id);
  }, [chats]);

  useEffect(() => {
    if (chats) {
      const ids = extractIds();
      socket.emit("joinroom", ids);
    }
  }, [extractIds, chats]);

  useEffect(() => {
    socket.on("connection");

    socket.emit("joinroom", _id);

    socket.on("newChat", (id) => {
      socket.emit("joinroom", id);
      socket.emit("getChat", id, (response) => {
        dispatch(addUserToChat(response[0]));
      });
    });

    socket.on("error", ({ error }) => {
      toast.error(error);
    });

    socket.on("discon", (msg) => {
      console.log(msg);
    });

    return () => {
      socket.off("connection"); // Remove "connection" event listener (if added)
      socket.off("newChat"); // Remove "messageReceived" event listener
      socket.off("discon"); // Remove "discon" event listener
    };
  }, []);

  useEffect(() => {
    socket.on("messageReceived", ({ response, chatId }) => {
      //chatId refers to chatId that receive the message and id refer to chat that is open
      const activeId = id ?? null;
      dispatch(chatHasNewMessage({ chatId: chatId, id: activeId }));
      chatId === id ? dispatch(addMessage(response)) : null;
    });
    return () => {
      socket.off("messageReceived");
    };
  }, [id]);

  // code for audio call

  useEffect(() => {
    const cleanupAudioCall = () => {
      peer && peer.destroy();
      socket.off("audioOffer");
      socket.off("audioAnswer");
      socket.off("rejectCall");
      socket.off("endCall");
    };
    socket.on("audioOffer", async (data) => {
      setIncomingCall({
        callerName: data.callerName,
        target: data.target,
        offer: data.offer,
      });
    });

    socket.on("endCall", () => {
      peer && peer.destroy();
      setPeer(null);
      setCallAnswered(null);
      setStream(null);
      toast.info(`call ended`);
      setIncomingCall(null);
    });

    socket.on("rejectCall", ({ message }) => {
      clearTimeout(timeOutRef.current);
      peer && peer.destroy();
      setPeer(null);
      setCallAnswered(null);
      setStream(null);
      toast.info(`${message} by ${callerName}`);
      setIncomingCall(null);
    });

    socket.on("audioAnswer", async (data) => {
      setIncomingCall({ target: data.target });
      clearTimeout(timeOutRef.current);

      peer.signal(data.answer);
      setCallAnswered(true);
      // Notify the UI or take any actions upon call answer
    });

    socket.on("iceCandidate", (candidate) => {
      peer.addIceCandidate(candidate);
    });

    return cleanupAudioCall;
  }, [peer, stream]);

  const handleIncomingCall = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const peerConnection = new Peer({
        initiator: false,
        trickle: false,
        stream: userStream,
      });

      // Signal the answer back to the remote peer
      peerConnection.on("signal", (data) => {
        socket.emit("audioAnswer", {
          answer: data,
          target: incomingCall.target,
        });
      });

      // Event listener for receiving the remote stream
      peerConnection.on("stream", (remoteStream) => {
        remoteAudioRef.current.srcObject = remoteStream;
      });

      // When you receive the offer from the remote peer, call peer.signal(offer)
      peerConnection.signal(incomingCall.offer);
      setPeer(peerConnection);
      setStream(userStream);
      setCallAnswered(true);
    } catch (error) {
      toast.error("Failed to get your microphone");
      socket.emit("rejectCall", { target: id });
      setIncomingCall(null);
      console.error("Error accessing microphone:", error);
    }
  };

  const initiateCall = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const newPeer = new Peer({
        initiator: true,
        trickle: false,
        stream: userStream,
      });

      newPeer.on("signal", (data) => {
        socket.emit("audioOffer", {
          offer: data,
          callerName: name,
          target: id,
        });
      });

      timeOutRef.current = setTimeout(() => {
        handleCallTimeOut();
      }, 30000);

      newPeer.on("stream", (remoteStream) => {
        remoteAudioRef.current.srcObject = remoteStream;
      });

      setPeer(newPeer);
      setStream(userStream);
    } catch (err) {
      toast.error("Can not access your microphone");
    }
  };

  const handleCallTimeOut = () => {
    toast.error("call time out!");
    clearTimeout(timeOutRef.current);
    peer && peer.destroy();
    setPeer(null);
    socket.emit("endCall", { target: id });
    setStream(null);
  };

  const rejectCall = () => {
    socket.emit("rejectCall", { target: incomingCall.target });
    setIncomingCall(null);
  };

  const endCall = () => {
    socket.emit("endCall", { target: incomingCall.target });
    setIncomingCall(null);
    peer && peer.destroy();
    setPeer(null);
    setCallAnswered(null);
    setStream(null);
  };

  const showResponsiveSideNav = () => {
    if (window.screen.width > 640) return;
    setShowResponsive(true);
  };

  return (
    <div className="flex flex-row">
      <ToastContainer />
      {incomingCall ? (
        incomingCall && (
          <AudioCall
            CallAnswered={CallAnswered}
            callerName={incomingCall.callerName}
            onAccept={handleIncomingCall}
            audioRef={remoteAudioRef}
            onReject={rejectCall}
            endCall={endCall}
          />
        )
      ) : peer ? (
        <AudioCall
          audioRef={remoteAudioRef}
          CallAnswered={CallAnswered}
          isCalling={incomingCall == null}
          endCall={endCall}
        />
      ) : null}
      <div
        onMouseEnter={showResponsiveSideNav}
        onMouseLeave={() => setShowResponsive(false)}
        className={`sm:w-1/5 transition-all z-50 w-1/12 h-full sm:h-screen absolute bg-[#DADDE2] sm:relative ${
          showResponsive ? "hover:w-5/12" : ""
        } `}
      >
        <Navbar
          showResponsive={showResponsive}
          setResponsive={setShowResponsive}
        />
      </div>
      <div className="sm:w-4/5 ml-auto w-11/12 h-[100dvh] sm:h-screen">
        {id ? (
          <Suspense fallback={<div>Loading</div>}>
            <Chat initiateCall={initiateCall} />
          </Suspense>
        ) : (
          <div className="sm:w-[100%] w-screen h-[100dvh] flex items-center justify-center">
            <p className="font-bold text-2xl text-center">Select A Chat</p>
          </div>
        )}
      </div>
    </div>
  );
}
