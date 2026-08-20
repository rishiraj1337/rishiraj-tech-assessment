// Undraw-style Empty State Illustration with dark-neon aesthetic
export default function EmptyWorkoutsIllustration({ className = "w-full h-44" }) {
  return (
    <svg
      viewBox="0 0 400 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="20" y="20" width="360" height="200" rx="8" fill="#121212" stroke="#2a2a2a" strokeWidth="2" />
      <circle cx="200" cy="110" r="45" fill="#00ffcc" fillOpacity="0.1" />
      
      {/* Clipboard / Workout Log */}
      <rect x="160" y="55" width="80" height="110" rx="6" fill="#1e1e1e" stroke="#00ffcc" strokeWidth="2" />
      <rect x="185" y="45" width="30" height="15" rx="3" fill="#00ffcc" stroke="#000" strokeWidth="2" />
      
      {/* Checklist items */}
      <line x1="175" y1="80" x2="225" y2="80" stroke="#a0a0a0" strokeWidth="2" strokeLinecap="round" />
      <line x1="175" y1="100" x2="225" y2="100" stroke="#a0a0a0" strokeWidth="2" strokeLinecap="round" />
      <line x1="175" y1="120" x2="215" y2="120" stroke="#ff0080" strokeWidth="2" strokeLinecap="round" />
      <line x1="175" y1="140" x2="205" y2="140" stroke="#00ffcc" strokeWidth="2" strokeLinecap="round" />

      {/* Floating Plus Badge */}
      <circle cx="250" cy="155" r="16" fill="#ff0080" stroke="#000" strokeWidth="2" />
      <path d="M250 147 V163 M242 155 H258" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
