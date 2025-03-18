import { useState, useCallback, useRef, useEffect } from "react";
import styles from "./component.module.css";
import { createNoise3D } from "simplex-noise";

const Background = () => {
  const canvasRef = useRef(null);
  const modalRef = useRef(null);
  const triggerRef = useRef(null);
  const [hueBase, setHueBase] = useState(300);

  const noise3D = createNoise3D();

  // const noise = new SimplexNoise();
  const noise = "";
  let nt = 0;
  const crm = 1; // 4x res
  const cw = 1000;
  const ch = 1000;
  const w = cw * crm;
  const h = ch * crm;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${100}%`;
    canvas.style.height = `${100}%`;

    const drawCircularWaves = () => {
      ctx.save();
      ctx.globalCompositeOperation = "lighter"; // Makes it blend smoothly
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";

      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(500 / 1, 500 / 4, 120 + i * 140, 0, Math.PI);
        ctx.stroke();
        ctx.closePath();
      }

      ctx.restore();
    };

    const drawWave = (n) => {
      nt += 0.002;
      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.globalCompositeOperation = "lighter";
        ctx.lineWidth = 60;
        ctx.filter = "blur(70px)";
        ctx.strokeStyle = `hsla(8, 100%, 60%, 0.5)`;

        for (let y = -30; y < h + 0; y += 30) {
          let x = noise3D(y / 1000, i * 0.8, nt) * 200;
          ctx.lineTo(x + w / 2, y);
        }
        ctx.stroke();
        ctx.closePath();
      }
    };

    const render = () => {
      ctx.clearRect(-50, -50, w + 100, h + 100);
      ctx.fillStyle = "transparent";
      ctx.fillRect(-50, -50, w + 100, h + 100);
      drawWave(10);
      drawCircularWaves();
      requestAnimationFrame(render);
    };

    render();
  }, [hueBase]);

  return (
    <div className={styles.bgMain}>
      <canvas
        ref={canvasRef}
        id="canvas"
        onMouseDown={() => (document.body.style.cursor = "grabbing")}
        onMouseUp={() => (document.body.style.cursor = "default")}
        onTouchMove={(e) => setHueBase(e.touches[0].pageY / (h / 360))}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    </div>
  );
};

export default Background;
