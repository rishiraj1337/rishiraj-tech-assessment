// Undraw-style Authentication illustration with dark-neon aesthetic
export default function AuthIllustration({ className = "w-full h-52" }) {
  return (
    <svg
      viewBox="0 0 450 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="25" y="25" width="400" height="250" rx="8" fill="#121212" stroke="#00ffcc" strokeWidth="3" />
      <circle cx="100" cy="90" r="50" fill="#ff0080" fillOpacity="0.1" />

      {/* Lock Shield */}
      <rect x="185" y="105" width="80" height="90" rx="10" fill="#00ffcc" stroke="#000" strokeWidth="3" />
      <path
        d="M200 105 V75 C200 60, 250 60, 250 75 V105"
        stroke="#00ffcc"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="225" cy="145" r="8" fill="#000" />
      <path d="M225 153 V168" stroke="#000" strokeWidth="4" strokeLinecap="round" />

      {/* Glow lines */}
      <line x1="70" y1="220" x2="380" y2="220" stroke="#ff0080" strokeWidth="3" strokeDasharray="8 8" />
    </svg>
  );
}
