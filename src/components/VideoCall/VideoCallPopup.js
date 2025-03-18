import { useState, useEffect, useRef } from "react";
import { Room, Track } from "livekit-client";
import styles from "./videoCall.module.css";
// import Draggable from "react-draggable";
import { BsFillMicMuteFill } from "react-icons/bs";
import { MdKeyboardVoice } from "react-icons/md";
import { FaVideoSlash } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";

const LIVEKIT_SERVER_URL = process.env.LIVEKIT_SERVER_URL;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

export default function VideoCallPopup({ isOpen, onClose }) {
  const [room, setRoom] = useState(null);
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const connectRoom = async () => {
      const livekitRoom = new Room();
      await livekitRoom.connect(LIVEKIT_SERVER_URL, ACCESS_TOKEN);

      // Enable local video & audio
      await livekitRoom.localParticipant.setCameraEnabled(true);
      await livekitRoom.localParticipant.setMicrophoneEnabled(true);

      setRoom(livekitRoom);

      // Attach local video
      const localTrack = livekitRoom.localParticipant.getTrackPublication(
        Track.Source.Camera
      );
      if (localTrack && localTrack.track) {
        localTrack.track.attach(videoRef.current);
      }

      // Attach remote tracks
      livekitRoom.on("trackSubscribed", (track, publication, participant) => {
        if (track.kind === Track.Kind.Video) {
          track.attach(videoRef.current);
        }
      });
    };

    connectRoom();

    return () => room?.disconnect();
  }, [isOpen]);

  const toggleMute = () => {
    // if (!room) return;
    // room.localParticipant.setMicrophoneEnabled(muted);
    setMuted(!muted);
  };

  const toggleVideo = () => {
    // if (!room) return;
    // room.localParticipant.setCameraEnabled(!videoEnabled);
    setVideoEnabled(!videoEnabled);
  };

  if (!isOpen) return null;
  return (
    // <Draggable>
    <div className={styles.videoPopup}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={styles.video}
      ></video>
      <div className={styles.actionBtnCn}>
        <button onClick={toggleMute} className={styles.actionBtn}>
          {muted ? <BsFillMicMuteFill /> : <MdKeyboardVoice />}
        </button>
        <button onClick={toggleVideo} className={styles.actionBtn}>
          {videoEnabled ? <FaVideo /> : <FaVideoSlash />}
        </button>
      </div>
    </div>
    // </Draggable>
  );
}
