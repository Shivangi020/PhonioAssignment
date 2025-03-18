"use client";
import Hero from "@/components/Hero";
import styles from "./page.module.css";
import CallNowButton from "@/components/VideoCall/CallNowButton";
import Review from "@/components/Review";
import RevalidateButton from "@/components/RevalidateButton";

function getServerBuildTime() {
  const serverBuildTime = new Date().toISOString();

  console.log(`[Server] Page built at: ${serverBuildTime}`);
  return serverBuildTime;
}

export default function Home() {
  const serverBuildTime = getServerBuildTime();
  return (
    <div className={styles.page}>
      <Hero />

      <CallNowButton />
      <Review />
      <p>Server Build Time: {new Date(serverBuildTime).toLocaleString()}</p>
      <RevalidateButton path="/" />
    </div>
  );
}
