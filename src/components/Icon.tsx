import React from 'react';

// Minimal inline SVG icon set using Expedia-style icons

type IconName =
  | 'stays'
  | 'flights'
  | 'cars'
  | 'packages'
  | 'things-to-do'
  | 'cruises'
  | 'location'
  | 'calendar'
  | 'travelers'
  | 'search'
  | 'swap'
  | 'chevron-down'
  | 'chevron-up'
  | 'close'
  | 'minus'
  | 'plus'
  | 'check';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

const paths: Record<IconName, React.ReactNode> = {
  stays: (
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor" />
  ),
  flights: (
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor" />
  ),
  cars: (
    <>
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z" fill="currentColor" />
      <circle cx="7.5" cy="14.5" r="1.5" fill="currentColor" />
      <circle cx="16.5" cy="14.5" r="1.5" fill="currentColor" />
    </>
  ),
  packages: (
    <path d="M20 6h-2.18c.07-.44.18-.88.18-1.33C18 2.54 15.89.5 13.33.5c-1.3 0-2.4.56-3.33 1.44C9.07 1.06 7.97.5 6.67.5 4.11.5 2 2.54 2 4.67c0 .45.11.89.18 1.33H0v14h24V6h-4zm-6.67-4c1.11 0 2 .88 2 1.97C15.33 5.11 14.44 6 13.33 6H10V5.97C10 4.88 10.89 4 12 4v-.5c-.69 0-1.33.19-1.9.5C10.69 3.39 11.32 3 12 3c0-1.09-.89-1.97-2-1.97-.74 0-1.38.41-1.73 1.01C8.61 1.4 9.31 1 10.11 1c0 0 0 0 0 0zm-6.66 0C7.78 2 8.67 2.89 8.67 4c0 .01 0 .01 0 .01C8.27 3.41 7.63 3 6.89 3c1.11 0 2 .89 2 2h-.56C7.22 5 6.67 4.46 6.67 3.78V3.5c-.42 0-.78.18-1.03.47C5.63 4.63 6 5.28 6 6H4.67C4.67 4.9 5.56 4 6.67 4c0-1.11-.89-2-2-2zm14.66 16H2v-10h20v10z" fill="currentColor" />
  ),
  'things-to-do': (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="currentColor" />
  ),
  cruises: (
    <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.9-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z" fill="currentColor" />
  ),
  location: (
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor" />
  ),
  calendar: (
    <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z" fill="currentColor" />
  ),
  travelers: (
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor" />
  ),
  search: (
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor" />
  ),
  swap: (
    <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" fill="currentColor" />
  ),
  'chevron-down': (
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="currentColor" />
  ),
  'chevron-up': (
    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z" fill="currentColor" />
  ),
  close: (
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
  ),
  minus: (
    <path d="M19 13H5v-2h14v2z" fill="currentColor" />
  ),
  plus: (
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
  ),
  check: (
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
  ),
};

export const Icon: React.FC<IconProps> = ({ name, size = 20, color = 'currentColor', style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    color={color}
    style={{ display: 'block', flexShrink: 0, ...style }}
    aria-hidden
  >
    {paths[name]}
  </svg>
);
