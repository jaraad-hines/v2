// 🔍 Extract metadata from .glb loaded object
export function extractPlaneMetadata(object: THREE.Object3D): Record<string, any> | null {
  if (!object || !object.userData) return null;

  const { row_id, card_type, card_id, scaledPlane, label, content, visible } = object.userData;

  if (row_id || card_id || scaledPlane) {
    return {
      row_id,
      card_type,
      card_id,
      scaledPlane,
      label,
      content,
      visible,
      name: object.name,
      uuid: object.uuid,
    };
  }

  return null;
}