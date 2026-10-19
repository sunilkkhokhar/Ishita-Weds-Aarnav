import React, { useState } from 'react';
import {
  Camera,
  Sun,
  Sparkles,
  Volume2,
  VolumeX,
  FileText,
  Calendar,
  MapPin,
  Heart,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from 'lucide-react';
import { CameraPreset, LightingAmbiance } from '../three/MandapScene.ts';

interface ControlDockProps {
  cameraPreset: CameraPreset;
  onSelectCamera: (preset: CameraPreset) => void;
  ambiance: LightingAmbiance;
  onSelectAmbiance: (ambiance: LightingAmbiance) => void;
  onTriggerFlowerShower: () => void;
  isPlayingAudio: boolean;
  onToggleAudio: () => void;
  onOpenInvitation: () => void;
  onOpenSchedule: () => void;
  onOpenRSVP: () => void;
  onOpenVenue: () => void;
  onOpenGuestbook: () => void;
}

export const ControlDock: React.FC<ControlDockProps> = ({
  cameraPreset,
  onSelectCamera,
  ambiance,
  onSelectAmbiance,
  onTriggerFlowerShower,
  isPlayingAudio,
  onToggleAudio,
  onOpenInvitation,
  onOpenSchedule,
  onOpenRSVP,
  onOpenVenue,
  onOpenGuestbook
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'camera' | 'lighting' | 'explore'>('camera');

  const cameraOptions: { id: CameraPreset; label: string }[] = [
    { id: 'front', label: 'Mandap' },
    { id: 'havan', label: 'Havan Fire' },
    { id: 'thrones', label: 'Thrones' },
    { id: 'orbit', label: 'Orbit 360°' }
  ];

  const ambianceOptions: { id: LightingAmbiance; label: string; icon: string }[] = [
    { id: 'evening', label: 'Royal Evening', icon: '🏮' },
    { id: 'sunset', label: 'Godhuli Sunset', icon: '🌅' },
    { id: 'midnight', label: 'Taaron Ki Chhaon', icon: '✨' }
  ];

  return (
    <div
      className="fixed z-30 transition-transform duration-300 ease-in-out pointer-events-auto"
      style={{
        bottom: '16px',
        left: '50%',
        transform: `translateX(-50%) translateY(${isCollapsed ? 'calc(100% - 32px)' : '0px'})`,
        maxWidth: 'min(920px, 95vw)',
        width: '100%'
      }}
    >
      {/* Collapse / Expand Tab attached to top of dock */}
      <div className="flex justify-center mb-1">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="px-3.5 py-1 text-[11px] font-serif-royal font-semibold tracking-wider rounded-t-lg bg-[#200e16] border-t border-x border-amber-500/30 text-amber-200/90 hover:text-amber-100 flex items-center gap-1 shadow-md transition-colors"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-amber-400" /> Show Controls
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-amber-400" /> Hide Controls (Zen View)
            </>
          )}
        </button>
      </div>

      {/* Main Solid Dock Surface (No backdrop-filter per Three.js skill rules) */}
      <div className="rounded-xl border border-amber-500/30 bg-[#180a11] shadow-2xl p-2.5 sm:p-3 text-amber-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
          
          {/* Left: Quick Action Nav Pills (Invitation, Events, RSVP, Blessings) */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <button
              onClick={onOpenInvitation}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-serif-royal font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Card</span>
            </button>

            <button
              onClick={onOpenSchedule}
              className="px-2.5 py-1.5 rounded-lg bg-[#2b121d] hover:bg-[#3a1a28] border border-amber-500/20 text-amber-200 font-serif-royal text-xs flex items-center gap-1.5 transition-all"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xs:inline">Itinerary</span>
            </button>

            <button
              onClick={onOpenRSVP}
              className="px-2.5 py-1.5 rounded-lg bg-[#2b121d] hover:bg-[#3a1a28] border border-amber-500/20 text-amber-200 font-serif-royal text-xs flex items-center gap-1.5 transition-all"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>RSVP</span>
            </button>

            <button
              onClick={onOpenVenue}
              className="px-2.5 py-1.5 rounded-lg bg-[#2b121d] hover:bg-[#3a1a28] border border-amber-500/20 text-amber-200 font-serif-royal text-xs flex items-center gap-1.5 transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Venue</span>
            </button>

            <button
              onClick={onOpenGuestbook}
              className="px-2.5 py-1.5 rounded-lg bg-[#2b121d] hover:bg-[#3a1a28] border border-amber-500/20 text-amber-200 font-serif-royal text-xs flex items-center gap-1.5 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Blessings</span>
            </button>
          </div>

          {/* Center: 3D Camera & Lighting Control Group */}
          <div className="flex items-center gap-1 bg-[#240e18] p-1 rounded-lg border border-amber-500/20">
            {/* Camera Presets */}
            {cameraOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onSelectCamera(opt.id)}
                className={`px-2 py-1 rounded text-[11px] font-serif-royal tracking-wide transition-all ${
                  cameraPreset === opt.id
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'text-amber-200/70 hover:text-amber-100 hover:bg-stone-800/40'
                }`}
              >
                {opt.label}
              </button>
            ))}

            <span className="w-px h-4 bg-amber-500/30 mx-0.5" />

            {/* Lighting Ambiance Dropdown/Toggle */}
            <div className="flex items-center gap-0.5">
              {ambianceOptions.map((amb) => (
                <button
                  key={amb.id}
                  onClick={() => onSelectAmbiance(amb.id)}
                  title={amb.label}
                  className={`p-1.5 rounded text-xs transition-all ${
                    ambiance === amb.id
                      ? 'bg-amber-400/20 border border-amber-400/50'
                      : 'hover:bg-stone-800/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <span>{amb.icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Flower Shower & Procedural Music */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onTriggerFlowerShower}
              className="px-2.5 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/30 text-rose-200 font-serif-royal text-xs flex items-center gap-1 transition-all"
              title="Shower rose and marigold flower petals"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              <span className="hidden xs:inline">Bless</span>
            </button>

            <button
              onClick={onToggleAudio}
              className={`p-1.5 rounded-lg border transition-all ${
                isPlayingAudio
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                  : 'bg-[#2b121d] border-amber-500/20 text-stone-400 hover:text-amber-200'
              }`}
              title={isPlayingAudio ? 'Mute Celebration Drone' : 'Play Celebration Drone'}
            >
              {isPlayingAudio ? (
                <Volume2 className="w-4 h-4 text-amber-300" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
