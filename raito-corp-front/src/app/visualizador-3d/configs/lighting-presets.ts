import { LightingPreset } from '../models/lighting-config.interface';

/**
 * Presets de iluminação para diferentes ambientes e momentos do dia
 */
export const LIGHTING_PRESETS: Record<string, LightingPreset> = {
  // ============= LUZ NATURAL =============
  natural: {
    id: 'natural',
    name: 'Natural',
    description: 'Simula luz solar natural do meio do dia',
    category: 'claro',
    ambientIntensity: 0.4,
    bloomEnabled: true,
    bloomIntensity: 0.5,
    bloomThreshold: 0.7,
    colorGradeIntensity: 0.3,
    lights: [
      {
        id: 'sun',
        type: 'directional',
        name: 'Sol Principal',
        position: { x: 12, y: 10, z: 8 },
        direction: { x: -0.8, y: -1, z: -0.6 },
        intensity: 2.5,
        range: 100,
        color: '#FFF8E1',
        shadowMap: true,
        shadows: {
          enabled: true,
          mapSize: 2048,
          bias: 0.00005,
          normalBias: 0.015
        }
      },
      {
        id: 'sky',
        type: 'directional',
        name: 'Luz do Céu',
        position: { x: -6, y: 8, z: -10 },
        direction: { x: 0.5, y: -1, z: 0.8 },
        intensity: 1.2,
        range: 100,
        color: '#E3F2FD'
      },
      {
        id: 'bounce',
        type: 'point',
        name: 'Reflexão',
        position: { x: 0, y: 0.5, z: 0 },
        intensity: 0.8,
        range: 15,
        color: '#F5F5F5'
      }
    ]
  },

  // ============= LUZ NEUTRA =============
  neutra: {
    id: 'neutra',
    name: 'Neutra',
    description: 'Iluminação branca neutra equilibrada',
    category: 'neutro',
    ambientIntensity: 0.75,
    bloomEnabled: false,
    bloomIntensity: 0.2,
    bloomThreshold: 0.9,
    colorGradeIntensity: 0.0,
    lights: [
      {
        id: 'main',
        type: 'directional',
        name: 'Principal',
        position: { x: 8, y: 7, z: 8 },
        direction: { x: -0.7, y: -1, z: -0.7 },
        intensity: 1.0,
        range: 100,
        color: '#FFFFFF',
        shadowMap: true,
        shadows: {
          enabled: true,
          mapSize: 1024,
          bias: 0.0001,
          normalBias: 0.02
        }
      },
      {
        id: 'fill_neutral',
        type: 'point',
        name: 'Ambiente',
        position: { x: 0, y: 5, z: 0 },
        intensity: 0.5,
        range: 18,
        color: '#F5F5F5'
      }
    ]
  },

  // ============= LUZ QUENTE =============
  quente: {
    id: 'quente',
    name: 'Quente',
    description: 'Iluminação quente e aconchegante',
    category: 'quente',
    ambientIntensity: 0.6,
    bloomEnabled: false,
    bloomIntensity: 0.3,
    bloomThreshold: 0.75,
    colorGradeIntensity: 0.25,
    lights: [
      {
        id: 'warm_main',
        type: 'directional',
        name: 'Principal Quente',
        position: { x: 8, y: 6, z: 8 },
        direction: { x: -0.7, y: -1, z: -0.7 },
        intensity: 0.9,
        range: 100,
        color: '#FFD4A3',
        shadowMap: true,
        shadows: {
          enabled: true,
          mapSize: 1024,
          bias: 0.0001,
          normalBias: 0.02
        }
      },
      {
        id: 'warm_fill',
        type: 'point',
        name: 'Preenchimento',
        position: { x: 0, y: 2, z: 0 },
        intensity: 0.4,
        range: 15,
        color: '#FFE4B5'
      }
    ]
  },

  // ============= LUZ NOTURNA =============
  noturna: {
    id: 'noturna',
    name: 'Noturna',
    description: 'Ambiente noturno cinematográfico com múltiplas fontes',
    category: 'cenico',
    ambientIntensity: 0.15,
    bloomEnabled: true,
    bloomIntensity: 1.2,
    bloomThreshold: 0.4,
    colorGradeIntensity: 0.7,
    lights: [
      {
        id: 'key_light',
        type: 'spot',
        name: 'Luz Principal',
        position: { x: 4, y: 6, z: 4 },
        direction: { x: -0.6, y: -1, z: -0.6 },
        intensity: 3.5,
        range: 25,
        color: '#FFE4B5',
        spotlight: {
          angle: 0.6,
          exponent: 3,
          decay: 2
        },
        shadowMap: true,
        shadows: {
          enabled: true,
          mapSize: 2048,
          bias: 0.00003,
          normalBias: 0.01
        }
      },
      {
        id: 'fill_light',
        type: 'spot',
        name: 'Luz de Preenchimento',
        position: { x: -3, y: 4, z: 2 },
        direction: { x: 0.5, y: -1, z: -0.3 },
        intensity: 1.8,
        range: 18,
        color: '#E6F3FF',
        spotlight: {
          angle: 1.0,
          exponent: 1.5,
          decay: 1.5
        }
      },
      {
        id: 'rim_light',
        type: 'directional',
        name: 'Luz de Contorno',
        position: { x: -8, y: 8, z: -8 },
        direction: { x: 1, y: -0.5, z: 1 },
        intensity: 0.8,
        range: 100,
        color: '#B8E6FF'
      },
      {
        id: 'accent_warm',
        type: 'point',
        name: 'Acento Quente',
        position: { x: 2, y: 1.5, z: -2 },
        intensity: 1.5,
        range: 8,
        color: '#FF9500'
      },
      {
        id: 'accent1',
        type: 'point',
        name: 'Acento 1',
        position: { x: -3, y: 1, z: 3 },
        intensity: 1.0,
        range: 8,
        color: '#5B8CFF'
      },
      {
        id: 'accent2',
        type: 'point',
        name: 'Acento 2',
        position: { x: 4, y: 0.5, z: -3 },
        intensity: 0.8,
        range: 6,
        color: '#FF9D5B'
      }
    ]
  },
  
  // ============= LUZ DRAMATICA =============
  dramatica: {
    id: 'dramatica',
    name: 'Dramática',
    description: 'Iluminação de alto contraste para destaque de objetos',
    category: 'cenico',
    ambientIntensity: 0.2,
    bloomEnabled: true,
    bloomIntensity: 0.5,
    bloomThreshold: 0.6,
    colorGradeIntensity: 0.4,
    lights: [
      {
        id: 'key_light',
        type: 'spot',
        name: 'Luz Principal',
        position: { x: 6, y: 8, z: 6 },
        direction: { x: -0.5, y: -1, z: -0.5 },
        intensity: 3.0,
        range: 25,
        color: '#FFFFFF',
        spotlight: {
          angle: 0.7,
          exponent: 3,
          decay: 1
        },
        shadowMap: true,
        shadows: {
          enabled: true,
          mapSize: 1024,
          bias: 0.0001,
          normalBias: 0.02
        }
      },
      {
        id: 'rim_light',
        type: 'spot',
        name: 'Contraluz',
        position: { x: -5, y: 6, z: -5 },
        direction: { x: 0.5, y: -0.8, z: 0.5 },
        intensity: 1.5,
        range: 20,
        color: '#A0C8FF',
        spotlight: {
          angle: 0.9,
          exponent: 2,
          decay: 1
        }
      }
    ]
  }
};

/**
 * Agrupamento de presets por categoria
 */
export const PRESET_GROUPS: Record<string, any[]> = {
  claro: [
    LIGHTING_PRESETS['natural']
  ],
  neutro: [
    LIGHTING_PRESETS['neutra']
  ],
  quente: [
    LIGHTING_PRESETS['quente']
  ],
  cenico: [
    LIGHTING_PRESETS['noturna'],
    LIGHTING_PRESETS['dramatica']
  ]
};