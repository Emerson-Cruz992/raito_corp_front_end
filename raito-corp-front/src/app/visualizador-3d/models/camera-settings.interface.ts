/**
 * Configuração de câmera para o visualizador
 */
export interface CameraSettings {
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  fov: number; // Field of View em graus
  minZoom: number;
  maxZoom: number;
  currentZoom: number;
  autoRotate: boolean;
  autoRotateSpeed: number;
}

/**
 * Preset de câmera predefinido
 */
export interface CameraPreset {
  id: string;
  name: string;
  description: string;
  settings: CameraSettings;
  icon?: string;
}