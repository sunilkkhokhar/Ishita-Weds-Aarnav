/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ThreeCanvas } from './components/ThreeCanvas.tsx';
import { ControlDock } from './components/ControlDock.tsx';
import { HeaderBadge } from './components/HeaderBadge.tsx';
import { InvitationViewer } from './components/InvitationViewer.tsx';
import { ScheduleModal } from './components/ScheduleModal.tsx';
import { RSVPModal } from './components/RSVPModal.tsx';
import { VenueModal } from './components/VenueModal.tsx';
import { GuestbookModal } from './components/GuestbookModal.tsx';
import { weddingAudio } from './audio/weddingAudio.ts';
import { CameraPreset, LightingAmbiance } from './three/MandapScene.ts';

export default function App() {
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('front');
  const [ambiance, setAmbiance] = useState<LightingAmbiance>('evening');
  const [flowerBurstKey, setFlowerBurstKey] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Modals state
  const [isInvitationOpen, setIsInvitationOpen] = useState<boolean>(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState<boolean>(false);
  const [isRSVPOpen, setIsRSVPOpen] = useState<boolean>(false);
  const [isVenueOpen, setIsVenueOpen] = useState<boolean>(false);
  const [isGuestbookOpen, setIsGuestbookOpen] = useState<boolean>(false);

  // Keyboard shortcut 'H' to toggle dock, 'C' for card, 'F' for flower shower
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'c' || e.key === 'C') {
        setIsInvitationOpen((prev) => !prev);
      } else if (e.key === 'f' || e.key === 'F') {
        triggerFlowerShower();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerFlowerShower = useCallback(() => {
    setFlowerBurstKey((k) => k + 1);

    // Also trigger light screen confetti with marigold and rose petal tones
    try {
      confetti({
        particleCount: 45,
        spread: 75,
        origin: { y: 0.2 },
        colors: ['#d4af37', '#fce085', '#e63946', '#ff758f', '#ffb703'],
        shapes: ['circle'],
        ticks: 200,
        scalar: 1.1
      });
    } catch {
      // ignore
    }

    weddingAudio.playBellChime();
  }, []);

  const handleToggleAudio = useCallback(() => {
    const active = weddingAudio.toggle();
    setIsPlayingAudio(active);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0c0509]">
      {/* 1. Full-Bleed 3D WebGL Canvas Scene (Mandap, Sacred Fire, Couple Thrones, Flowers) */}
      <ThreeCanvas
        cameraPreset={cameraPreset}
        ambiance={ambiance}
        flowerBurstKey={flowerBurstKey}
      />

      {/* 2. Minimal Unobtrusive Header Badge (Top-Center) with Couple Crest & Live Countdown */}
      <HeaderBadge
        onOpenInvitation={() => setIsInvitationOpen(true)}
        onOpenSchedule={() => setIsScheduleOpen(true)}
        onOpenVenue={() => setIsVenueOpen(true)}
      />

      {/* 3. Viewport-First Collapsible Bottom Control Dock (<= 15% footprint) */}
      <ControlDock
        cameraPreset={cameraPreset}
        onSelectCamera={setCameraPreset}
        ambiance={ambiance}
        onSelectAmbiance={setAmbiance}
        onTriggerFlowerShower={triggerFlowerShower}
        isPlayingAudio={isPlayingAudio}
        onToggleAudio={handleToggleAudio}
        onOpenInvitation={() => setIsInvitationOpen(true)}
        onOpenSchedule={() => setIsScheduleOpen(true)}
        onOpenRSVP={() => setIsRSVPOpen(true)}
        onOpenVenue={() => setIsVenueOpen(true)}
        onOpenGuestbook={() => setIsGuestbookOpen(true)}
      />

      {/* 4. Full High-Fidelity 4-Page Wedding Invitation Modal */}
      <InvitationViewer
        isOpen={isInvitationOpen}
        onClose={() => setIsInvitationOpen(false)}
        onOpenRSVP={() => {
          setIsInvitationOpen(false);
          setIsRSVPOpen(true);
        }}
        onOpenVenue={() => {
          setIsInvitationOpen(false);
          setIsVenueOpen(true);
        }}
      />

      {/* 5. Complete 3-Day Wedding Events Schedule Modal */}
      <ScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onOpenVenue={() => {
          setIsScheduleOpen(false);
          setIsVenueOpen(true);
        }}
      />

      {/* 6. RSVP & Direct Family Contact Modal */}
      <RSVPModal
        isOpen={isRSVPOpen}
        onClose={() => setIsRSVPOpen(false)}
      />

      {/* 7. Venue & Directions Modal (Antilia By Zion, Sonipat) */}
      <VenueModal
        isOpen={isVenueOpen}
        onClose={() => setIsVenueOpen(false)}
      />

      {/* 8. Blessings & Guestbook Modal */}
      <GuestbookModal
        isOpen={isGuestbookOpen}
        onClose={() => setIsGuestbookOpen(false)}
        onBlessingSubmitted={triggerFlowerShower}
      />
    </main>
  );
}
