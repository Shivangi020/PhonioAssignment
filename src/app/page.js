"use client";
import Hero from "@/components/Hero";
import styles from "./page.module.css";
import CallNowButton from "@/components/VideoCall/CallNowButton";
import Review from "@/components/Review";
import HeroSection from "@/components/HeroSection/HeroSection";

async function getData() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
    next: { revalidate: 5 * 60 * 60 }, // Revalidate every 5 hours
  });
  return res.json();
}

export default function Home() {
  return (
    <div className={styles.page}>
      <Hero />
      {/* <HeroSection /> */}
      <CallNowButton />
      <Review />
    </div>
  );
}
