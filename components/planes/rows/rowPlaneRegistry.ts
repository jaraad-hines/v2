import * as THREE from 'three';
import { extractPlaneMetadata } from './blenderMetadataMap';

export type PlaneEntry = {
  mesh: THREE.Object3D;
  metadata: Record<string, any>;
};

const rowPlanes: Map<string, PlaneEntry> = new Map();

export function registerRowPlanes(scene: THREE.Scene) {
  scene.traverse((child) => {
    const metadata = extractPlaneMetadata(child);
    if (metadata && metadata.card_id && !metadata.scaledPlane) {
      rowPlanes.set(metadata.card_id, { mesh: child, metadata });
    }
  });
}

export function getRowPlane(card_id: string): PlaneEntry | undefined {
  return rowPlanes.get(card_id);
}