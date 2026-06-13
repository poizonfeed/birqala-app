"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import styles from "./PostSuccess.module.css";

function ConfettiCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Confetti particles
    const colors = ["#FFFFFF", "#C8E6C9", "#E8F5E9", "#A5D6A7", "#FFF59D", "#FFE082", "#FFAB91"];
    const particles = [];

    // Explode from the middle-bottom area (above checking card)
    const startX = canvas.width / 2;
    const startY = canvas.height / 2 - 20;

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: startX,
        y: startY,
        radius: Math.random() * 6 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 20 - 4,
        gravity: 0.28,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1.0,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let active = false;
      particles.forEach((p) => {
        if (p.opacity > 0) {
          active = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.vx *= 0.97; // air friction
          p.rotation += p.rotationSpeed;

          if (p.vy > 2) {
            p.opacity -= 0.008; // fade out as they descend
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          
          // Render rectangle confetti
          ctx.fillRect(-p.radius, -p.radius / 2, p.radius * 2, p.radius);
          ctx.restore();
        }
      });

      if (active) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}

export default function PostSuccess() {
  return (
    <div className={styles.overlay}>
      <ConfettiCanvas />
      <div className={styles.card}>
        <div className={styles.iconCircle}>
          <Check size={48} className={styles.checkIcon} />
        </div>
        <h2 className={styles.title}>Post Created!</h2>
        <p className={styles.subtitle}>Your report has been submitted to the community.</p>
      </div>
    </div>
  );
}
