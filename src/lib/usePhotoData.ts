'use client';

export type { PhotoEntry } from './photoData';

import { PHOTOS } from './photoData';

export function usePhotoData() {
  return { photos: PHOTOS };
}
