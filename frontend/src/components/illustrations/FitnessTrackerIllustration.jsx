// Undraw-style Fitness Tracker Illustration with dark-neon aesthetic
export default function FitnessTrackerIllustration({ className = "w-full h-48" }) {
  return (
    <svg
      viewBox="0 0 500 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background elements */}
      <rect x="20" y="20" width="460" height="260" rx="8" fill="#121212" stroke="#000" strokeWidth="3" />
      <circle cx="80" cy="80" r="40" fill="#ff0080" fillOpacity="0.15" />
      <circle cx="420" cy="220" r="50" fill="#00ffcc" fillOpacity="0.15" />
      
      {/* Progress Chart / Activity Bars */}
      <rect x="60" y="160" width="24" height="80" rx="4" fill="#ff0080" stroke="#000" strokeWidth="2" />
      <rect x="95" y="120" width="24" height="120" rx="4" fill="#00ffcc" stroke="#000" strokeWidth="2" />
      <rect x="130" y="140" width="24" height="100" rx="4" fill="#ffe600" stroke="#000" strokeWidth="2" />
      <rect x="165" y="90" width="24" height="150" rx="4" fill="#00ff66" stroke="#000" strokeWidth="2" />
      <rect x="200" y="110" width="24" height="130" rx="4" fill="#00ffcc" stroke="#000" strokeWidth="2" />

      {/* Fitness Character Silhouette */}
      <circle cx="340" cy="90" r="22" fill="#00ffcc" stroke="#000" strokeWidth="2" />
      <path
        d="M340 115 L340 180 M340 135 L305 160 M340 135 L375 145 M340 180 L315 240 M340 180 L365 230"
        stroke="#f0f0f0"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dumbbell in hand */}
      <rect x="290" y="150" width="12" height="24" rx="2" fill="#ff0080" stroke="#000" strokeWidth="2" />
      <line x1="290" y1="162" x2="310" y2="162" stroke="#ff0080" strokeWidth="4" />
      <rect x="305" y="150" width="12" height="24" rx="2" fill="#ff0080" stroke="#000" strokeWidth="2" />

      {/* Target Metric Badge */}
      <g transform="translate(260, 35)">
        <rect width="180" height="40" rx="4" fill="#1e1e1e" stroke="#00ffcc" strokeWidth="2" />
        <text x="15" y="25" fill="#00ffcc" fontFamily="monospace" fontSize="13" fontWeight="bold">
          WEEKLY GOAL: 100%
        </text>
      </g>
    </svg>
  );
}
