/**
 * Configuração de luz individual
 */
export interface LightConfig {
  id: string;
  type: 'point' | 'directional' | 'spot';
  name: string;
  position: { x: number; y: number; z: number };
  direction?: { x: number; y: number; z: number };
  intensity: number;
  range: number;
  color: string; // formato hex: #FFFFFF
  shadowMap?: boolean;
  shadows?: {
    enabled: boolean;
    mapSize: number;
    bias: number;
    normalBias: number;
  };
  spotlight?: {
    angle: number;
    exponent: number;
    decay: number;
  };
}

/**
 * Preset de iluminação completo
 */
export interface LightingPreset {
  id: string;
  name: string;
  description: string;
  category: 'claro' | 'neutro' | 'quente' | 'cenico';
  ambientIntensity: number;
  lights: LightConfig[];
  bloomEnabled: boolean;
  bloomIntensity: number;
  bloomThreshold: number;
  colorGradeIntensity: number;
}

/**
 * Estado da iluminação em tempo real
 */
export interface LightingState {
  currentPreset: LightingPreset;
  customLights: LightConfig[];
  isCustomized: boolean;
  ambientLight: {
    intensity: number;
    color: string;
  };
}