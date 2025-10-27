import { Injectable } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CameraSettings } from '../models/camera-settings.interface';
import { CAMERA_PRESETS } from '../configs/camera-presets';
import { BabylonService } from './babylon.service';

/**
 * Serviço para gerenciar câmera e controles
 * Responsável por orbit camera e presets de visualização
 */
@Injectable({
  providedIn: 'root'
})
export class CameraControlService {
  private camera: BABYLON.ArcRotateCamera | null = null;
  private cameraSettings$ = new BehaviorSubject<CameraSettings | null>(null);
  private autoRotateInterval: any = null;

  constructor(private babylonService: BabylonService) {}

  /**
   * Obtém as configurações de câmera como observável
   */
  getCameraSettings$(): Observable<CameraSettings | null> {
    return this.cameraSettings$.asObservable();
  }

  /**
   * Inicializa a câmera com posição estática (sem controles de usuário)
   */
  initializeCamera(): void {
    const preset = CAMERA_PRESETS['default'];

    // Criar câmera
    const target = new BABYLON.Vector3(
      preset.settings.target.x,
      preset.settings.target.y,
      preset.settings.target.z
    );

    // Calcular corretamente as coordenadas esféricas
    const dx = preset.settings.position.x - target.x;
    const dy = preset.settings.position.y - target.y;
    const dz = preset.settings.position.z - target.z;
    
    const radius = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const alpha = Math.atan2(dz, dx);
    
    // Clamp dy/radius para evitar erros numéricos em acos
    const clampedRatio = Math.max(-1, Math.min(1, dy / radius));
    const beta = Math.acos(clampedRatio);
    
    console.debug('Camera init - alpha:', alpha, 'beta:', beta, 'radius:', radius, 'target:', target);

    this.camera = this.babylonService.createStaticCamera(
      'camera',
      alpha,
      beta,
      radius,
      target
    );

    // Aplicar configurações
    this.applySettings(preset.settings);

    // Atualizar estado
    this.cameraSettings$.next(preset.settings);
  }

  /**
   * Aplica um preset de câmera
   */
  applyPreset(presetId: string): void {
    const preset = CAMERA_PRESETS[presetId];

    if (!preset || !this.camera) {
      console.error(`Preset de câmera não encontrado: ${presetId}`);
      return;
    }

    // Parar rotação automática anterior
    this.stopAutoRotate();

    // Aplicar configurações
    this.applySettings(preset.settings);

    // Animar para nova posição
    this.animateCameraToPreset(preset.settings);

    // Iniciar rotação se habilitada
    if (preset.settings.autoRotate) {
      this.startAutoRotate(preset.settings.autoRotateSpeed);
    }

    // Atualizar estado
    this.cameraSettings$.next(preset.settings);
  }

  /**
   * Aplica configurações à câmera
   */
  private applySettings(settings: CameraSettings): void {
    if (!this.camera) return;

    this.camera.fov = settings.fov;
    this.camera.lowerRadiusLimit = settings.minZoom;
    this.camera.upperRadiusLimit = settings.maxZoom;
    this.camera.inertia = 0.7;
    this.camera.angularSensibilityX = 1000;
    this.camera.angularSensibilityY = 1000;
    
    // Garantir limites de beta para evitar câmera de cabeça para baixo
    this.camera.lowerBetaLimit = 0.1;
    this.camera.upperBetaLimit = Math.PI - 0.1;
  }

