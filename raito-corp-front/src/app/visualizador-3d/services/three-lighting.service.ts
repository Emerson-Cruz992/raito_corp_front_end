import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { ThreeService } from './three.service';
import { LIGHTING_PRESETS } from '../configs/lighting-presets';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Serviço de iluminação para Three.js
 * Otimizado para performance
 */
@Injectable({
  providedIn: 'root'
})
export class ThreeLightingService {
  private lights: THREE.Light[] = [];
  private lightingState$ = new BehaviorSubject<any>(null);

  constructor(private threeService: ThreeService) {}

  /**
   * Obtém o estado da iluminação
   */
  getLightingState$(): Observable<any> {
    return this.lightingState$.asObservable();
  }

  /**
   * Aplica um preset de iluminação
   */
  applyPreset(presetId: string): void {
    const preset = LIGHTING_PRESETS[presetId];
    if (!preset) {
      console.error(`Preset de iluminação não encontrado: ${presetId}`);
      return;
    }

    // Remover luzes antigas
    this.clearLights();

    const scene = this.threeService.getScene();
    if (!scene) return;

    // Adicionar luz ambiente
    const ambientLight = new THREE.AmbientLight(0xffffff, preset.ambientIntensity);
    scene.add(ambientLight);
    this.lights.push(ambientLight);

    // Criar cada luz do preset
    for (const lightConfig of preset.lights) {
      let light: THREE.Light | null = null;

      const color = this.hexToNumber(lightConfig.color);
      const position = new THREE.Vector3(
        lightConfig.position.x,
        lightConfig.position.y,
        lightConfig.position.z
      );

      switch (lightConfig.type) {
        case 'directional':
          const dirLight = this.threeService.createDirectionalLight(
            position,
            color,
            lightConfig.intensity,
            lightConfig.shadowMap || false
          );

          if (lightConfig.direction) {
            const target = new THREE.Object3D();
            target.position.set(
              position.x + lightConfig.direction.x * 10,
              position.y + lightConfig.direction.y * 10,
              position.z + lightConfig.direction.z * 10
            );
            scene.add(target);
            dirLight.target = target;
          }

          light = dirLight;
          break;

        case 'point':
          light = this.threeService.createPointLight(
            position,
            color,
            lightConfig.intensity,
            lightConfig.range || 0
          );
          break;

        case 'spot':
          const targetPos = new THREE.Vector3(
            position.x + (lightConfig.direction?.x || 0) * 5,
            position.y + (lightConfig.direction?.y || -1) * 5,
            position.z + (lightConfig.direction?.z || 0) * 5
          );

          light = this.threeService.createSpotLight(
            position,
            targetPos,
            color,
            lightConfig.intensity,
            lightConfig.spotlight?.angle || Math.PI / 4,
            lightConfig.range || 0
          );

          scene.add((light as THREE.SpotLight).target);
          break;
      }

      if (light) {
        scene.add(light);
        this.lights.push(light);
      }
    }

    // Atualizar estado
    this.lightingState$.next({
      presetId,
      preset,
      lightCount: this.lights.length
    });
  }

  /**
   * Remove todas as luzes
   */
  private clearLights(): void {
    const scene = this.threeService.getScene();
    if (!scene) return;

    for (const light of this.lights) {
      scene.remove(light);

      // Remover targets de spotlights
      if (light instanceof THREE.SpotLight && light.target) {
        scene.remove(light.target);
      }
    }

    this.lights = [];
  }

  /**
   * Retorna todas as luzes ativas
   */
  getLights(): THREE.Light[] {
    return this.lights;
  }

  /**
   * Converte hex para number
   */
  private hexToNumber(hex: string): number {
    return parseInt(hex.replace('#', '0x'), 16);
  }
}
