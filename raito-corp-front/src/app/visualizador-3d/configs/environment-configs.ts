import { EnvironmentPreset } from '../models/environment.interface';

/**
 * Ambiente Sala Moderna - baseado na imagem fornecida
 */
export const ENVIRONMENT_PRESETS: Record<string, EnvironmentPreset> = {
  sala_moderna: {
    id: 'sala_moderna',
    name: 'Sala Moderna',
    description: 'Sala de estar contemporânea com sofá e decoração',
    category: 'sala',
    geometry: {
      walls: {
        width: 8,
        height: 3,
        depth: 6,
        material: 'wall',
        color: '#E8E8E8'
      },
      floor: {
        width: 8,
        depth: 6,
        material: 'wood_floor',
        color: '#D4D4D4'
      },
      ceiling: {
        width: 8,
        depth: 6,
        material: 'plaster',
        color: '#F5F5F5'
      },
      objects: [
        // Sofá grande (preto)
        {
          id: 'sofa',
          type: 'sofa',
          position: { x: 1.5, y: 0, z: 0 },
          scale: { x: 2.5, y: 0.8, z: 1.2 },
          material: 'fabric',
          color: '#1A1A1A'
        },
        // Tapete decorativo
        {
          id: 'tapete',
          type: 'decoration',
          position: { x: 0, y: 0.01, z: 0 },
          scale: { x: 2.5, y: 0.01, z: 1.8 },
          material: 'fabric',
          color: '#8B7355'
        },
        // Planta no vaso (canto direito)
        {
          id: 'plant_main',
          type: 'plant',
          position: { x: -0.5, y: 0, z: -0.5 },
          scale: { x: 0.5, y: 0.8, z: 0.5 },
          material: 'plastic',
          color: '#4A7C59'
        },
        // Estante branca (parede esquerda)
        {
          id: 'shelf_left',
          type: 'shelf',
          position: { x: -3.5, y: 0.5, z: -1 },
          scale: { x: 0.4, y: 1.5, z: 0.3 },
          material: 'wood',
          color: '#F0F0F0'
        },
        // Quadro decorativo 1 (parede direita)
        {
          id: 'frame_1',
          type: 'decoration',
          position: { x: 3.95, y: 1.8, z: 0.5 },
          scale: { x: 0.02, y: 0.6, z: 0.4 },
          material: 'wood_frame',
          color: '#2C2C2C'
        },
        // Quadro decorativo 2 (parede direita)
        {
          id: 'frame_2',
          type: 'decoration',
          position: { x: 3.95, y: 1.8, z: -0.3 },
          scale: { x: 0.02, y: 0.5, z: 0.3 },
          material: 'wood_frame',
          color: '#654321'
        },
        // Quadro decorativo 3 (parede direita)
        {
          id: 'frame_3',
          type: 'decoration',
          position: { x: 3.95, y: 1.5, z: -1 },
          scale: { x: 0.02, y: 0.7, z: 0.5 },
          material: 'wood_frame',
          color: '#C89858'
        },
        // TV na parede esquerda
        {
          id: 'tv_wall',
          type: 'tv',
          position: { x: -3.9, y: 1.5, z: 0 },
          scale: { x: 0.05, y: 0.8, z: 1.2 },
          material: 'plastic',
          color: '#1A1A1A'
        }
      ]
    },
    lightingRecommendation: 'Iluminação natural suave',
    cameraPresets: [
      {
        name: 'Visão Fixa',
        position: { x: -2.5, y: 2, z: 4 },
        target: { x: 1, y: 0.5, z: 0 }
      }
    ]
  }
};

export const ENVIRONMENT_GROUPS: Record<string, any[]> = {
  sala: [ENVIRONMENT_PRESETS['sala_moderna']]
};
