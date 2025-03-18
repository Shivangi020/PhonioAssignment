"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "./salesAgent.module.css";
import VideoCallPopup from "@/components/VideoCall/VideoCallPopup";

export default function SalesAgent() {
  const [showCall, setShowCall] = useState(false);
  const [roomName, setRoomName] = useState("sales");
  const [participantName, setParticipantName] = useState("sales agent");

  const handleJoinCall = () => {
    if (roomName.trim()) {
      setShowCall(true);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Sales Agent Dashboard</title>
        <meta
          name="description"
          content="Sales agent dashboard for video calls"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Sales Agent Dashboard</h1>

        <div className={styles.joinForm}>
          <div className={styles.formGroup}>
            <label htmlFor="roomName">Room Name:</label>
            <input
              type="text"
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name to join"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="participantName">Your Name:</label>
            <input
              type="text"
              id="participantName"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              className={styles.input}
            />
          </div>

          <button
            onClick={handleJoinCall}
            className={styles.joinButton}
            disabled={!roomName.trim()}
          >
            Join Call
          </button>
        </div>

        {showCall && (
          <VideoCallPopup
            roomName={roomName}
            participantName={participantName}
            onClose={() => setShowCall(false)}
          />
        )}
      </main>

      <footer className={styles.footer}>
        <p>Sales Agent Dashboard © 2025</p>
      </footer>
    </div>
  );
}
