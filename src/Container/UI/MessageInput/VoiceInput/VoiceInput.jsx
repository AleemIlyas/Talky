import { LiveAudioVisualizer } from "react-audio-visualize";
import PropTypes from "prop-types";
import styles from "./voice.module.css";

const Visualizer = ({ mediaRecorder }) => {
  return (
    <div
      className={["flex items-center justify-center", styles.container].join(
        " "
      )}
    >
      {mediaRecorder && (
        <LiveAudioVisualizer
          height={"10%"}
          fftSize={64}
          mediaRecorder={mediaRecorder.current}
          barColor={"rgb(37,99,235)"}
          gap={2}
        />
      )}
    </div>
  );
};

Visualizer.propTypes = {
  mediaRecorder: PropTypes.object,
};

export default Visualizer;
