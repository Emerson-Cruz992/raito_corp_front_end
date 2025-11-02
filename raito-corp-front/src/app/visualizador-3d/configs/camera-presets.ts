import { CameraPreset } from '../models/camera-settings.interface';

/**
 * Presets de câmera para diferentes ambientes - visões estáticas otimizadas
 */
export const CAMERA_PRESETS: Record<string, CameraPreset> = {
  // Preset padrão - visão cinematográfica
  default: {
    id: 'default',
    name: 'Visão Padrão',
    description: 'Visão cinematográfica otimizada para visualização completa',
    settings: {
      position: { x: 4, y: 3, z: 4 },
      target: { x: 0, y: 0.5, z: 0 },
      fov: 0.9,
      minZoom: 1,
      maxZoom: 1,
      currentZoom: 1,
      autoRotate: false,
      autoRotateSpeed: 0
    }
  },

  // Presets específicos para cada tipo de sala
  sala_estar: {
    id: 'sala_estar',
    name: 'Sala de Estar',
    description: 'Ângulo diagonal mostrando sofá e mesa',
    settings: {
      position: { x: 4.5, y: 2.8, z: 4.5 },
      target: { x: -0.5, y: 1.0, z: -0.5 },
      fov: 65,
      minZoom: 1,
      maxZoom: 1,
      currentZoom: 1,
      autoRotate: false,
      autoRotateSpeed: 0
    }
  },

  sala_comercial: {
    id: 'sala_comercial',
    name: 'Sala Comercial',
    description: 'Vista profissional do ambiente',
    settings: {
      position: { x: 5.2, y: 3.2, z: 3.8 },
      target: { x: 0, y: 1.2, z: 0 },
      fov: 68,
      minZoom: 1,
      maxZoom: 1,
      currentZoom: 1,
      autoRotate: false,
      autoRotateSpeed: 0
    }
  },

  sala_gourmet: {
    id: 'sala_gourmet',
    name: 'Sala Gourmet',
    description: 'Foco na área de convivência',
    settings: {
      position: { x: 4.8, y: 3.0, z: 4.2 },
      target: { x: 0.2, y: 1.0, z: 0.2 },
      fov: 70,
      minZoom: 1,
      maxZoom: 1,
      currentZoom: 1,
      autoRotate: false,
      autoRotateSpeed: 0
    }
  },

  // Presets específicos para banheiros
  banheiro_moderno: {
    id: 'banheiro_moderno',
    name: 'Banheiro Moderno',
    description: 'Vista elegante destacando design moderno',
    settings: {
      position: { x: 3.5, y: 2.5, z: 3.5 },
      target: { x: 0.3, y: 1.0, z: 0.3 },
      fov: 72,
      minZoom: 1,
      maxZoom: 1,
      currentZoom: 1,
      autoRotate: false,
      autoRotateSpeed: 0
    }
  },

  banheiro_rustico: {
    id: 'banheiro_rustico',
    name: 'Banheiro Rústico',
    description: 'Ângulo aconchegante mostrando texturas',
    settings: {
      position: { x: 3.8, y: 2.8, z: 3.2 },
      target: { x: -0.2, y: 0.9, z: 0.2 },
      fov: 74,
      minZoom: 1,
      maxZoom: 1,
      currentZoom: 1,
      autoRotate: false,
      autoRotateSpeed: 0
    }
  },

  banheiro_spa: {
    id: 'banheiro_spa',
    name: 'Banheiro SPA',
    description: 'Vista relaxante do ambiente spa',
    settings: {
      position: { x: 4.0, y: 3.0, z: 3.8 },
      target: { x: 0, y: 1.1, z: 0 },
      fov: 70,
      minZoom: 1,
      maxZoom: 1,
      currentZoom: 1,
      autoRotate: false,
      autoRotateSpeed: 0
    }
  },

  // Presets específicos para quartos
  quarto_suite: {
    id: 'quarto_suite',
    name: 'Quarto Suíte',
    description: 'Visão estática otimizada para quarto suíte',
    settings: {
      position: { x: 4.8, y: 3.2, z: 4.8 },
      target: { x: 0, y: 0.7, z: 0 },
      fov: 75,
      minZoom: 1,
      maxZoom: 1,
      currentZoom: 1,
      autoRotate: false,
      autoRotateSpeed: 0
    }
  },

  quarto_infantil: {
    id: 'quarto_infantil',
    name: 'Quarto Infantil',
    description: 'Visão estática otimizada para quarto infantil',
    settings: {
      position: { x: 4.5, y: 3.0, z: 4.5 },
      target: { x: 0, y: 0.6, z: 0 },
      fov: 75,
      minZoom: 1,
      maxZoom: 1,
      currentZoom: 1,
      autoRotate: false,
      autoRotateSpeed: 0
    }
  },

  quarto_hospede: {
    id: 'quarto_hospede',
    name: 'Quarto de Hóspede',
    description: 'Visão estática otimizada para quarto de hóspede',
    settings: {
      position: { x: 4.5, y: 3.0, z: 4.5 },
      target: { x: 0, y: 0.6, z: 0 },
      fov: 75,
      minZoom: 1,
      maxZoom: 1,
      currentZoom: 1,
      autoRotate: false,
      autoRotateSpeed: 0
    }
  }
};

/**
 * Categorias de presets de câmera por tipo de ambiente
 */
export const CAMERA_CATEGORIES = {
  sala: [
    CAMERA_PRESETS['sala_estar'],
    CAMERA_PRESETS['sala_comercial'],
    CAMERA_PRESETS['sala_gourmet']
  ],
  banheiro: [
    CAMERA_PRESETS['banheiro_moderno'],
    CAMERA_PRESETS['banheiro_rustico'],
    CAMERA_PRESETS['banheiro_spa']
  ],
  quarto: [
    CAMERA_PRESETS['quarto_suite'],
    CAMERA_PRESETS['quarto_infantil'],
    CAMERA_PRESETS['quarto_hospede']
  ]
};