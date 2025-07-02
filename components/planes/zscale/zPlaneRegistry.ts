import * as THREE from 'three';
import { extractPlaneMetadata } from '../rows/blenderMetadataMap';

let zPlane: THREE.Object3D | null = null;
let zPlaneMetadata: Record<string, any> | null = null;

export function registerZPlane(scene: THREE.Scene) {
  scene.traverse((child) => {
    const metadata = extractPlaneMetadata(child);
    if (metadata?.scaledPlane) {
      zPlane = child;
      zPlaneMetadata = metadata;
    }
  });
}

export function getZPlane() {
  return { mesh: zPlane, metadata: zPlaneMetadata };
}