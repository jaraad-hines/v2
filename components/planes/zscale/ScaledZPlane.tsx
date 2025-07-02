import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type Props = {
  mesh: THREE.Mesh;
  content: string;
};

export function ScaledZPlane({ mesh, content }: Props) {
  const canvasTextureRef = useRef<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '32px monospace';
    ctx.fillStyle = 'white';
    ctx.fillText(content, 40, 256);

    const texture = new THREE.CanvasTexture(canvas);
    canvasTextureRef.current = texture;

    if ('material' in mesh && Array.isArray(mesh.material)) {
      mesh.material[0].map = texture;
      mesh.material[0].needsUpdate = true;
    } else if ('material' in mesh) {
      mesh.material.map = texture;
      mesh.material.needsUpdate = true;
    }
  }, [content, mesh]);

  return null;
}