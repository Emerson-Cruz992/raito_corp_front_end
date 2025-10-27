/**
 * Configuração de geometria e materiais do ambiente
 */
export interface EnvironmentGeometry {
  walls: {
    width: number;
    height: number;
    depth: number;
    material: string;
    color: string;
  };
  floor: {
    width: number;
    depth: number;
    material: string;
    color: string;
  };
  ceiling: {
    width: number;
    depth: number;
    material: string;
    color: string;
  };
  objects?: Array<{
    id: string;
    type: string;
    position: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
    material: string;
    color: string;
  }>;
}

/**
 * Preset de ambiente
 */
export interface EnvironmentPreset {
  id: string;
  name: string;
  description: string;
  category: 'sala' | 'banheiro' | 'quarto';
  geometry: EnvironmentGeometry;
  lightingRecommendation: string;
  cameraPresets: Array<{
    name: string;
    position: { x: number; y: number; z: number };
    target: { x: number; y: number; z: number };
  }>;
}

/**
 * Estado do ambiente atual
 */
export interface EnvironmentState {
  currentEnvironment: EnvironmentPreset;
  cameraPosition: { x: number; y: number; z: number };
  cameraTarget: { x: number; y: number; z: number };
}

/**
 * Material realista com propriedades PBR
 */
export interface MaterialConfig {
  name: string;
  baseColor: string;
  roughness: number; // 0 (espelhado) a 1 (fosco)
  metallic: number; // 0 (não-metálico) a 1 (metálico)
  emissive?: string;
  emissiveIntensity?: number;
  normalMap?: string;
  aoMap?: string;
}