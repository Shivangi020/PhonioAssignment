// HeroSection.jsx
import React, { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";
import styles from "./heroSection.module.css";

const HeroSection = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Create a new simplex noise instance
    const noise2D = createNoise2D();

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    // Animation variables
    let time = 0;
    let animationFrameId;

    // Draw function
    const draw = () => {
      // Clear canvas with black background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create the noise-based red abstract shapes
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
          // Calculate pixel index
          const idx = (y * canvas.width + x) * 4;

          // Create multiple layers of noise with different scales and movement speeds
          const noiseVal1 =
            noise2D(x * 0.002, y * 0.002 + time * 0.05) * 0.5 + 0.5;
          const noiseVal2 =
            noise2D(x * 0.005 + 100, y * 0.005 - time * 0.02) * 0.5 + 0.5;
          const noiseVal3 =
            noise2D(x * 0.0008 - 200, y * 0.0008 + time * 0.01) * 0.5 + 0.5;

          // Combine noise values and apply threshold for the red glow effect
          let combinedNoise =
            (noiseVal1 * 0.6 + noiseVal2 * 0.3 + noiseVal3 * 0.7) / 1.6;

          // Apply threshold to create distinct shapes with soft edges
          combinedNoise = Math.pow(combinedNoise, 2.5);

          // Set color values - red glow with black background
          if (combinedNoise > 0.1) {
            // Red channel (stronger)
            data[idx] = Math.min(255, Math.floor(combinedNoise * 255 * 2));
            // Green and Blue channels (much lower for reddish glow)
            data[idx + 1] = Math.floor(combinedNoise * 30);
            data[idx + 2] = Math.floor(combinedNoise * 20);
            // Alpha channel
            data[idx + 3] = Math.floor(combinedNoise * 200);
          } else {
            // Black background (fully transparent so we see the black fillRect)
            data[idx + 3] = 0;
          }
        }
      }

      // Add grain/noise texture
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 0 && Math.random() > 0.85) {
          const grainAmount = Math.random() * 30 - 15;
          data[i] = Math.max(0, Math.min(255, data[i] + grainAmount));
          data[i + 1] = Math.max(
            0,
            Math.min(255, data[i + 1] + grainAmount * 0.2)
          );
          data[i + 2] = Math.max(
            0,
            Math.min(255, data[i + 2] + grainAmount * 0.1)
          );
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Apply post-processing effects
      // 1. Apply a slight blur to soften the edges (using multiple semi-transparent layers)
      ctx.globalAlpha = 0.4;
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1.0;

      // 2. Add subtle vignette effect
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.7
      );
      gradient.addColorStop(0, "rgba(0,0,0,0)");
      gradient.addColorStop(1, "rgba(0,0,0,0.4)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Increment time for animation
      time += 0.01;

      // Continue animation loop
      animationFrameId = window.requestAnimationFrame(draw);
    };

    // Start animation
    draw();

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={styles.heroContainer}>
      <canvas ref={canvasRef} className={styles.backgroundCanvas}></canvas>

      <header className={styles.header}>
        <div className={styles.logoWrapper}>
          <h1 className={styles.logo}>Osmo</h1>
          <span className={styles.logoIcon}>⟐</span>
        </div>

        <nav className={styles.navbar}>
          <a href="#home" className={styles.navLink}>
            Home
          </a>
          <a href="#pricing" className={styles.navLink}>
            Pricing
          </a>
          <a href="#updates" className={styles.navLink}>
            Updates
            <span className={styles.updateBadge}>59</span>
          </a>
          <a href="#faq" className={styles.navLink}>
            FAQ
          </a>
        </nav>

        <div className={styles.authNav}>
          <a href="#login" className={styles.logInLink}>
            Log in
          </a>
          <a href="#get-started" className={styles.getStartedBtn}>
            Get Started
          </a>
        </div>
      </header>

      <div className={styles.sideMenu}>
        <div className={styles.leftColumn}>
          <div className={styles.menuItem}>Buttons</div>
          <div className={styles.menuItem}>Components</div>
          <div className={styles.menuItem}>Transitions</div>
          <div className={styles.menuItem}>Animations</div>
          <div className={styles.menuItem}>Loaders</div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.menuItem}>Documentation</div>
          <div className={styles.menuItem}>Tools</div>
          <div className={styles.menuItem}>References</div>
          <div className={styles.menuItem}>Tutorials</div>
        </div>
      </div>

      <div className={styles.heroContent}>
        <h2 className={styles.heroTitle}>
          Start building websites
          <span className={styles.heroBreak}>people remember.</span>
        </h2>

        <div className={styles.ctaContainer}>
          <button className={styles.memberBtn}>Become a member</button>
          <button className={styles.aboutBtn}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatar}></div>
              <div className={`${styles.avatar} ${styles.secondAvatar}`}></div>
            </div>
            About us
          </button>
        </div>
      </div>

      <div className={styles.tagline}>
        Osmo came from constantly digging through old
      </div>
    </div>
  );
};

export default HeroSection;
