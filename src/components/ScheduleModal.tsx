import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Scroll,
  Heart,
  Wine,
  Sun,
  Crown,
  Utensils,
  Moon,
  X,
  ExternalLink
} from 'lucide-react';
import { CELEBRATION_SCHEDULE, WEDDING_DETAILS, WeddingEvent } from '../types/invitation.ts';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVenue: () => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onOpenVenue
}) => {
  if (!isOpen) return null;

  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'Scroll': return <Scroll className="w-4 h-4 text-amber-400" />;
      case 'Heart': return <Heart className="w-4 h-4 text-rose-400" />;
      case 'Wine': return <Wine className="w-4 h-4 text-purple-400" />;
      case 'Sun': return <Sun className="w-4 h-4 text-yellow-400" />;
      case 'Crown': return <Crown className="w-4 h-4 text-red-400" />;
      case 'Utensils': return <Utensils className="w-4 h-4 text-amber-300" />;
      case 'Moon': return <Moon className="w-4 h-4 text-blue-300" />;
      default: return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  const handleAddToCalendar = (event: WeddingEvent) => {
    // Format calendar URL
    let startIso = "20261125T123000Z";
    let endIso = "20261125T183000Z";
    if (event.id === 'mehendi') {
      startIso = "20261123T103000Z";
      endIso = "20261123T163000Z";
    } else if (event.id.includes('lagan') || event.id.includes('ring') || event.id.includes('cocktail')) {
      startIso = "20261124T053000Z";
      endIso = "20261124T183000Z";
    }

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `Ishita & Aarnav Wedding - ${event.title}`
    )}&dates=${startIso}/${endIso}&details=${encodeURIComponent(
      event.description
    )}&location=${encodeURIComponent(WEDDING_DETAILS.venue.name + ', ' + WEDDING_DETAILS.venue.address)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Celebration Itinerary"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      style={{ backgroundColor: 'rgba(10, 6, 8, 0.88)' }}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-amber-500/30 bg-[#160c10] text-amber-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-amber-500/20 bg-[#1d0e16]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <h2 className="text-base sm:text-lg font-serif-royal font-bold tracking-wider text-amber-200">
              WEDDING CELEBRATION ITINERARY
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-amber-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Schedule List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="text-center mb-4">
            <p className="font-hindi text-sm text-amber-300/90 font-bold">
              ॥ मङ्गलम् भगवान विष्णुः मङ्गलम् गरुडध्वजः ॥
            </p>
            <p className="font-serif-royal text-xs text-amber-200/70 mt-1">
              Join us in the sacred festivities across all three auspicious days
            </p>
          </div>

          {CELEBRATION_SCHEDULE.map((event, index) => (
            <div
              key={event.id}
              className="p-4 rounded-xl border border-amber-500/20 bg-[#221019] hover:border-amber-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-[#2e1522] border border-amber-500/20 shrink-0">
                  {getIcon(event.iconName)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif-royal font-bold text-amber-100 text-sm sm:text-base">
                      {event.title}
                    </h3>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 border border-amber-500/30">
                      {event.day}
                    </span>
                  </div>

                  <p className="text-xs text-stone-300 mt-0.5">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-amber-300">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1 text-stone-300">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      {event.date}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleAddToCalendar(event)}
                  className="px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600 text-amber-200 hover:text-stone-950 border border-amber-500/40 text-xs font-serif-royal font-semibold tracking-wide transition-all flex items-center gap-1"
                >
                  <Calendar className="w-3 h-3" /> Add Event
                </button>
              </div>
            </div>
          ))}

          {/* Venue Notice Footer */}
          <div
            onClick={onOpenVenue}
            className="p-3.5 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 to-stone-900/60 flex items-center justify-between cursor-pointer hover:border-amber-400 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-xs font-serif-royal font-bold text-amber-200">
                  All Celebrations Venue: {WEDDING_DETAILS.venue.name}
                </p>
                <p className="text-[11px] text-stone-300">
                  NH-44, Sonipat, Haryana
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-amber-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
