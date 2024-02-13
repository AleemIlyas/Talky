import PropTypes from "prop-types";
import AudioPlayer from "../UI/MessageInput/AudioPlayer";

export default function MessageType({ item }) {
  return item.message ? (
    <span>{item.message}</span>
  ) : (
    <span className="p-0">
      <AudioPlayer audioObjectURL={item.voiceMessage.data} />
      {/* <audio controls>
        <source
          src={item.voiceMessage.data}
          type={item.voiceMessage.contentType}
        />
      </audio> */}
    </span>
  );
}

MessageType.propTypes = {
  item: PropTypes.object,
};
