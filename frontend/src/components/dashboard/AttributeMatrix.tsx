'use client';

import React from 'react';

interface AttributeMatrixProps {
  attributes?: {
    security: number;
    correctness: number;
    maintainability: number;
    architecture: number;
    performance: number;
  };
}

export function AttributeMatrix({
  attributes = {
    security: 0,
    correctness: 0,
    maintainability: 0,
    architecture: 0,
    performance: 0,
  },
}: AttributeMatrixProps) {
  // 5 axes: Top (Security), Right (Perf), Bottom-Right (Arch), Bottom-Left (Maint), Left (Correct)
  // Angles in radians (0 at -90 deg for top)
  const axes = [
    { label: `Security (${attributes.security})`, value: attributes.security, angle: -Math.PI / 2, align: 'top' },
    { label: `Perf (${attributes.performance})`, value: attributes.performance, angle: -Math.PI / 2 + (2 * Math.PI) / 5, align: 'right' },
    { label: `Arch (${attributes.architecture})`, value: attributes.architecture, angle: -Math.PI / 2 + (4 * Math.PI) / 5, align: 'bottom-right' },
    { label: `Maint (${attributes.maintainability})`, value: attributes.maintainability, angle: -Math.PI / 2 + (6 * Math.PI) / 5, align: 'bottom-left' },
    { label: `Correct (${attributes.correctness})`, value: attributes.correctness, angle: -Math.PI / 2 + (8 * Math.PI) / 5, align: 'left' },
  ];

  const size = 300;
  const center = size / 2;
  const maxRadius = 90;

  // Compute polygon points for data
  const dataPoints = axes.map((axis) => {
    const r = (axis.value / 100) * maxRadius;
    const x = center + r * Math.cos(axis.angle);
    const y = center + r * Math.sin(axis.angle);
    return { x, y, ...axis };
  });

  const polygonPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  // Concentric grid rings (20%, 40%, 60%, 80%, 100%)
  const gridRings = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="bg-[#0b101b] border border-[#162032] rounded-lg p-5 flex flex-col justify-between h-full relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono tracking-widest text-[#64748b] uppercase">
          ATTRIBUTE MATRIX
        </span>
      </div>

      {/* SVG Chart */}
      <div className="relative flex items-center justify-center w-full my-auto">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full max-w-[280px] h-auto overflow-visible select-none"
        >
          {/* Concentric Polygons */}
          {gridRings.map((scale, idx) => {
            const ringPoints = axes.map((axis) => {
              const r = maxRadius * scale;
              const x = center + r * Math.cos(axis.angle);
              const y = center + r * Math.sin(axis.angle);
              return `${x},${y}`;
            }).join(' ');

            return (
              <polygon
                key={idx}
                points={ringPoints}
                fill="none"
                stroke="#172235"
                strokeWidth="1"
                strokeDasharray={scale === 1 ? 'none' : '2 2'}
              />
            );
          })}

          {/* Radial Axis Lines */}
          {axes.map((axis, i) => {
            const x = center + maxRadius * Math.cos(axis.angle);
            const y = center + maxRadius * Math.sin(axis.angle);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#162338"
                strokeWidth="1"
              />
            );
          })}

          {/* Data Polygon Fill & Stroke */}
          <polygon
            points={dataPoints.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="rgba(56, 189, 248, 0.08)"
            stroke="#56b6f7"
            strokeWidth="1.75"
          />

          {/* Data Points / Vertices with Cyan Glow */}
          {dataPoints.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="#070a0f"
                stroke="#67e8f9"
                strokeWidth="2"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="2"
                fill="#67e8f9"
              />
            </g>
          ))}

          {/* Axis Labels */}
          {axes.map((axis, i) => {
            const labelRadius = maxRadius + 22;
            const x = center + labelRadius * Math.cos(axis.angle);
            const y = center + labelRadius * Math.sin(axis.angle);

            let textAnchor: 'middle' | 'start' | 'end' = 'middle';
            if (axis.angle > -Math.PI / 2 && axis.angle < Math.PI / 2) textAnchor = 'start';
            else if (axis.angle < -Math.PI / 2 || axis.angle > Math.PI / 2) textAnchor = 'end';

            return (
              <text
                key={i}
                x={x}
                y={y + 3}
                fill="#94a3b8"
                fontSize="9.5"
                fontFamily="ui-monospace, monospace"
                textAnchor={textAnchor}
                className="transition-colors hover:fill-[#67e8f9]"
              >
                {axis.label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
