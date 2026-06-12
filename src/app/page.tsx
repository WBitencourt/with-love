"use client";

import { useEffect, useState } from "react";
import { usePhotoData } from "@/lib/usePhotoData";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import MusicPlayer from "@/components/MusicPlayer";

export default function Home() {
  const { currentTheme } = useTheme();

  const [particleAnimations, setParticleAnimations] = useState<
    Array<{
      left: string;
      animationDelay: string;
      animationDuration: string;
      fontSize: string;
    }>
  >([]);

  const { photos } = usePhotoData();

  useEffect(() => {
    const animations = Array.from({ length: currentTheme.particleCount }).map(() => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 8}s`,
      animationDuration: `${6 + Math.random() * 4}s`,
      fontSize: `${1 + Math.random() * 1.5}rem`,
    }));
    setParticleAnimations(animations);
  }, [currentTheme]);

  return (
    <div className="min-h-screen theme-page-bg relative overflow-hidden">
      <ThemeSwitcher />

      {currentTheme.watermarkUrl && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ zIndex: 0 }}>
          <img
            src={currentTheme.watermarkUrl}
            alt=""
            className="w-full h-full object-contain opacity-[0.07] select-none"
          />
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none">
        {particleAnimations.map((animation, i) => (
          <div
            key={i}
            className="absolute heart-falling"
            style={{
              ...animation,
              color: 'var(--theme-particle-color)',
              textShadow: 'var(--theme-particle-shadow)',
            }}
          >
            {currentTheme.particle}
          </div>
        ))}
      </div>

      <div className="w-full min-h-screen overflow-y-auto flex items-center justify-center p-4">
        <div className="w-full max-w-3xl mx-auto">
          <MusicPlayer
            songs={currentTheme.playlist}
            themeId={currentTheme.id}
            photos={photos}
          />
        </div>
      </div>
    </div>
  );
}
