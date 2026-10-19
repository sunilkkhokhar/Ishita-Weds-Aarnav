import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Copy,
  Check,
  X,
  Car,
  Clock,
  ExternalLink
} from 'lucide-react';
import { WEDDING_DETAILS } from '../types/invitation.ts';

interface VenueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VenueModal: React.FC<VenueModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${WEDDING_DETAILS.venue.name}, ${WEDDING_DETAILS.venue.address}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenMaps = () => {
    window.open(WEDDING_DETAILS.venue.googleMapsUrl, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Venue & Location Guide"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      style={{ backgroundColor: 'rgba(10, 6, 8, 0.88)' }}
    >
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-amber-500/30 bg-[#160c10] text-amber-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-amber-500/20 bg-[#1d0e16]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <h2 className="text-base sm:text-lg font-serif-royal font-bold tracking-wider text-amber-200">
              WEDDING VENUE & DIRECTIONS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-amber-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Hero Venue Card */}
          <div className="p-5 rounded-xl border border-amber-500/30 bg-gradient-to-b from-[#25101a] to-[#1c0b13] relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Auspicious Venue
                </span>
                <h3 className="font-serif-royal font-bold text-xl sm:text-2xl text-amber-100 mt-2">
                  {WEDDING_DETAILS.venue.name}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
                  {WEDDING_DETAILS.venue.address}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full border border-amber-500/40 bg-amber-950/40 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-amber-400" />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-amber-500/20">
              <button
                onClick={handleOpenMaps}
                className="flex-1 py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-serif-royal font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                Navigate in Google Maps
              </button>
              <button
                onClick={handleCopy}
                className="py-2 px-3 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-amber-200 text-xs font-serif-royal flex items-center gap-1 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Address
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Travel & Driving Guidelines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-amber-500/20 bg-[#200e18]">
              <div className="flex items-center gap-2 mb-1.5 text-amber-300 font-serif-royal font-bold">
                <Car className="w-4 h-4 text-amber-400" />
                <span>By Car / Highway</span>
              </div>
              <p className="text-stone-300 leading-relaxed text-[11px]">
                Situated directly along NH-44 (Grand Trunk Road) at Bahalgarh, Sonipat. Smooth signal-free highway drive from North & West Delhi.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-500/20 bg-[#200e18]">
              <div className="flex items-center gap-2 mb-1.5 text-amber-300 font-serif-royal font-bold">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Arrival Guidelines</span>
              </div>
              <p className="text-stone-300 leading-relaxed text-[11px]">
                Valet parking is available at the grand entryway. We recommend allowing 45–60 mins travel time from Delhi border during evening hours.
              </p>
            </div>
          </div>

          {/* Delhi Shakur Basti Residence */}
          <div className="p-3.5 rounded-xl border border-amber-500/15 bg-[#190a12] text-xs text-stone-300">
            <p className="font-serif-royal font-bold text-amber-200 text-[11px] mb-0.5">
              Host Residence (Sh. Sunil Khokhar & Smt. Mamta Rani):
            </p>
            <p className="text-[11px] text-stone-300">
              {WEDDING_DETAILS.residence}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
