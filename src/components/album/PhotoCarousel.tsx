'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { PhotoEntry } from '@/lib/usePhotoData';
import PolaroidPhoto from './PolaroidPhoto';

interface PhotoCarouselProps {
  photos: PhotoEntry[];
  currentIndex: number;
  direction: 'forward' | 'backward';
  onTransitionDone: () => void;
}

const DURATION = 0.5;

const EASE = [0.4, 0, 0.2, 1] as const;

const SIDE_X = 270;

const SIDE_SCALE = 0.65;

const OFFSCREEN_X = SIDE_X * 2.2;

export default function PhotoCarousel({ photos, currentIndex, direction, onTransitionDone }: PhotoCarouselProps) {
  const offsets = [-1, 0, 1] as const;

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden relative" style={{ backgroundColor: 'var(--theme-carousel-bg)' }}>
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          backgroundImage: 'var(--theme-album-watermark)',
          backgroundSize: '70% auto',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: 0.07,
          zIndex: 0,
        }}
      />
      <AnimatePresence mode="sync" initial={false} onExitComplete={onTransitionDone}>
        {offsets.map((offset) => {
          const photoIdx = currentIndex + offset;

          if (photoIdx < 0 || photoIdx >= photos.length) {
            return null;
          }

          const photo = photos[photoIdx];

          const isCenter = offset === 0;

          const rotation = offset === -1 ? -4 : offset === 1 ? 4 : 0;

          const enterFromX = direction === 'forward' ? OFFSCREEN_X : -OFFSCREEN_X;

          const exitToX = direction === 'forward' ? -OFFSCREEN_X : OFFSCREEN_X;

          return (
            <motion.div
              key={photoIdx}
              initial={{ x: enterFromX, scale: SIDE_SCALE * 0.85, opacity: 0 }}
              animate={{
                x: offset * SIDE_X,
                scale: isCenter ? 1 : SIDE_SCALE,
                opacity: isCenter ? 1 : 0.65,
              }}
              exit={{ x: exitToX, scale: SIDE_SCALE * 0.85, opacity: 0 }}
              transition={{ duration: DURATION, ease: EASE }}
              style={{ position: 'absolute', zIndex: isCenter ? 2 : 1 }}
            >
              <PolaroidPhoto
                src={photo.path}
                date={photo.date}
                location={photo.location}
                rotation={rotation}
                size="lg"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
