'use client';

import { useState, useEffect } from 'react';
import { PhotoEntry } from '@/lib/usePhotoData';
import PolaroidPhoto from './PolaroidPhoto';

interface AlbumCoverProps {
  photos: PhotoEntry[];
}

export default function AlbumCover({ photos }: AlbumCoverProps) {
  const [coverPhotos, setCoverPhotos] = useState<PhotoEntry[]>([]);

  useEffect(() => {
    if (photos.length < 3) {
      setCoverPhotos([...photos]);
      return;
    }

    const shuffled = [...photos].sort(() => {
      return Math.random() - 0.5;
    });

    setCoverPhotos(shuffled.slice(0, 3));
  }, [photos]);

  return (
    <div className="relative w-full h-full bg-album-paper flex flex-col items-center justify-center gap-4 px-6 py-6">
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
      <h1 className="text-3xl sm:text-4xl font-serif tracking-wide text-center" style={{ color: 'var(--theme-text-primary)' }}>
        Eu e ela ♥
      </h1>

      {coverPhotos.length > 0 && (
        <div className="relative shrink-0" style={{ width: 300, height: 260 }}>
          {coverPhotos[2] && (
            <div className="absolute" style={{ top: 8, left: 0, zIndex: 10 }}>
              <PolaroidPhoto
                src={coverPhotos[2].path}
                date={coverPhotos[2].date}
                location={coverPhotos[2].location}
                rotation={-5}
                size="sm"
              />
            </div>
          )}
          {coverPhotos[0] && (
            <div className="absolute" style={{ top: 4, right: 0, zIndex: 10 }}>
              <PolaroidPhoto
                src={coverPhotos[0].path}
                date={coverPhotos[0].date}
                location={coverPhotos[0].location}
                rotation={3}
                size="sm"
              />
            </div>
          )}
          {coverPhotos[1] && (
            <div
              className="absolute"
              style={{ top: 20, left: '50%', transform: 'translateX(-50%) rotate(-1deg)', zIndex: 20 }}
            >
              <PolaroidPhoto
                src={coverPhotos[1].path}
                date={coverPhotos[1].date}
                location={coverPhotos[1].location}
                rotation={0}
                size="sm"
              />
            </div>
          )}
        </div>
      )}

    </div>
  );
}
