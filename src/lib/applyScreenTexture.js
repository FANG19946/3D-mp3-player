import {
  MeshPhysicalMaterial,
  SRGBColorSpace,
  TextureLoader,
} from 'three';

export function applyScreenTexture(screenMesh, textureURL, onDone) {
  if (!screenMesh) return console.warn('⚠️ screen mesh not found');

  const loader = new TextureLoader();
  loader.load(textureURL, (texture) => {
    const origMat = screenMesh.material;

    //stop flipping of texture on Y axis
    texture.flipY = false;
    //Changing colorspace of texture
    texture.colorSpace = SRGBColorSpace;
    
    //Flipping Texture on X axis 
    texture.center.set(0.5, 0.5);
    texture.rotation = 0;
    texture.matrixAutoUpdate = false;

    // Horizontal flip
    texture.matrix.set(-1, 0, 1, 0, 1, 0, 0, 0, 1);
    texture.needsUpdate = true;

    //Fixing material if null values found
    screenMesh.material = new MeshPhysicalMaterial({
      map: texture,
      roughness: origMat.roughness ?? 0.5,
      metalness: origMat.metalness ?? 0,
      ior: origMat.ior ?? 1.5,
      emissive: origMat.emissive?.clone(),
      emissiveIntensity: origMat.emissiveIntensity ?? 0,
    });

    screenMesh.material.needsUpdate = true;
    onDone?.();
  });
}
