/** 이미지가 업로드되지 않았을 때 사용하는 기본 이미지 (파란 그라데이션 + 비행기) */
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#64b5f6"/>
      <stop offset="1" stop-color="#1565c0"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" fill="url(#g)"/>
  <circle cx="540" cy="70" r="36" fill="#ffffff" fill-opacity="0.35"/>
  <path d="M0 300 Q160 240 320 290 T640 270 V360 H0 Z" fill="#ffffff" fill-opacity="0.25"/>
  <g transform="translate(320 170) rotate(-20) scale(4)" fill="#ffffff">
    <path d="M-12 2 L12 -2 L12 2 L2 4 L0 14 L-3 14 L-3 4 L-12 5 Z" transform="translate(0 -4)"/>
  </g>
</svg>`;

export const DEFAULT_IMAGE = `data:image/svg+xml;utf8,${ encodeURIComponent(svg) }`;
