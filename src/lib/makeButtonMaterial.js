import { MeshPhysicalMaterial, Color, FrontSide } from 'three';

/**
 * Generates a clean, transparent material for button textures.
 * @param {Texture} texture - The icon texture to use on the button.
 * @param {MeshPhysicalMaterial} baseMaterial - The panel/screen base material to copy key properties from.
 * @returns {MeshPhysicalMaterial}
 */
export function makeButtonMaterial(texture, baseMaterial) {
  const mat = new MeshPhysicalMaterial({
    map: texture,
    color: new Color('white'), // Ensure full texture brightness
    transparent: true,
    opacity: 1,
    depthTest: false,
    depthWrite: false,

    roughness: baseMaterial?.roughness ?? 0.5,
    metalness: baseMaterial?.metalness ?? 0,
    ior: baseMaterial?.ior ?? 1.5,
    emissive: baseMaterial?.emissive?.clone() ?? new Color(0x000000),
    emissiveIntensity: baseMaterial?.emissiveIntensity ?? 0,
  });

  mat.needsUpdate = true;
  return mat;
}
