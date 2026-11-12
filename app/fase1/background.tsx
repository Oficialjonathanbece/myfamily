'use client';

import LightRays from '@/app/fase1/LightRays';

export default function Background() {
  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: -1, 
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >
      <LightRays
        raysOrigin="top-center"
        raysColor="#38bdf8"
        raysSpeed={1}
        lightSpread={0.5}
        rayLength={3}
        glow={0.6}
        haze={0.25}
        followMouse
        mouseInfluence={0.1}
        rayDensity={1}
        tilt={0}
        raySharpness={0.35}
        atmosphere={1}
        intensity={1}
        fadeDistance={1}
        saturation={1}
        noiseAmount={0}
        distortion={0}
        pulsating={false}
        cursorShadow
        clickPulse
        intro
        lightMode={false}
      />
    </div>
  );
}