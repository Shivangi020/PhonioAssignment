import { useState } from "react";
import VideoCallPopup from "./VideoCallPopup";
import styles from "./videoCall.module.css";
import { IoCall } from "react-icons/io5";

export default function CallNowButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className={styles.popup}>
      <VideoCallPopup onClose={() => setShowPopup(false)} isOpen={showPopup} />
      <button onClick={() => setShowPopup(true)} className={styles.joinCallBtn}>
        <IoCall />
        <span>Join Call</span>
      </button>
    </div>
  );
}
