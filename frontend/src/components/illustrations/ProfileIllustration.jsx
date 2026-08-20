// Undraw-style Profile illustration with dark-neon aesthetic
export default function ProfileIllustration({ className = "w-full h-44" }) {
  return (
    <svg
      viewBox="0 0 400 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="20" y="20" width="360" height="200" rx="8" fill="#121212" stroke="#2a2a2a" strokeWidth="2" />
      
      {/* Profile Avatar Frame */}
      <rect x="50" y="60" width="90" height="110" rx="6" fill="#1a1a1a" stroke="#ff0080" strokeWidth="2" />
      <circle cx="95" cy="100" r="24" fill="#00ffcc" stroke="#000" strokeWidth="2" />
      <path d="M75 145 C75 130, 115 130, 115 145" stroke="#f0f0f0" strokeWidth="8" strokeLinecap="round" />

      {/* Metrics Bar lines */}
      <rect x="165" y="70" width="170" height="14" rx="4" fill="#ff0080" />
      <rect x="165" y="95" width="130" height="14" rx="4" fill="#00ffcc" />
      <rect x="165" y="120" width="150" height="14" rx="4" fill="#ffe600" />
      <rect x="165" y="145" width="110" height="14" rx="4" fill="#00ff66" />
    </svg>
  );
}
