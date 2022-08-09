export function Star({
  className,
  filled,
  onClick,
}: {
  className?: string;
  filled?: boolean;
  onClick?: () => void;
}) {
  return (
    <svg
      width="36.09px"
      height="36.09px"
      viewBox="0 0 36.09 36.09"
      className={className}
      onClick={onClick}
    >
      <path
        fill={filled ? "#FFDE2E" : "#fff"}
        d="M 34.695 14.626 C 34.572 14.249 34.895 13.984 34.501 13.942 L 23.306 12.565 L 18.643 2.322 C 18.483 1.962 18.437 1.681 18.041 1.681 C 17.645 1.681 17.689 2.255 17.529 2.619 L 13.036 12.819 L 1.652 14.052 C 1.258 14.092 0.924 13.696 0.802 14.072 C 0.679 14.449 0.881 14.708 1.177 14.972 L 9.478 22.71 L 7.101 33.842 C 7.018 34.229 6.988 34.045 7.309 34.278 C 7.484 34.405 7.395 34.429 7.602 34.429 C 7.775 34.429 8.432 34.189 8.588 34.097 L 18.057 28.347 L 28.087 34.297 C 28.429 34.494 28.429 34.799 28.75 34.562 C 29.07 34.333 28.93 34.435 28.847 34.048 L 26.559 22.428 L 34.199 15.654 C 34.493 15.394 34.818 15.002 34.695 14.626 Z"
      />
      <path
        d="M36.042,13.909c-0.123-0.377-0.456-0.646-0.85-0.688l-11.549-1.172L18.96,1.43c-0.16-0.36-0.519-0.596-0.915-0.596
      s-0.755,0.234-0.915,0.598L12.446,12.05L0.899,13.221c-0.394,0.04-0.728,0.312-0.85,0.688c-0.123,0.377-0.011,0.791,0.285,1.055
      l8.652,7.738L6.533,34.045c-0.083,0.387,0.069,0.787,0.39,1.02c0.175,0.127,0.381,0.191,0.588,0.191
      c0.173,0,0.347-0.045,0.503-0.137l10.032-5.84l10.03,5.84c0.342,0.197,0.77,0.178,1.091-0.059c0.32-0.229,0.474-0.633,0.391-1.02
      l-2.453-11.344l8.653-7.737C36.052,14.699,36.165,14.285,36.042,13.909z M25.336,21.598c-0.268,0.24-0.387,0.605-0.311,0.957
      l2.097,9.695l-8.574-4.99c-0.311-0.182-0.695-0.182-1.006,0l-8.576,4.99l2.097-9.695c0.076-0.352-0.043-0.717-0.311-0.957
      l-7.396-6.613l9.87-1.002c0.358-0.035,0.668-0.264,0.814-0.592l4.004-9.077l4.003,9.077c0.146,0.328,0.456,0.557,0.814,0.592
      l9.87,1.002L25.336,21.598z"
      />
    </svg>
  );
}