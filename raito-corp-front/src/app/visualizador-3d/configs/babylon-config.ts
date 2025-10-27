export const BabylonConfig = {
  // Configurações do Engine - Otimizado para performance
  engine: {
    antialias: true,
    adaptToDeviceRatio: true,
    powerPreference: 'high-performance' as WebGLPowerPreference,
    stencil: false,
    preserveDrawingBuffer: false,
    failIfMajorPerformanceCaveat: false
  },

  // Configurações da Cena - Ambiente noturno
  scene: {
    clearColor: [0.05, 0.05, 0.1, 1.0] as [number, number, number, number],
    ambientColor: [0.1, 0.1, 0.15] as [number, number, number],
    gravity: [0, -9.81, 0] as [number, number, number],
    usePhysics: false,
    useRightHandedSystem: false
  },

  // Configurações de Performance - Otimizadas
  performance: {
    maxTextureSize: 1024,
    lodEnabled: true,
    frustumCulling: true,
    occlusionCulling: false,
    maxLights: 4,
    shadowMapSize: 512
  },

  // Configurações de Debug
  debug: {
    showFPS: false,
    showInspector: false,
    logLevel: 'warn' as 'none' | 'error' | 'warn' | 'info' | 'debug'
  }
};