// components/RevalidateButton.jsx
"use client";

import { useState } from "react";
import styles from "./component.module.css";

export default function RevalidateButton({ path = "/" }) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastBuildTime, setLastBuildTime] = useState(null);
  const [error, setError] = useState(null);

  const handleRevalidate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Make sure this API path matches your route file location exactly
      const response = await fetch("/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path }),
      });

      console.log(response);
      // Check response status first
      if (!response.ok) {
        throw new Error(
          `Server responded with ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();

      // Log the server build time on the client side
      console.log(
        `[Client] Server build time after revalidation: ${data.serverBuildTime}`
      );
      setLastBuildTime(data.serverBuildTime);

      // Reload the page after a short delay to show the updated content
      //   setTimeout(() => window.location.reload(), 500);
    } catch (err) {
      console.error("[Client] Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.revalidateContainer}>
      <button
        onClick={handleRevalidate}
        disabled={isLoading}
        className={styles.revalidateButton}
      >
        {isLoading ? "Revalidating..." : "Purge Cache & Rebuild"}
      </button>

      {lastBuildTime && (
        <div className={styles.buildTime}>
          Last server build: {new Date(lastBuildTime).toLocaleString()}
        </div>
      )}

      {error && <div className={styles.error}>Error: {error}</div>}
    </div>
  );
}
