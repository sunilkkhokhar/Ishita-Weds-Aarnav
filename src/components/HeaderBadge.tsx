import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Heart } from 'lucide-react';
import { WEDDING_DETAILS } from '../types/invitation.ts';

interface HeaderBadgeProps {
  onOpenInvitation: () => void;
  onOpenSchedule: () => void;
  onOpenVenue?: () => void;
}

export const HeaderBadge: React.FC<HeaderBadgeProps> = ({
  onOpenInvitation,
  onOpenSchedule,
  onOpenVenue
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const weddingTimestamp = new Date(WEDDING_DETAILS.weddingDate).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, weddingTimestamp - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto max-w-[96vw] w-max select-none">
      <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-2xl sm:rounded-full border border-amber-500/35 bg-[#160a10]/95 shadow-2xl text-amber-100 backdrop-blur-none">
        
        {/* Main Title Banner: Ishita Weds Aarnav */}
        <button
          onClick={onOpenInvitation}
          className="flex items-center gap-2 group cursor-pointer text-left"
          title="Open Royal Invitation Card"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-amber-400/60 bg-gradient-to-br from-amber-400/20 to-amber-600/30 flex items-center justify-center font-serif-royal text-xs font-bold text-amber-200 shrink-0">
            I <span className="text-rose-400 text-[10px]">♥</span> A
          </div>
          <div className="flex flex-col">
            <span className="font-serif-royal font-bold text-xs sm:text-sm text-amber-100 group-hover:text-amber-300 transition-colors tracking-wide">
              Ishita Weds Aarnav
            </span>
            <span className="text-[10px] sm:text-[11px] font-serif-royal text-amber-300/90 font-medium">
              25 November 2026
            </span>
          </div>
        </button>

        <span className="hidden sm:block w-px h-5 bg-amber-500/30" />

        {/* Venue Tag: Venue : Antilia By ZION, Sonipat, Haryana */}
        <button
          onClick={onOpenVenue || onOpenInvitation}
          className="flex items-center gap-1 text-[10px] sm:text-xs font-serif-royal text-amber-200/90 hover:text-amber-100 transition-colors px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/20 text-center"
          title="Venue Information & Navigation"
        >
          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="font-semibold text-amber-300">Venue :</span>
          <span>Antilia By ZION, Sonipat, Haryana</span>
        </button>

        <span className="hidden md:block w-px h-5 bg-amber-500/30" />

        {/* Live Countdown Badge */}
        <div
          onClick={onOpenSchedule}
          className="cursor-pointer hidden md:flex items-center gap-1.5 text-[11px] font-serif-royal font-semibold text-amber-300 hover:text-amber-100 transition-colors px-2 py-0.5 rounded bg-stone-900/60 border border-amber-500/20"
          title="View Full Schedule"
        >
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </span>
        </div>
      </div>
    </header>
  );
};
