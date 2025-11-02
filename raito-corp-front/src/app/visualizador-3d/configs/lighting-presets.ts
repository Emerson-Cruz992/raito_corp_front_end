import { LightingPreset } from '../models/lighting-config.interface';

/**
 * Iluminação suave e natural para sala moderna
 */
export const LIGHTING_PRESETS: Record<string, LightingPreset> = {
  sala_natural: {
    id: 'sala_natural',
    name: 'Iluminação Natural',
    description: 'Luz suave e difusa para sala de estar',
    category: 'claro',
    ambientIntensity: 0.6,
    bloomEnabled: false,
    bloomIntensity: 0,
    bloomThreshold: 1,
    colorGradeIntensity: 0,
    lights: [
      // Luz principal suave (janela)
      {
        id: 'window_light',
        type: 'directional',
        name: 'Luz da Janela',
        position: { x: -5, y: 6, z: 4 },
        direction: { x: 0.7, y: -0.8, z: -0.5 },
        intensity: 1.5,
        range: 100,
        color: '#FFFFFF',
        shadowMap: true,
        shadows: {
          enabled: true,
          mapSize: 2048,
          bias: 0.0001,
          normalBias: 0.02
        }
      },
      // Luz de preenchimento suave
      {
        id: 'fill_light',
        type: 'directional',
        name: 'Luz de Preenchimento',
        position: { x: 3, y: 5, z: -3 },
        direction: { x: -0.5, y: -0.7, z: 0.5 },
        intensity: 0.8,
        range: 100,
        color: '#F5F5F5'
      },
      // Luz ambiente do teto
      {
        id: 'ceiling_ambient',
        type: 'point',
        name: 'Luz Ambiente',
        position: { x: 0, y: 2.8, z: 0 },
        intensity: 1.0,
        range: 12,
        color: '#FFFFFF'
      }
    ]
  }
};

export const PRESET_GROUPS: Record<string, any[]> = {
  claro: [LIGHTING_PRESETS['sala_natural']]
};
