import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { fetchMessages } from "../../store/Slices/messageSlice";
import MessageType from "./MessageType";

export default function Messages() {
  const messageListRef = useRef();
  const { messages } = useSelector((state) => state.message);
  const { _id } = useSelector((state) => state.user.userData);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!id) return;
    dispatch(fetchMessages(id));
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      const scrollOptions = {
        behavior: "smooth",
      };
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        ...scrollOptions,
      });
    }
  };

  return (
    <div ref={messageListRef} className="message">
      {!messages
        ? null
        : messages.map((item) => {
            return (
              <div
                key={item._id}
                className={item.sender === _id ? "send" : "receive"}
              >
                <div className="image">
                  {
                    <img
                      src="https://i.pravatar.cc/104?u=les@pravatar.com"
                      alt=""
                    />
                  }
                </div>
                <MessageType item={item} />
                {/* <span className="date">{getCurrentTimeFormatted()}</span> */}
              </div>
            );
          })}
    </div>
  );
}
