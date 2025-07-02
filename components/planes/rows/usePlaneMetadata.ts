import { useEffect, useState } from 'react';
import { getRowPlane } from './rowPlaneRegistry';

export function usePlaneMetadata(card_id: string) {
  const [plane, setPlane] = useState<ReturnType<typeof getRowPlane>>();

  useEffect(() => {
    if (!card_id) return;
    const entry = getRowPlane(card_id);
    if (entry) setPlane(entry);
  }, [card_id]);

  return plane;
}