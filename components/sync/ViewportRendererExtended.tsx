import { usePlaneMetadata } from './usePlaneMetadata';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type Props = {
  card_id: string;
  content: string;
};

export function ViewportRendererExtended({ card_id, content }: Props) {
  const planeEntry = usePlaneMetadata(card_id);
  const canvasTextureRef = useRef<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    if (!planeEntry) return;

    const { mesh } = planeEntry;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '24px sans-serif';
    ctx.fillStyle = 'white';
    ctx.fillText(content, 20, 128);

    const texture = new THREE.CanvasTexture(canvas);
    canvasTextureRef.current = texture;

    if ('material' in mesh && Array.isArray(mesh.material)) {
      mesh.material[0].map = texture;
      mesh.material[0].needsUpdate = true;
    } else if ('material' in mesh) {
      mesh.material.map = texture;
      mesh.material.needsUpdate = true;
    }

  }, [planeEntry, content]);

  return null;
}