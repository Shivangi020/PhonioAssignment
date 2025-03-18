import { useState } from "react";
import VideoCallPopup from "./VideoCallPopup";
import styles from "./videoCall.module.css";
import { IoCall } from "react-icons/io5";

export default function CallNowButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className={styles.popup}>
      {showPopup && (
        <VideoCallPopup
          onClose={() => setShowPopup(false)}
          roomName="demo-user"
          participantName={"Customer"}
        />
      )}
      <button onClick={() => setShowPopup(true)} className={styles.joinCallBtn}>
        <IoCall />
        <span>Join Call</span>
      </button>
    </div>
  );
}
