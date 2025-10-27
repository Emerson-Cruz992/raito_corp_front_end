/**
 * Configuração de produto 3D (luminárias/iluminação)
 */
export interface Product3D {
  id: string;
  name: string;
  description: string;
  modelPath: string; // Caminho para o arquivo GLB/GLTF
  position: { x: number; y: number; z: number };
  scale: number;
  rotation: { x: number; y: number; z: number };
  material: {
    baseColor: string;
    roughness: number;
    metallic: number;
  };
  emitsLight?: boolean;
  lightProperties?: {
    color: string;
    intensity: number;
    range: number;
    temperature: number; // Cor de luz em Kelvin
  };
}

/**
 * Catálogo de produtos disponíveis
 */
export interface ProductCatalog {
  id: string;
  name: string;
  category: string;
  products: Product3D[];
}