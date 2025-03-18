// File: components/VideoCallPopup.js
import { useRef, useState, useEffect } from "react";
import {
  Room,
  VideoTrack,
  AudioTrack,
  RoomEvent,
  Participant,
} from "livekit-client";
import styles from "./videoCall.module.css";

const VideoCallPopup = ({ roomName, participantName, onClose }) => {
  const popupRef = useRef(null);
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [localParticipant, setLocalParticipant] = useState(null);
  const [isPiPActive, setIsPiPActive] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 640, height: 480 });

  // Handle drag functionality
  const handleMouseDown = (e) => {
    if (e.target.className.includes("dragHandle")) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: position.x + e.movementX,
        y: position.y + e.movementY,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Safe attachment of video track
  const attachVideoTrack = (node, participant) => {
    if (!node || !participant) return;

    try {
      // Check if videoTracks exists and has a values method
      if (
        !participant.videoTracks ||
        typeof participant.videoTracks.values !== "function"
      ) {
        console.log("videoTracks is not iterable", participant);
        return;
      }

      const videoTracksArray = Array.from(participant.videoTracks.values());
      const videoTrackPublication = videoTracksArray[0];

      if (videoTrackPublication && videoTrackPublication.track) {
        videoTrackPublication.track.attach(node);
      } else {
        console.log("No video track available for", participant.identity);
      }
    } catch (error) {
      console.log("Error attaching video track:", error);
    }
  };

  // Safe attachment of audio track
  const attachAudioTrack = (node, participant) => {
    if (!node || !participant) return;

    try {
      // Check if audioTracks exists and has a values method
      if (
        !participant.audioTracks ||
        typeof participant.audioTracks.values !== "function"
      ) {
        console.error("audioTracks is not iterable", participant);
        return;
      }

      const audioTracksArray = Array.from(participant.audioTracks.values());
      const audioTrackPublication = audioTracksArray[0];

      if (audioTrackPublication && audioTrackPublication.track) {
        audioTrackPublication.track.attach(node);
      }
    } catch (error) {
      console.error("Error attaching audio track:", error);
    }
  };

  // Connect to LiveKit room
  useEffect(() => {
    const connectToRoom = async () => {
      try {
        // In a real app, you would get this token from your server
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDMxOTU5MjMsImlzcyI6IkFQSXRIZ1dnd1Rxd0JxRiIsIm5iZiI6MTc0MjI5NTkyMywic3ViIjoiQ3VzdG9tZXIiLCJ2aWRlbyI6eyJjYW5QdWJsaXNoIjp0cnVlLCJjYW5QdWJsaXNoRGF0YSI6dHJ1ZSwiY2FuU3Vic2NyaWJlIjp0cnVlLCJyb29tIjoiZGVtby11c2VyIiwicm9vbUpvaW4iOnRydWV9fQ.ehhkRhd7ozr9c2maHYToK1-WuV0_SLmS_d_nklUpvtQ";

        const newRoom = new Room({
          adaptiveStream: true,
          dynacast: true,
          videoCaptureDefaults: {
            resolution: { width: 640, height: 480 },
          },
        });

        setRoom(newRoom);

        newRoom.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
        newRoom.on(
          RoomEvent.ParticipantDisconnected,
          handleParticipantDisconnected
        );
        newRoom.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
        newRoom.on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);

        await newRoom.connect(`wss://phonicai-bcc6vxbp.livekit.cloud`, token);
        console.log("Connected to room:", roomName);

        if (newRoom.localParticipant) {
          setLocalParticipant(newRoom.localParticipant);
          // Setup local tracks
          await newRoom.localParticipant.enableCameraAndMicrophone();
        }

        // Initialize with existing participants
        // Fix: Use the correct method to get participants and add safety checks
        try {
          if (
            newRoom.participants &&
            typeof newRoom.participants.values === "function"
          ) {
            setParticipants(Array.from(newRoom.participants.values()));
          } else {
            console.log(
              "No participants or participants.values is not a function"
            );
            setParticipants([]);
          }
        } catch (error) {
          console.error("Error getting participants:", error);
          setParticipants([]);
        }
      } catch (error) {
        console.error("Error connecting to room:", error);
      }
    };

    connectToRoom();

    // Cleanup function
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [roomName, participantName]);

  // Handle participants and tracks
  const handleParticipantConnected = (participant) => {
    console.log("Participant connected:", participant.identity);
    setParticipants((prevParticipants) => [...prevParticipants, participant]);
  };

  const handleParticipantDisconnected = (participant) => {
    console.log("Participant disconnected:", participant.identity);
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p.sid !== participant.sid)
    );
  };

  const handleTrackSubscribed = (track, publication, participant) => {
    console.log("Track subscribed:", track.kind, "from", participant.identity);
    // Force a re-render when a track is subscribed
    setParticipants((prevParticipants) => [...prevParticipants]);
  };

  const handleTrackUnsubscribed = (track, publication, participant) => {
    console.log(
      "Track unsubscribed:",
      track.kind,
      "from",
      participant.identity
    );
    // Force a re-render when a track is unsubscribed
    setParticipants((prevParticipants) => [...prevParticipants]);
  };

  // Mock function to fetch token from server
  const fetchToken = async (identity, room) => {
    // In a real application, this would make an API call to your server
    // For this demo, we're mocking it
    console.log("Fetching token for:", identity, "in room:", room);
    return "YOUR_TOKEN_HERE";
  };

  // Toggle audio mute
  const toggleAudio = () => {
    if (localParticipant) {
      const enabled = !isAudioMuted;
      localParticipant.setMicrophoneEnabled(enabled);
      setIsAudioMuted(!enabled);
    }
  };

  // Toggle video mute
  const toggleVideo = () => {
    if (localParticipant) {
      const enabled = !isVideoMuted;
      localParticipant.setCameraEnabled(enabled);
      setIsVideoMuted(!enabled);
    }
  };

  // Toggle picture-in-picture mode
  const togglePiP = async () => {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      setIsPiPActive(false);
    } else if (popupRef.current) {
      try {
        // Find the first video element in our popup
        const videoElement = popupRef.current.querySelector("video");
        if (videoElement) {
          await videoElement.requestPictureInPicture();
          setIsPiPActive(true);
        }
      } catch (error) {
        console.error("PiP error:", error);
      }
    }
  };

  return (
    <div
      className={styles.popupContainer}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
      ref={popupRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className={styles.dragHandle}>
        <span>Video Call: {roomName}</span>
        <div className={styles.controls}>
          <button onClick={togglePiP}>
            {isPiPActive ? "Exit PiP" : "Enter PiP"}
          </button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>

      <div className={styles.videoGrid}>
        {localParticipant && (
          <div className={styles.videoContainer}>
            <video
              autoPlay
              muted
              ref={(node) => attachVideoTrack(node, localParticipant)}
              className={styles.video}
            />
            <div className={styles.participantName}>
              You {isVideoMuted && "(Video Off)"}
            </div>
          </div>
        )}

        {participants && participants.length > 0 ? (
          participants.map((participant) => (
            <div
              key={participant.sid || Math.random().toString()}
              className={styles.videoContainer}
            >
              <video
                autoPlay
                ref={(node) => attachVideoTrack(node, participant)}
                className={styles.video}
              />
              <audio
                autoPlay
                ref={(node) => attachAudioTrack(node, participant)}
              />
              <div className={styles.participantName}>
                {participant.identity}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            Waiting for other participants to join...
          </div>
        )}
      </div>

      <div className={styles.controlBar}>
        <button
          onClick={toggleAudio}
          className={isAudioMuted ? styles.buttonMuted : styles.button}
        >
          {isAudioMuted ? "Unmute Audio" : "Mute Audio"}
        </button>
        <button
          onClick={toggleVideo}
          className={isVideoMuted ? styles.buttonMuted : styles.button}
        >
          {isVideoMuted ? "Turn On Video" : "Turn Off Video"}
        </button>
      </div>

      <div
        className={styles.resizeHandle}
        onMouseDown={(e) => {
          e.stopPropagation();
          const startX = e.clientX;
          const startY = e.clientY;
          const startWidth = size.width;
          const startHeight = size.height;

          const handleResize = (moveEvent) => {
            setSize({
              width: Math.max(320, startWidth + moveEvent.clientX - startX),
              height: Math.max(240, startHeight + moveEvent.clientY - startY),
            });
          };

          const removeListeners = () => {
            window.removeEventListener("mousemove", handleResize);
            window.removeEventListener("mouseup", removeListeners);
          };

          window.addEventListener("mousemove", handleResize);
          window.addEventListener("mouseup", removeListeners);
        }}
      />
    </div>
  );
};

export default VideoCallPopup;
