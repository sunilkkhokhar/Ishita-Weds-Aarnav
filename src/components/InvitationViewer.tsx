import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Phone,
  Share2,
  Check,
  Download,
  ExternalLink,
  MessageCircle,
  X
} from 'lucide-react';
import { WEDDING_DETAILS, CELEBRATION_SCHEDULE } from '../types/invitation.ts';
import { BridalCoupleIllustration } from './BridalCoupleIllustration.tsx';

interface InvitationViewerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRSVP: () => void;
  onOpenVenue: () => void;
}

export const InvitationViewer: React.FC<InvitationViewerProps> = ({
  isOpen,
  onClose,
  onOpenRSVP,
  onOpenVenue
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const totalPages = 4;

  const handleShare = () => {
    const shareText = `💍 Wedding Celebration of Ishita & Aarnav\n📅 25th November 2026\n📍 Antilia By Zion, Sonipat, Haryana\n\nYou are cordially invited to celebrate with the Khokhar Family!`;
    if (navigator.share) {
      navigator.share({
        title: "Ishita & Aarnav Wedding Invitation",
        text: shareText,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleAddToCalendar = (title: string, dateStr: string, venue: string) => {
    // Generate Google Calendar Link
    // Date: 20261125T180000 / 20261125T235900
    const startIso = "20261125T123000Z";
    const endIso = "20261125T183000Z";
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${startIso}/${endIso}&details=${encodeURIComponent(
      "Auspicious wedding ceremony celebration of Ishita & Aarnav."
    )}&location=${encodeURIComponent(venue)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Royal Wedding Invitation Card"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      style={{ backgroundColor: 'rgba(10, 6, 8, 0.88)' }}
    >
      {/* Container Card */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-amber-500/30 bg-[#160c10] text-amber-100">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-amber-500/20 bg-[#1a0e14]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <h2 className="text-sm sm:text-base font-serif-royal tracking-widest text-amber-200">
              ROYAL WEDDING INVITATION
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Page indicators */}
            <div className="hidden sm:flex items-center gap-1.5 mr-2">
              {[1, 2, 3, 4].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`text-xs px-2.5 py-1 rounded transition-colors font-serif-royal ${
                    currentPage === page
                      ? 'bg-amber-500 text-stone-950 font-semibold'
                      : 'bg-stone-800/80 text-amber-200/70 hover:bg-stone-700'
                  }`}
                >
                  Page {page}
                </button>
              ))}
            </div>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-stone-800/80 hover:bg-amber-900/40 text-amber-300 transition-colors"
              title="Share Invitation"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-stone-800/80 hover:bg-red-950 text-amber-300 transition-colors"
              title="Close Viewer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card Body - Realistic Luxury Indian Wedding Card with Ornate Gold Foil Borders */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center">
          <div className="w-full max-w-2xl bg-royal-card text-stone-900 rounded-xl p-6 sm:p-10 shadow-2xl relative border-8 border-amber-900/10">
            {/* Intricate Gold Foil Ornamental Inner Border */}
            <div className="absolute inset-2 sm:inset-3 border-2 border-amber-700/40 rounded pointer-events-none" />
            <div className="absolute inset-3 sm:inset-4 border border-amber-600/30 rounded pointer-events-none" />

            {/* Corner Ornamental Motifs */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-700 pointer-events-none" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-700 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-700 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-700 pointer-events-none" />

            {/* ================= PAGE 1: MAIN COVER PAGE ================= */}
            {currentPage === 1 && (
              <div className="py-1 text-center flex flex-col items-center">
                {/* User Prompt: write on top Ishita Weds Aarnav, 25 November 2026, Venue : Antilia By ZION, Sonipat, Haryana */}
                <div className="w-full mb-3 pb-2.5 border-b-2 border-amber-800/30 bg-gradient-to-r from-amber-500/10 via-amber-600/20 to-amber-500/10 rounded-xl p-3 shadow-sm text-center">
                  <h2 className="font-serif-royal font-bold text-xl sm:text-2xl text-amber-950 tracking-wider">
                    Ishita Weds Aarnav
                  </h2>
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-1 text-xs sm:text-sm font-serif-royal font-semibold text-amber-900">
                    <span className="flex items-center gap-1 font-bold text-amber-950">
                      <Calendar className="w-3.5 h-3.5 text-amber-800" />
                      25 November 2026
                    </span>
                    <span className="hidden sm:inline text-amber-700 font-bold">•</span>
                    <button
                      onClick={onOpenVenue}
                      className="flex items-center gap-1 text-amber-950 hover:text-amber-800 underline decoration-amber-700/60 transition-colors"
                      title="View Venue Details"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-800" />
                      <span>Venue : Antilia By ZION, Sonipat, Haryana</span>
                    </button>
                  </div>
                </div>

                {/* Header Crests Row */}
                <div className="w-full flex items-center justify-between mb-2 px-2">
                  {/* Left Ganesha Emblem */}
                  <div className="flex flex-col items-center">
                    <div className="w-11 h-13 border border-amber-700/30 rounded-lg flex items-center justify-center bg-amber-50/80 p-1 shadow-sm">
                      <svg viewBox="0 0 64 64" className="w-9 h-9 text-amber-800 fill-current">
                        <path d="M32 4 C34 4 36 6 36 9 C36 11 34 13 32 13 C30 13 28 11 28 9 C28 6 30 4 32 4 Z M26 14 C30 13 34 13 38 14 C44 15 48 18 48 24 C48 30 42 34 38 35 C38 37 39 39 40 42 C41 45 40 48 37 51 C34 54 29 55 25 53 C22 51 20 47 21 43 C22 39 25 36 28 35 C23 34 16 30 16 23 C16 17 21 14 26 14 Z M32 18 C26 18 22 21 22 25 C22 29 26 31 32 31 C38 31 42 29 42 25 C42 21 38 18 32 18 Z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-hindi tracking-widest text-amber-900 mt-0.5 font-bold">॥ ॐ श्री गणेशाय नमः ॥</span>
                  </div>

                  {/* Monogram Crest "I & A" */}
                  <div className="w-13 h-13 rounded-full border-2 border-amber-700/60 flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200/50 shadow-inner p-2.5">
                    <div className="text-center font-serif-royal font-bold text-amber-900 text-sm tracking-wider">
                      I <span className="text-red-700 text-xs">♥</span> A
                    </div>
                  </div>
                </div>

                {/* Wedding Invitation Title */}
                <h3 className="font-script text-3xl sm:text-4xl text-stone-900 mb-0.5">
                  Wedding Invitation
                </h3>

                {/* User Request: One bridal couple paste on front cover */}
                <div className="my-1.5 transition-transform duration-300 hover:scale-105">
                  <BridalCoupleIllustration className="w-44 h-44 sm:w-52 sm:h-52" />
                </div>

                {/* Couple Names */}
                <div className="my-1">
                  <h1 className="font-script text-4xl sm:text-5xl text-amber-950 font-bold tracking-wide">
                    Ishita
                  </h1>
                  <p className="font-script text-xl sm:text-2xl text-amber-800 my-0.5">
                    Weds
                  </p>
                  <h1 className="font-script text-4xl sm:text-5xl text-amber-950 font-bold tracking-wide">
                    Aarnav
                  </h1>
                </div>

                {/* Floral Filigree Divider */}
                <div className="my-1 flex items-center justify-center text-amber-800">
                  <span className="text-base">❦ ❈ ❦</span>
                </div>

                {/* Host Info & Shakur Basti Residence */}
                <div className="mt-1 pt-2 border-t border-amber-800/20 text-center font-body-royal w-full">
                  <p className="text-[11px] uppercase tracking-widest text-amber-900 font-semibold mb-0.5">
                    A Cordial Invitation From:
                  </p>
                  <p className="text-base font-bold text-stone-950 font-serif-royal">
                    {WEDDING_DETAILS.hosts}
                  </p>
                  <p className="text-xs text-stone-700 mt-0.5 max-w-md mx-auto">
                    {WEDDING_DETAILS.residence}
                  </p>
                  <p className="text-xs font-semibold text-amber-950 mt-0.5 tracking-wide">
                    M.: 9818560884, 9868157686, 9773713944
                  </p>
                </div>
              </div>
            )}

            {/* ================= PAGE 2: PRE-WEDDING CELEBRATIONS ================= */}
            {currentPage === 2 && (
              <div className="py-2 text-center flex flex-col items-center">
                {/* Ganesha Invocation */}
                <div className="mb-4">
                  <div className="w-10 h-10 mx-auto text-amber-800">
                    <svg viewBox="0 0 64 64" className="w-full h-full fill-current">
                      <path d="M32 4 C34 4 36 6 36 9 C36 11 34 13 32 13 C30 13 28 11 28 9 C28 6 30 4 32 4 Z M26 14 C30 13 34 13 38 14 C44 15 48 18 48 24 C48 30 42 34 38 35 C38 37 39 39 40 42 C41 45 40 48 37 51 C34 54 29 55 25 53 C22 51 20 47 21 43 C22 39 25 36 28 35 C23 34 16 30 16 23 C16 17 21 14 26 14 Z" />
                    </svg>
                  </div>
                  <p className="font-hindi text-sm tracking-widest text-amber-950 font-bold mt-1">
                    ॥ ॐ श्री गणेशाय नमः ॥
                  </p>
                </div>

                <p className="font-serif-royal text-base sm:text-lg text-stone-800">
                  You are cordially invited to
                </p>
                <h3 className="font-script text-3xl sm:text-4xl text-amber-950 font-bold my-1">
                  Mehendi & Cocktail
                </h3>

                {/* Day 1: Monday, 23rd November 2026 */}
                <div className="w-full max-w-lg my-4 p-4 rounded-lg bg-amber-500/10 border border-amber-600/30 text-left">
                  <div className="flex items-center justify-between border-b border-amber-800/20 pb-1 mb-2">
                    <h4 className="font-serif-royal font-bold text-amber-950 text-sm sm:text-base">
                      On Monday, 23rd November, 2026
                    </h4>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                      Day 1
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm text-stone-900 font-body-royal font-medium">
                    <span className="font-semibold text-stone-950">Mehendi</span>
                    <span className="border-b border-dotted border-stone-400 flex-1 mx-2" />
                    <span className="font-bold text-amber-900">4:00 PM Onwards</span>
                  </div>
                </div>

                {/* Day 2: Tuesday, 24th November 2026 */}
                <div className="w-full max-w-lg mb-4 p-4 rounded-lg bg-amber-500/10 border border-amber-600/30 text-left">
                  <div className="flex items-center justify-between border-b border-amber-800/20 pb-1 mb-2">
                    <h4 className="font-serif-royal font-bold text-amber-950 text-sm sm:text-base">
                      On Tuesday, 24th November, 2026
                    </h4>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                      Day 2
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs sm:text-sm text-stone-900 font-body-royal">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-950">Lagan Tika</span>
                      <span className="border-b border-dotted border-stone-400 flex-1 mx-2" />
                      <span className="font-bold text-amber-900">11:00 AM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-950">God Bharai / Ring Ceremony</span>
                      <span className="border-b border-dotted border-stone-400 flex-1 mx-2" />
                      <span className="font-bold text-amber-900">12:00 Noon</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-950">Cocktail</span>
                      <span className="border-b border-dotted border-stone-400 flex-1 mx-2" />
                      <span className="font-bold text-amber-900">7:00 PM</span>
                    </div>
                  </div>
                </div>

                {/* Venue Box */}
                <div
                  onClick={onOpenVenue}
                  className="w-full max-w-lg p-4 rounded-xl border-2 border-amber-700/50 bg-gradient-to-b from-amber-50 to-amber-100/60 shadow-sm cursor-pointer hover:border-amber-700 transition-colors"
                >
                  <p className="font-serif-royal text-xs uppercase tracking-widest text-amber-900 font-bold mb-1">
                    Venue
                  </p>
                  <h4 className="font-serif-royal text-lg sm:text-xl font-bold text-stone-950 tracking-wider">
                    {WEDDING_DETAILS.venue.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-700 mt-1 leading-snug">
                    {WEDDING_DETAILS.venue.address}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 underline">
                    <MapPin className="w-3.5 h-3.5" /> Tap for Google Maps Navigation
                  </div>
                </div>

                {/* Intertwined Wedding Rings Motif */}
                <div className="mt-4 flex items-center justify-center gap-2 text-amber-800">
                  <div className="w-7 h-7 rounded-full border-2 border-amber-700 relative flex items-center justify-center">
                    <span className="text-[10px]">💎</span>
                  </div>
                  <div className="w-7 h-7 rounded-full border-2 border-amber-700 -ml-3" />
                </div>
              </div>
            )}

            {/* ================= PAGE 3: MAIN WEDDING DAY ================= */}
            {currentPage === 3 && (
              <div className="py-2 text-center flex flex-col items-center">
                {/* Traditional Sanskrit Shlokas & Kalash */}
                <div className="w-full flex items-center justify-between mb-2">
                  <span className="text-2xl text-amber-800">🪔</span>
                  <div className="text-center font-hindi text-amber-950">
                    <p className="text-xs sm:text-sm font-bold tracking-wider">
                      ॥ ॐ श्री गणेशाय नमः ॥
                    </p>
                    <p className="text-[11px] sm:text-xs text-amber-900 mt-0.5 leading-relaxed font-semibold">
                      वक्रतुण्ड महाकाय, सूर्यकोटि समप्रभः।<br />
                      निर्विघ्नं कुरु मे देव, सर्वकार्येषु सर्वदा ॥
                    </p>
                  </div>
                  <span className="text-2xl text-amber-800">🪔</span>
                </div>

                <div className="my-2 text-stone-800 font-serif-royal">
                  <p className="text-base sm:text-lg font-bold text-stone-950">
                    {WEDDING_DETAILS.hosts}
                  </p>
                  <p className="text-xs sm:text-sm text-stone-700 max-w-lg mx-auto mt-1 leading-relaxed">
                    Will be honoured by your gracious presence on the auspicious occasion
                    of the Wedding Ceremony of their beloved daughter
                  </p>
                </div>

                {/* Bride & Groom Lineage */}
                <div className="my-2 w-full">
                  <h2 className="font-script text-4xl sm:text-5xl text-amber-950 font-bold">
                    Ishita
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-700 font-body-royal italic">
                    (Grand D/o Late Smt. Jai Devi & Late Sh. Raghubir Singh Khokhar)
                  </p>
                  
                  <p className="font-script text-2xl text-amber-800 my-0.5">With</p>

                  <h2 className="font-script text-4xl sm:text-5xl text-amber-950 font-bold">
                    Aarnav
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-700 font-body-royal italic">
                    (S/o Smt. Rachna Gupta & Sh. Anil Gupta)
                  </p>
                </div>

                {/* Wedding Day Events Schedule */}
                <div className="w-full max-w-lg my-3 p-3.5 rounded-lg bg-amber-500/10 border border-amber-600/30 text-left font-body-royal">
                  <h4 className="font-serif-royal font-bold text-amber-950 text-sm sm:text-base border-b border-amber-800/20 pb-1 mb-2 text-center">
                    On Wednesday, 25th November, 2026
                  </h4>
                  <div className="space-y-1.5 text-xs sm:text-sm text-stone-900">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-950">Haldi</span>
                      <span className="border-b border-dotted border-stone-400 flex-1 mx-2" />
                      <span className="font-bold text-amber-900">10:00 AM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-950">Reception of Barat</span>
                      <span className="border-b border-dotted border-stone-400 flex-1 mx-2" />
                      <span className="font-bold text-amber-900">6:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-950">Dinner</span>
                      <span className="border-b border-dotted border-stone-400 flex-1 mx-2" />
                      <span className="font-bold text-amber-900">8:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-950">Doli</span>
                      <span className="border-b border-dotted border-stone-400 flex-1 mx-2" />
                      <span className="font-bold text-amber-900">Taaron Ki Chhaon Mein</span>
                    </div>
                  </div>
                </div>

                {/* Venue Details */}
                <div
                  onClick={onOpenVenue}
                  className="w-full max-w-lg p-3 rounded-lg border border-amber-700/40 bg-amber-50 cursor-pointer hover:border-amber-700"
                >
                  <p className="font-serif-royal text-[11px] uppercase tracking-widest text-amber-900 font-bold">
                    Venue
                  </p>
                  <p className="font-serif-royal text-base font-bold text-stone-950">
                    {WEDDING_DETAILS.venue.name}
                  </p>
                  <p className="text-xs text-stone-700">
                    {WEDDING_DETAILS.venue.address}
                  </p>
                </div>
              </div>
            )}

            {/* ================= PAGE 4: SPECIAL NOTE & RSVP ================= */}
            {currentPage === 4 && (
              <div className="py-2 text-center flex flex-col items-center">
                {/* Invocation Shloka & Ganesha */}
                <div className="mb-3">
                  <div className="w-10 h-10 mx-auto text-amber-800">
                    <svg viewBox="0 0 64 64" className="w-full h-full fill-current">
                      <path d="M32 4 C34 4 36 6 36 9 C36 11 34 13 32 13 C30 13 28 11 28 9 C28 6 30 4 32 4 Z M26 14 C30 13 34 13 38 14 C44 15 48 18 48 24 C48 30 42 34 38 35 C38 37 39 39 40 42 C41 45 40 48 37 51 C34 54 29 55 25 53 C22 51 20 47 21 43 C22 39 25 36 28 35 C23 34 16 30 16 23 C16 17 21 14 26 14 Z" />
                    </svg>
                  </div>
                  <p className="font-hindi text-xs sm:text-sm text-amber-950 font-bold max-w-md mx-auto mt-1 leading-snug">
                    {WEDDING_DETAILS.shlokas.vakratundaSingle}
                  </p>
                </div>

                {/* Nephew's Heartfelt Message */}
                <div className="w-full max-w-lg my-3 p-5 rounded-xl bg-gradient-to-b from-amber-100/70 to-amber-200/40 border border-amber-600/40 shadow-inner">
                  <p className="font-serif-royal font-bold text-amber-950 text-base sm:text-lg mb-1">
                    {WEDDING_DETAILS.nephewNote.salutation}
                  </p>
                  <p className="font-script text-2xl sm:text-3xl text-amber-900 font-bold my-1">
                    {WEDDING_DETAILS.nephewNote.highlight}
                  </p>
                  <p className="text-xs sm:text-sm text-stone-800 font-medium my-0.5">
                    {WEDDING_DETAILS.nephewNote.invitation}
                  </p>
                  <p className="text-xs sm:text-sm text-stone-800 font-medium">
                    {WEDDING_DETAILS.nephewNote.cheer}
                  </p>
                  <p className="font-script text-2xl sm:text-3xl text-amber-950 font-bold mt-2">
                    {WEDDING_DETAILS.nephewNote.signature}
                  </p>
                </div>

                {/* RSVP and Warmly Invited Columns */}
                <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 text-left font-body-royal">
                  {/* RSVP Column */}
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-600/30">
                    <h4 className="font-serif-royal font-bold text-amber-950 text-sm mb-1.5 flex items-center justify-between">
                      <span>R.S.V.P.:</span>
                      <Phone className="w-3.5 h-3.5 text-amber-800" />
                    </h4>
                    <div className="space-y-1 text-xs text-stone-800 font-medium">
                      {WEDDING_DETAILS.rsvpContacts.map((contact) => (
                        <div key={contact.phone} className="flex items-center justify-between">
                          <span className="font-semibold text-stone-950">{contact.name.split(' ')[0]}</span>
                          <a
                            href={`tel:${contact.phone}`}
                            className="text-amber-900 hover:text-amber-700 underline font-semibold"
                          >
                            {contact.displayPhone}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Warmly Invited By */}
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-600/30">
                    <h4 className="font-serif-royal font-bold text-amber-950 text-sm mb-1.5">
                      Warmly Invited By:
                    </h4>
                    <p className="text-sm font-serif-royal font-semibold text-stone-900">
                      Khokhar Family
                    </p>
                    <p className="text-xs text-stone-700 mt-1 italic">
                      All Nears & Dears
                    </p>
                  </div>
                </div>

                {/* Quick RSVP CTA button */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={onOpenRSVP}
                    className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-stone-950 font-serif-royal font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" /> RSVP on WhatsApp / Call
                  </button>
                  <button
                    onClick={() => handleAddToCalendar("Ishita & Aarnav Wedding", "2026-11-25", WEDDING_DETAILS.venue.name)}
                    className="px-5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-200 font-serif-royal text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Calendar className="w-4 h-4" /> Add to Calendar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Pagination & Navigation Controls */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-amber-500/20 bg-[#1a0e14]">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3.5 py-1.5 rounded-lg border border-amber-500/30 bg-stone-800/80 hover:bg-amber-900/40 text-amber-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1 text-xs font-serif-royal"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <span className="text-xs font-serif-royal text-amber-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3.5 py-1.5 rounded-lg border border-amber-500/30 bg-stone-800/80 hover:bg-amber-900/40 text-amber-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1 text-xs font-serif-royal"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