  /**
   * Anima a câmera para um novo preset
   */
  private animateCameraToPreset(settings: CameraSettings): void {
    if (!this.camera) return;

    // Novo alvo
    const newTarget = new BABYLON.Vector3(
      settings.target.x,
      settings.target.y,
      settings.target.z
    );

    // Calcular coordenadas esféricas para a nova posição
    const dx = settings.position.x - newTarget.x;
    const dy = settings.position.y - newTarget.y;
    const dz = settings.position.z - newTarget.z;
    
    const newRadius = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const newAlpha = Math.atan2(dz, dx);
    
    // Clamp dy/radius para evitar erros numéricos em acos
    const clampedRatio = Math.max(-1, Math.min(1, dy / newRadius));
    const newBeta = Math.acos(clampedRatio);
    
    // Validar que newBeta está dentro dos limites seguros
    const safeBeta = Math.max(0.1, Math.min(Math.PI - 0.1, newBeta));
    
    console.debug('Camera animation - alpha:', newAlpha, 'beta:', safeBeta, 'radius:', newRadius);

    // Animar alvo
    BABYLON.Animation.CreateAndStartAnimation(
      'cameraMoveTarget',
      this.camera,
      'target',
      60,
      60,
      this.camera.target,
      newTarget
    );

    // Animar coordenadas esféricas
    BABYLON.Animation.CreateAndStartAnimation(
      'cameraAlpha',
      this.camera,
      'alpha',
      60,
      60,
      this.camera.alpha,
      newAlpha
    );

    BABYLON.Animation.CreateAndStartAnimation(
      'cameraBeta',
      this.camera,
      'beta',
      60,
      60,
      this.camera.beta,
      safeBeta
    );

    BABYLON.Animation.CreateAndStartAnimation(
      'cameraRadius',
      this.camera,
      'radius',
      60,
      60,
      this.camera.radius,
      newRadius
    );
  }

  /**
   * Inicia rotação automática
   */
  private startAutoRotate(speed: number): void {
    if (!this.camera) return;

    this.autoRotateInterval = setInterval(() => {
      if (this.camera) {
        this.camera.alpha += speed * 0.016; // ~60 FPS
      }
    }, 16);
  }

  /**
   * Para rotação automática
   */
  private stopAutoRotate(): void {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
      this.autoRotateInterval = null;
    }
  }

  /**
   * Faz zoom em direção ao alvo
   */
  zoomIn(amount: number = 1): void {
    if (this.camera) {
      const lowerLimit = this.camera.lowerRadiusLimit ?? 0;
      this.camera.radius = Math.max(
        lowerLimit,
        this.camera.radius - amount
      );
    }
  }

  /**
   * Faz zoom para longe do alvo
   */
  zoomOut(amount: number = 1): void {
    if (this.camera) {
      const upperLimit = this.camera.upperRadiusLimit ?? 1000;
      this.camera.radius = Math.min(
        upperLimit,
        this.camera.radius + amount
      );
    }
  }

  /**
   * Define o zoom
   */
  setZoom(zoom: number): void {
    if (this.camera) {
      const lowerLimit = this.camera.lowerRadiusLimit ?? 0;
      const upperLimit = this.camera.upperRadiusLimit ?? 1000;
      this.camera.radius = BABYLON.Scalar.Clamp(
        zoom,
        lowerLimit,
        upperLimit
      );
    }
  }

  /**
   * Obtém o zoom atual
   */
  getZoom(): number {
    if (!this.camera) return 1;
    return this.camera.radius;
  }

  /**
   * Define o alvo da câmera
   */
  setTarget(x: number, y: number, z: number): void {
    if (this.camera) {
      this.camera.target = new BABYLON.Vector3(x, y, z);
    }
  }

  /**
   * Obtém o alvo atual
   */
  getTarget(): BABYLON.Vector3 | null {
    return this.camera?.target || null;
  }

  /**
   * Obtém a posição atual da câmera
   */
  getPosition(): BABYLON.Vector3 | null {
    return this.camera?.position || null;
  }

  /**
   * Retorna a câmera
   */
  getCamera(): BABYLON.ArcRotateCamera | null {
    return this.camera;
  }

  /**
   * Limpa controles de câmera
   */
  dispose(): void {
    this.stopAutoRotate();
    if (this.camera) {
      this.camera.detachControl();
    }
  }
}