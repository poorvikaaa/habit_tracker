import React from "react";

export default function ProgressRing({ percent = 0, size = 64, stroke = 8 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${size/2}, ${size/2})`}>
        <circle r={radius} fill="transparent" stroke="#eee" strokeWidth={stroke} cx="0" cy="0" />
        <circle
          r={radius}
          fill="transparent"
          stroke="#4f46e5"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90)"
        />
      </g>
    </svg>
  );
}
