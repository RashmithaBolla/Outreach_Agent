import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

/**
 * CircularProgress – SVG-based animated ring showing a score 0-100.
 * Props:
 *   score    – number (0-100)
 *   size     – pixel size of the SVG (default 100)
 *   stroke   – ring thickness (default 8)
 *   label    – text shown below the number
 */
export default function CircularProgress({
  score = 0,
  size = 100,
  stroke = 8,
  label = "Score",
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  // Animated dash offset
  const [displayed, setDisplayed] = useState(0);
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const target = score ?? 0;
    const startOffset = circumference;
    const endOffset = circumference - (target / 100) * circumference;

    // Animate the number
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * target));
      setOffset(startOffset - eased * (startOffset - endOffset));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score, circumference]);

  // Color based on score
  const color =
    displayed >= 80
      ? "#22C55E"
      : displayed >= 50
      ? "#F59E0B"
      : "#EF4444";

  const trackColor =
    displayed >= 80
      ? "#dcfce7"
      : displayed >= 50
      ? "#fef3c7"
      : "#fee2e2";

  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Track */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={stroke}
          />
          {/* Progress ring */}
          <motion.circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>
            {displayed}
          </span>
          <span className="text-xs text-gray-400">/ 100</span>
        </div>
      </div>
      <span className="text-xs text-gray-500 font-medium">{label}</span>
    </div>
  );
}
