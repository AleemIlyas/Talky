// AudioPlayer.js
import { useMemo, useCallback, useRef } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import Timeline from "wavesurfer.js/dist/plugins/timeline.esm";
import PropTypes from "prop-types";
import { IonIcon } from "@ionic/react";
import { play, pause } from "ionicons/icons";

const AudioPlayer = ({ audioObjectURL }) => {
  const containerRef = useRef(null);

  const { wavesurfer, isPlaying } = useWavesurfer({
    container: containerRef,
    height: 40,
    width: "120px",
    barHeight: 24,
    waveColor: "rgb(200, 0, 200)",
    progressColor: "rgb(100, 0, 100)",
    url: audioObjectURL,
    plugins: useMemo(() => [Timeline.create()], []),
  });

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  return (
    <div className="flex items-center justify-center">
      <IonIcon icon={isPlaying ? pause : play} onClick={onPlayPause}></IonIcon>
      <div ref={containerRef} />
    </div>
  );
};

export default AudioPlayer;

AudioPlayer.propTypes = {
  audioObjectURL: PropTypes.string,
};
