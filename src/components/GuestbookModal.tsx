import React, { useState, useEffect } from 'react';
import {
  Heart,
  Send,
  Sparkles,
  X,
  MessageCircle,
  ThumbsUp
} from 'lucide-react';
import { GuestBlessing } from '../types/invitation.ts';

interface GuestbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlessingSubmitted: () => void;
}

const INITIAL_BLESSINGS: GuestBlessing[] = [
  {
    id: '1',
    name: 'Drishyey',
    relation: 'Nephew',
    message: "Kia Ora Maasi Ishita & Aarnav Uncle! So excited for the wedding! We're gonna dance all night and eat all the yummiest sweets! Love you both lots! ❤️",
    timestamp: Date.now() - 3600000 * 24,
    likes: 18
  },
  {
    id: '2',
    name: 'Khokhar Parivaar',
    relation: 'Family',
    message: 'May Lord Ganesha shower Ishita and Aarnav with eternal happiness, abundance, love, and harmonious companionship throughout their life journey! 🪔✨',
    timestamp: Date.now() - 3600000 * 48,
    likes: 24
  },
  {
    id: '3',
    name: 'Gupta Family',
    relation: 'Family',
    message: 'Heartiest congratulations to our dearest Aarnav and our beloved daughter-in-law Ishita! Welcome to the family with open arms and full hearts.',
    timestamp: Date.now() - 3600000 * 72,
    likes: 19
  }
];

export const GuestbookModal: React.FC<GuestbookModalProps> = ({
  isOpen,
  onClose,
  onBlessingSubmitted
}) => {
  const [blessings, setBlessings] = useState<GuestBlessing[]>(() => {
    try {
      const saved = localStorage.getItem('ishita_aarnav_blessings');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_BLESSINGS;
  });

  const [authorName, setAuthorName] = useState('');
  const [relation, setRelation] = useState('Family / Relative');
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('ishita_aarnav_blessings', JSON.stringify(blessings));
    } catch {
      // fallback
    }
  }, [blessings]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) return;

    const newBlessing: GuestBlessing = {
      id: Date.now().toString(),
      name: authorName.trim(),
      relation,
      message: message.trim(),
      timestamp: Date.now(),
      likes: 1
    };

    setBlessings([newBlessing, ...blessings]);
    setAuthorName('');
    setMessage('');
    onBlessingSubmitted();
  };

  const handleLike = (id: string) => {
    setBlessings(
      blessings.map((b) => (b.id === id ? { ...b, likes: b.likes + 1 } : b))
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Digital Guestbook & Blessings"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      style={{ backgroundColor: 'rgba(10, 6, 8, 0.88)' }}
    >
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-amber-500/30 bg-[#160c10] text-amber-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-amber-500/20 bg-[#1d0e16]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <h2 className="text-base sm:text-lg font-serif-royal font-bold tracking-wider text-amber-200">
              BLESSINGS FOR ISHITA & AARNAV
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-amber-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Post a Blessing Form */}
          <form onSubmit={handleSubmit} className="p-4 rounded-xl border border-amber-500/25 bg-[#200e18] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif-royal uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Send Warm Blessings
              </span>
              <span className="text-[11px] text-amber-400/80 italic">Shower flowers upon submitting</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your Name (e.g. Meenakshi & Ramesh)"
                className="px-3 py-2 rounded-lg bg-[#14080e] border border-amber-500/30 text-amber-100 text-xs focus:outline-none focus:border-amber-400"
              />
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#14080e] border border-amber-500/30 text-amber-100 text-xs focus:outline-none focus:border-amber-400"
              >
                <option value="Family / Relative">Family / Relative</option>
                <option value="Friend of Ishita">Friend of Ishita</option>
                <option value="Friend of Aarnav">Friend of Aarnav</option>
                <option value="Colleague / Associate">Colleague / Associate</option>
                <option value="Well-wisher">Well-wisher</option>
              </select>
            </div>

            <textarea
              required
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your wishes, blessings, or loving message for the couple..."
              className="w-full px-3 py-2 rounded-lg bg-[#14080e] border border-amber-500/30 text-amber-100 text-xs focus:outline-none focus:border-amber-400"
            />

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-serif-royal font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all"
            >
              <Heart className="w-3.5 h-3.5 text-rose-950 fill-rose-950" /> Send Blessing & Shower Petals
            </button>
          </form>

          {/* Blessings Feed */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-serif-royal tracking-widest text-amber-300/80 font-bold">
              Recent Blessings ({blessings.length})
            </h3>

            {blessings.map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-xl border border-amber-500/15 bg-[#1b0c14] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-serif-royal font-bold text-amber-100 text-xs sm:text-sm">
                      {b.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/20">
                      {b.relation}
                    </span>
                  </div>
                  <button
                    onClick={() => handleLike(b.id)}
                    className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-100 transition-colors"
                  >
                    <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                    <span>{b.likes}</span>
                  </button>
                </div>

                <p className="text-xs text-stone-300 font-body-royal italic leading-relaxed">
                  "{b.message}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
