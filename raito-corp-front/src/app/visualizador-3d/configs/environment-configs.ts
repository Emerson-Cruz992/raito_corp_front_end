import { EnvironmentPreset } from '../models/environment.interface';

/**
 * Presets simplificados de ambientes
 * Apenas 3 espaços essenciais
 */
export const ENVIRONMENT_PRESETS: Record<string, EnvironmentPreset> = {
  // ============= SALA =============
  sala: {
    id: 'sala',
    name: 'Sala',
    description: 'Espaço de convivência',
    category: 'sala',
    geometry: {
      walls: {
        width: 6,
        height: 2.8,
        depth: 5,
        material: 'wall',
        color: '#FFFFFF'
      },
      floor: {
        width: 6,
        depth: 5,
        material: 'wood',
        color: '#E8E8E8'
      },
      ceiling: {
        width: 6,
        depth: 5,
        material: 'plaster',
        color: '#FAFAFA'
      },
      objects: [
        {
          id: 'sofa',
          type: 'sofa',
          position: { x: 0, y: 0, z: 1.5 },
          scale: { x: 1, y: 1, z: 1 },
          material: 'fabric',
          color: '#333333'
        },
        {
          id: 'table',
          type: 'table',
          position: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          material: 'wood',
          color: '#6B5344'
        },
        {
          id: 'tv',
          type: 'tv',
          position: { x: -2.5, y: 0, z: -1.5 },
          scale: { x: 1, y: 1, z: 1 },
          material: 'plastic',
          color: '#2A2A2A'
        },
        {
          id: 'plant1',
          type: 'plant',
          position: { x: 2.5, y: 0, z: -1.5 },
          scale: { x: 1, y: 1, z: 1 },
          material: 'ceramic',
          color: '#C8956C'
        }
      ]
    },
    lightingRecommendation: 'Luz quente para ambiente aconchegante',
    cameraPresets: [
      {
        name: 'Visão Geral',
        position: { x: 5, y: 1.5, z: 4 },
        target: { x: 0, y: 0.8, z: 0 }
      },
      {
        name: 'Detalhe',
        position: { x: 3, y: 1, z: 2 },
        target: { x: 0, y: 0.5, z: 0 }
      }
    ]
  },

  // ============= BANHEIRO =============
  banheiro: {
    id: 'banheiro',
    name: 'Banheiro',
    description: 'Espaço sanitário',
    category: 'banheiro',
    geometry: {
      walls: {
        width: 3,
        height: 2.5,
        depth: 3,
        material: 'ceramic_tile',
        color: '#F5F5F5'
      },
      floor: {
        width: 3,
        depth: 3,
        material: 'ceramic_tile',
        color: '#EEEEEE'
      },
      ceiling: {
        width: 3,
        depth: 3,
        material: 'false_ceiling',
        color: '#FFFFFF'
      },
      objects: [
        {
          id: 'sink',
          type: 'sink',
          position: { x: -1, y: 0, z: -1 },
          scale: { x: 1, y: 1, z: 1 },
          material: 'ceramic',
          color: '#FFFFFF'
        },
        {
          id: 'mirror',
          type: 'mirror',
          position: { x: -1, y: 1, z: -1.4 },
          scale: { x: 1, y: 1, z: 1 },
          material: 'glass',
          color: '#E0E8F0'
        },
        {
          id: 'shelf',
          type: 'shelf',
          position: { x: 1, y: 0.5, z: -1.3 },
          scale: { x: 1, y: 1, z: 1 },
          material: 'wood',
          color: '#7B6B5B'
        }
      ]
    },
    lightingRecommendation: 'Luz neutra e brilhante',
    cameraPresets: [
      {
        name: 'Visão Geral',
        position: { x: 2, y: 1.3, z: 2 },
        target: { x: 0, y: 0.8, z: 0 }
      },
      {
        name: 'Espelho',
        position: { x: 0.5, y: 1.2, z: -0.8 },
        target: { x: -1, y: 1.2, z: -1 }
      }
    ]
  },

  // ============= QUARTO =============
  quarto: {
    id: 'quarto',
    name: 'Quarto',
    description: 'Espaço de descanso',
    category: 'quarto',
    geometry: {
      walls: {
        width: 5,
        height: 2.7,
        depth: 4,
        material: 'wall',
        color: '#FAFAFA'
      },
      floor: {
        width: 5,
        depth: 4,
        material: 'wood',
        color: '#E8E8E8'
      },
      ceiling: {
        width: 5,
        depth: 4,
        material: 'plaster',
        color: '#FFFFFF'
      },
      objects: [
        {
          id: 'bed',
          type: 'bed',
          position: { x: 0, y: 0, z: 1 },
          scale: { x: 1, y: 1, z: 1 },
          material: 'fabric',
          color: '#9B9B9B'
        },
        {
          id: 'nightstand1',
          type: 'small_table',
          position: { x: 1.2, y: 0, z: 0.8 },
          scale: { x: 0.5, y: 0.5, z: 0.5 },
          material: 'wood',
          color: '#8B7F73'
        },
        {
          id: 'nightstand2',
          type: 'small_table',
          position: { x: -1.2, y: 0, z: 0.8 },
          scale: { x: 0.5, y: 0.5, z: 0.5 },
          material: 'wood',
          color: '#8B7F73'
        },
        {
          id: 'dresser',
          type: 'dresser',
          position: { x: -2, y: 0, z: -1.5 },
          scale: { x: 1, y: 1, z: 1 },
          material: 'wood',
          color: '#8B6F47'
        }
      ]
    },
    lightingRecommendation: 'Luz quente para ambiente relaxante',
    cameraPresets: [
      {
        name: 'Visão Geral',
        position: { x: 4, y: 1.3, z: 3 },
        target: { x: 0, y: 0.7, z: 0 }
      },
      {
        name: 'Pé da Cama',
        position: { x: 2, y: 1, z: -1.5 },
        target: { x: 0, y: 0.4, z: 1 }
      }
    ]
  }
};

/**
 * Agrupamento de presets por categoria
 */
export const ENVIRONMENT_GROUPS: Record<string, any[]> = {
  sala: [ENVIRONMENT_PRESETS['sala']],
  banheiro: [ENVIRONMENT_PRESETS['banheiro']],
  quarto: [ENVIRONMENT_PRESETS['quarto']]
};