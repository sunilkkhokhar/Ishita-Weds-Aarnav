import React, { useEffect, useRef } from 'react';
import { MandapScene, CameraPreset, LightingAmbiance } from '../three/MandapScene.ts';

interface ThreeCanvasProps {
  cameraPreset: CameraPreset;
  ambiance: LightingAmbiance;
  flowerBurstKey: number;
  onSceneReady?: (scene: MandapScene) => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  cameraPreset,
  ambiance,
  flowerBurstKey,
  onSceneReady
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<MandapScene | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const mandap = new MandapScene(mountRef.current);
    sceneRef.current = mandap;

    if (onSceneReady) {
      onSceneReady(mandap);
    }

    return () => {
      mandap.dispose();
      sceneRef.current = null;
    };
  }, [onSceneReady]);

  // Synchronize Camera Preset
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setCameraPreset(cameraPreset);
    }
  }, [cameraPreset]);

  // Synchronize Lighting Ambiance
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setAmbiance(ambiance);
    }
  }, [ambiance]);

  // Trigger Flower Petal Shower Burst
  useEffect(() => {
    if (flowerBurstKey > 0 && sceneRef.current) {
      sceneRef.current.triggerFlowerBurst();
    }
  }, [flowerBurstKey]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none touch-none"
      style={{ zIndex: 0 }}
    />
  );
};
