import React from 'react';

interface BridalCoupleProps {
  className?: string;
}

export const BridalCoupleIllustration: React.FC<BridalCoupleProps> = ({ className = "w-44 h-44 sm:w-52 sm:h-52" }) => {
  return (
    <div className={`relative flex items-center justify-center mx-auto ${className}`}>
      {/* Outer Ornate Gold Foil Mandala Wreath */}
      <svg
        viewBox="0 0 320 320"
        className="w-full h-full drop-shadow-md select-none"
        aria-label="Royal Indian Wedding Couple: Ishita & Aarnav"
      >
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="35%" stopColor="#d4af37" />
            <stop offset="70%" stopColor="#996515" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>

          <linearGradient id="crimsonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#881337" />
            <stop offset="50%" stopColor="#be123c" />
            <stop offset="100%" stopColor="#4c0519" />
          </linearGradient>

          <linearGradient id="ivorySherwani" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="70%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>

          <radialGradient id="haloGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
          </radialGradient>

          <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#451a03" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Ambient Warm Golden Halo Glow */}
        <circle cx="160" cy="160" r="148" fill="url(#haloGlow)" />

        {/* Ornate Circular Frame */}
        <circle
          cx="160"
          cy="160"
          r="140"
          fill="#fffdfa"
          stroke="url(#goldGrad)"
          strokeWidth="3.5"
          filter="url(#shadowFilter)"
        />

        {/* Inner Dotted Decorative Ring */}
        <circle
          cx="160"
          cy="160"
          r="133"
          fill="none"
          stroke="#b45309"
          strokeWidth="1.2"
          strokeDasharray="3 3"
        />

        {/* Intricate Floral Archway Top */}
        <path
          d="M 60,160 C 60,85 260,85 260,160"
          fill="none"
          stroke="url(#goldGrad)"
          strokeWidth="2.5"
        />

        {/* Arch Hanging Floral Bells */}
        {[85, 120, 160, 200, 235].map((x, i) => (
          <g key={i}>
            <circle cx={x} cy="100" r="3" fill="#d97706" />
            <path d={`M ${x-3},106 Q ${x},113 ${x+3},106 Z`} fill="url(#goldGrad)" />
          </g>
        ))}

        {/* ================= GROOM (AARNAV) - RIGHT SIDE ================= */}
        <g id="groom">
          {/* Sherwani Body */}
          <path
            d="M 162,175 L 180,148 L 218,154 L 232,192 L 222,275 L 172,275 Z"
            fill="url(#ivorySherwani)"
            stroke="#b45309"
            strokeWidth="1.5"
          />

          {/* Royal Embroidered Collar & Stole (Dupatta/Doshala) */}
          <path
            d="M 188,148 C 196,170 205,200 216,270 L 226,270 C 218,195 204,165 198,148 Z"
            fill="url(#crimsonGrad)"
            stroke="url(#goldGrad)"
            strokeWidth="1.2"
          />

          {/* Groom Neck & Face */}
          <path
            d="M 188,148 L 188,138 C 188,135 195,135 195,138 L 195,148 Z"
            fill="#fed7aa"
          />
          {/* Groom Profile / Face */}
          <ellipse cx="193" cy="126" rx="14" ry="17" fill="#fed7aa" />

          {/* Groom Royal Safa / Pagri Turban with Zari Folds */}
          <path
            d="M 178,124 C 176,104 208,98 214,116 C 216,122 210,132 188,132 Z"
            fill="url(#crimsonGrad)"
            stroke="url(#goldGrad)"
            strokeWidth="1.5"
          />
          <path
            d="M 182,118 Q 196,108 210,118"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="1.5"
          />
          {/* Royal Kalash / Kalgi Jewel & Feather */}
          <path
            d="M 184,114 Q 180,95 186,85 Q 190,98 188,114 Z"
            fill="url(#goldGrad)"
          />
          <circle cx="186" cy="115" r="2.5" fill="#ef4444" />
        </g>

        {/* ================= BRIDE (ISHITA) - LEFT SIDE ================= */}
        <g id="bride">
          {/* Bridal Red Embroidered Lehenga */}
          <path
            d="M 100,275 L 118,185 L 158,180 L 168,275 Z"
            fill="url(#crimsonGrad)"
            stroke="#991b1b"
            strokeWidth="1.5"
          />
          {/* Golden Zari Borders on Lehenga Bottom */}
          <path
            d="M 98,266 Q 133,260 169,266 L 169,275 Q 133,270 98,275 Z"
            fill="url(#goldGrad)"
          />

          {/* Bridal Blouse / Choli */}
          <path
            d="M 118,155 L 155,152 L 158,186 L 122,188 Z"
            fill="url(#crimsonGrad)"
          />

          {/* Bridal Dupatta Drape with Gold Foil Border */}
          <path
            d="M 112,142 C 100,165 92,205 96,275 L 106,275 C 104,210 110,175 120,148 Z"
            fill="url(#crimsonGrad)"
            stroke="url(#goldGrad)"
            strokeWidth="1.2"
          />

          {/* Bride Face & Neck */}
          <ellipse cx="140" cy="130" rx="13" ry="16" fill="#fde68a" />

          {/* Sheer Bridal Veil / Odhni covering head with gold fringe */}
          <path
            d="M 124,136 C 122,112 152,106 156,128 C 158,136 152,142 144,144"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="2"
          />
          <path
            d="M 126,134 C 122,118 148,112 154,126"
            fill="url(#crimsonGrad)"
            opacity="0.85"
          />

          {/* Maang Tikka Jewelry */}
          <path d="M 141,116 L 141,123" stroke="url(#goldGrad)" strokeWidth="1.2" />
          <circle cx="141" cy="124" r="2" fill="#ef4444" />

          {/* Traditional Nath (Nose Ring) */}
          <circle cx="146" cy="132" r="2.2" fill="none" stroke="url(#goldGrad)" strokeWidth="0.8" />

          {/* Red Wedding Chooda Bangles */}
          <rect x="150" y="190" width="10" height="5" rx="2" fill="#dc2626" stroke="url(#goldGrad)" strokeWidth="0.8" />
        </g>

        {/* ================= VARMALA (EXCHANGED FLORAL GARLANDS) ================= */}
        <g id="varmalas">
          {/* Marigold and Rose Petal Varmala hanging between bride and groom */}
          <path
            d="M 132,154 Q 160,205 186,155"
            fill="none"
            stroke="#ea580c"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 132,154 Q 160,205 186,155"
            fill="none"
            stroke="#fde047"
            strokeWidth="3"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />
          <path
            d="M 140,158 Q 162,225 194,162"
            fill="none"
            stroke="#be123c"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 140,158 Q 162,225 194,162"
            fill="none"
            stroke="#fef08a"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
        </g>

        {/* Base Lotus Dais & Traditional Diya */}
        <path
          d="M 80,275 Q 160,265 240,275 L 246,285 Q 160,276 74,285 Z"
          fill="url(#goldGrad)"
          stroke="#b45309"
          strokeWidth="1.2"
        />

        {/* Decorative Lotus Petals along base */}
        {[100, 130, 160, 190, 220].map((x, i) => (
          <path
            key={i}
            d={`M ${x-10},280 Q ${x},272 ${x+10},280 Q ${x},286 ${x-10},280 Z`}
            fill="#dc2626"
            stroke="url(#goldGrad)"
            strokeWidth="0.8"
          />
        ))}

        {/* Sacred Auspicious Swastik / Shubh Emblem Bottom */}
        <circle cx="160" cy="295" r="10" fill="url(#goldGrad)" />
        <text
          x="160"
          y="298"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="10"
          fontFamily="serif"
          fontWeight="bold"
          fill="#78350f"
        >
          卐
        </text>
      </svg>
    </div>
  );
};
