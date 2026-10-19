import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  X,
  UserCheck,
  Send,
  Users,
  CheckCircle2
} from 'lucide-react';
import { WEDDING_DETAILS, RSVPContact } from '../types/invitation.ts';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RSVPModal: React.FC<RSVPModalProps> = ({ isOpen, onClose }) => {
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState('2');
  const [attendingEvents, setAttendingEvents] = useState<string[]>([
    'Mehendi',
    'Cocktail',
    'Main Wedding'
  ]);
  const [selectedContact, setSelectedContact] = useState<RSVPContact>(
    WEDDING_DETAILS.rsvpContacts[0]
  );
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const toggleEvent = (event: string) => {
    if (attendingEvents.includes(event)) {
      setAttendingEvents(attendingEvents.filter((e) => e !== event));
    } else {
      setAttendingEvents([...attendingEvents, event]);
    }
  };

  const handleWhatsAppRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = `91${selectedContact.phone}`;
    const text = `Namaste ${selectedContact.name}! 🙏\n\nWe are delighted to confirm our RSVP for Ishita & Aarnav's Wedding Celebration!\n\n• Guest: ${guestName || 'Family & Friends'}\n• Number of Guests: ${guestCount}\n• Attending: ${attendingEvents.join(', ')}\n${note ? `• Special Note: ${note}\n` : ''}\nHeartiest congratulations and warm wishes to Ishita, Aarnav, and the entire Khokhar family! 🎉`;

    const encodedText = encodeURIComponent(text);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;
    window.open(waUrl, '_blank');
    setSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="RSVP Directory"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      style={{ backgroundColor: 'rgba(10, 6, 8, 0.88)' }}
    >
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-amber-500/30 bg-[#160c10] text-amber-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-amber-500/20 bg-[#1d0e16]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <h2 className="text-base sm:text-lg font-serif-royal font-bold tracking-wider text-amber-200">
              R.S.V.P. & FAMILY CONTACTS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-amber-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Direct Family Contact Cards */}
          <div>
            <h3 className="text-xs uppercase font-serif-royal tracking-widest text-amber-300/80 font-bold mb-2.5">
              Contact Host Directory (Khokhar Family)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {WEDDING_DETAILS.rsvpContacts.map((contact) => (
                <div
                  key={contact.phone}
                  className="p-3 rounded-xl border border-amber-500/20 bg-[#221019] flex flex-col justify-between"
                >
                  <div>
                    <p className="font-serif-royal font-bold text-amber-100 text-sm">
                      {contact.name}
                    </p>
                    <p className="text-[11px] text-amber-400/80 font-medium">
                      {contact.relation}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-amber-500/10">
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex-1 py-1 px-2 rounded bg-amber-600/20 hover:bg-amber-600 text-amber-200 hover:text-stone-950 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                      title="Direct Call"
                    >
                      <Phone className="w-3 h-3" /> Call
                    </a>
                    <a
                      href={`https://wa.me/91${contact.phone}?text=${encodeURIComponent(
                        "Namaste! Delighted to celebrate Ishita & Aarnav's wedding with you! Warmest congratulations! 🙏"
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1 px-2 rounded bg-emerald-600/20 hover:bg-emerald-600 text-emerald-200 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                      title="WhatsApp Chat"
                    >
                      <MessageCircle className="w-3 h-3" /> WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick RSVP Form */}
          <div className="p-4 rounded-xl border border-amber-500/20 bg-[#1e0e17]">
            <h3 className="text-xs uppercase font-serif-royal tracking-widest text-amber-300 font-bold mb-3 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-amber-400" />
              Confirm Your Attendance
            </h3>

            {submitted ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-serif-royal font-bold text-amber-200 text-base">
                  RSVP Sent Successfully!
                </h4>
                <p className="text-xs text-stone-300 max-w-sm mx-auto">
                  Thank you! The Khokhar family warmly looks forward to welcoming you to Ishita & Aarnav's wedding celebrations.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-4 py-1.5 rounded-lg border border-amber-500/40 text-xs font-serif-royal text-amber-300 hover:bg-stone-800"
                >
                  Send another RSVP
                </button>
              </div>
            ) : (
              <form onSubmit={handleWhatsAppRSVP} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-serif-royal text-amber-200/80 mb-1">
                    Your Name / Family Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Rajesh Sharma & Family"
                    className="w-full px-3 py-2 rounded-lg bg-[#14080e] border border-amber-500/30 text-amber-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-serif-royal text-amber-200/80 mb-1">
                      No. of Guests
                    </label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#14080e] border border-amber-500/30 text-amber-100 text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 Persons</option>
                      <option value="3">3 Persons</option>
                      <option value="4">4 Persons</option>
                      <option value="5+">5+ (Family)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-serif-royal text-amber-200/80 mb-1">
                      Send RSVP To
                    </label>
                    <select
                      value={selectedContact.phone}
                      onChange={(e) => {
                        const found = WEDDING_DETAILS.rsvpContacts.find(
                          (c) => c.phone === e.target.value
                        );
                        if (found) setSelectedContact(found);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-[#14080e] border border-amber-500/30 text-amber-100 text-xs focus:outline-none focus:border-amber-400"
                    >
                      {WEDDING_DETAILS.rsvpContacts.map((c) => (
                        <option key={c.phone} value={c.phone}>
                          {c.name} ({c.relation})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-serif-royal text-amber-200/80 mb-1.5">
                    Select Events You Will Attend
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Mehendi', 'Cocktail', 'Main Wedding'].map((evt) => (
                      <button
                        type="button"
                        key={evt}
                        onClick={() => toggleEvent(evt)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                          attendingEvents.includes(evt)
                            ? 'bg-amber-600/30 border-amber-400 text-amber-200 font-semibold'
                            : 'bg-stone-900/60 border-stone-700 text-stone-400'
                        }`}
                      >
                        ✓ {evt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-serif-royal text-amber-200/80 mb-1">
                    Warm Blessings / Notes for Ishita & Aarnav (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write a message of congratulations and joy..."
                    className="w-full px-3 py-2 rounded-lg bg-[#14080e] border border-amber-500/30 text-amber-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-serif-royal font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  Confirm & Send via WhatsApp
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
