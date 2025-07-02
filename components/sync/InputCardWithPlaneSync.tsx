import { useEffect } from 'react';
import { usePlaneMetadata } from './usePlaneMetadata';

type Props = {
  card_id: string;
  onPlaneFocus?: (mesh: THREE.Object3D) => void;
};

export function InputCardWithPlaneSync({ card_id, onPlaneFocus }: Props) {
  const plane = usePlaneMetadata(card_id);

  useEffect(() => {
    if (plane && plane.mesh && onPlaneFocus) {
      onPlaneFocus(plane.mesh);
    }
  }, [plane]);

  return null; // Attach to InputCard logic or render debug UI here
}