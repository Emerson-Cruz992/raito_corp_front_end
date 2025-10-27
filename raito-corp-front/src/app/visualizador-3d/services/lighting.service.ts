import { Injectable } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LightingPreset, LightingState, LightConfig } from '../models/lighting-config.interface';
import { LIGHTING_PRESETS } from '../configs/lighting-presets';
import { BabylonService } from './babylon.service';

/**
 * Serviço para gerenciar iluminação da cena
 * Responsável por aplicar presets e ajustes de iluminação em tempo real
 */
@Injectable({
  providedIn: 'root'
})
export class LightingService {
  private lightingState$ = new BehaviorSubject<LightingState | null>(null);
  private lights: Map<string, BABYLON.Light> = new Map();
  private shadowGenerators: Map<string, BABYLON.ShadowGenerator> = new Map();

  constructor(private babylonService: BabylonService) {}

  /**
   * Obtém o estado atual da iluminação como observável
   */
  getLightingState$(): Observable<LightingState | null> {
    return this.lightingState$.asObservable();
  }

  /**
   * Aplica um preset de iluminação à cena
   */
  applyPreset(presetId: string): void {
    const preset = LIGHTING_PRESETS[presetId];

    if (!preset) {
      console.error(`Preset de iluminação não encontrado: ${presetId}`);
      return;
    }

    // Limpar luzes anteriores
    this.clearLights();

    // Aplicar novo preset
    this.applyLightingPreset(preset);

    // Atualizar estado
    this.updateState(preset);
  }

  /**
   * Limpa todas as luzes da cena
   */
  private clearLights(): void {
    const scene = this.babylonService.getScene();
    if (!scene) return;

    // Remover todas as luzes
    for (const light of this.lights.values()) {
      light.dispose();
    }
    this.lights.clear();

    // Remover todos os shadow generators
    for (const shadowGen of this.shadowGenerators.values()) {
      shadowGen.dispose();
    }
    this.shadowGenerators.clear();
  }

  /**
   * Aplica um preset de iluminação
   */
  private applyLightingPreset(preset: LightingPreset): void {
    // Criar cada luz do preset
    for (const lightConfig of preset.lights) {
      this.createLight(lightConfig);
    }

    // Aplicar efeitos adicionais
    this.applyLightingEffects(preset);
  }

  /**
   * Cria uma luz individual baseada na configuração
   */
  private createLight(config: LightConfig): void {
    const scene = this.babylonService.getScene();
    if (!scene) return;

    const position = new BABYLON.Vector3(config.position.x, config.position.y, config.position.z);
    const color = this.hexToColor3(config.color);
    let light: BABYLON.Light | null = null;

    // Criar luz baseada no tipo
    switch (config.type) {
      case 'point':
        light = this.babylonService.createPointLight(
          config.id,
          position,
          config.intensity,
          config.range,
          color
        );
        break;

      case 'directional':
        const direction = config.direction
          ? new BABYLON.Vector3(
              config.direction.x,
              config.direction.y,
              config.direction.z
            )
          : BABYLON.Vector3.Down();

        light = this.babylonService.createDirectionalLight(
          config.id,
          position,
          direction,
          config.intensity,
          color
        );
        break;

      case 'spot':
        if (!config.spotlight) {
          console.warn(`Spotlight ${config.id} sem configuração de spotlight`);
          break;
        }

        const direction2 = config.direction
          ? new BABYLON.Vector3(
              config.direction.x,
              config.direction.y,
              config.direction.z
            )
          : BABYLON.Vector3.Down();

        light = this.babylonService.createSpotlight(
          config.id,
          position,
          direction2,
          config.spotlight.angle,
          config.spotlight.exponent,
          config.intensity,
          config.range,
          color
        );
        break;
    }

    if (light) {
      this.lights.set(config.id, light);

      // Criar sombras se habilitado
      if (config.shadows?.enabled && (light instanceof BABYLON.DirectionalLight || light instanceof BABYLON.SpotLight)) {
        this.createShadowsForLight(config, light as BABYLON.DirectionalLight | BABYLON.SpotLight);
      }
    }
  }

  /**
   * Cria sombras para uma luz
   */
  private createShadowsForLight(
    config: LightConfig,
    light: BABYLON.DirectionalLight | BABYLON.SpotLight
  ): void {
    const scene = this.babylonService.getScene();
    if (!scene) return;

    const shadowGen = this.babylonService.createShadowMap(
      light,
      config.shadows?.mapSize || 2048
    );

    // Adicionar todas as meshes à sombra
    for (const mesh of scene.meshes) {
      if (mesh.name !== 'camera') {
        shadowGen.addShadowCaster(mesh);
      }
    }

    this.shadowGenerators.set(config.id, shadowGen);
  }

  /**
   * Aplica efeitos visuais adicionais do preset
   */
  private applyLightingEffects(preset: LightingPreset): void {
    const scene = this.babylonService.getScene();
    if (!scene) return;

    // Bloom effect
    if (preset.bloomEnabled) {
      this.applyBloomEffect(preset.bloomIntensity, preset.bloomThreshold);
    }

    // Ambient intensity
    const ambientColor = scene.ambientColor;
    scene.ambientColor = new BABYLON.Color3(
      ambientColor.r * preset.ambientIntensity,
      ambientColor.g * preset.ambientIntensity,
      ambientColor.b * preset.ambientIntensity
    );
  }

  /**
   * Aplica efeitos de pós-processamento avançados
   */
  private applyBloomEffect(intensity: number, threshold: number): void {
    const scene = this.babylonService.getScene();
    if (!scene || !scene.activeCamera) return;

    try {
      // Criar pipeline de renderização padrão
      const pipeline = new BABYLON.DefaultRenderingPipeline(
        'defaultPipeline', 
        true, 
        scene, 
        [scene.activeCamera as BABYLON.Camera]
      );

      // Configurar bloom
      pipeline.bloomEnabled = true;
      pipeline.bloomThreshold = threshold;
      pipeline.bloomWeight = intensity;
      pipeline.bloomKernel = 64;
      pipeline.bloomScale = 0.5;

      // Configurar tone mapping para melhor contraste
      pipeline.imageProcessingEnabled = true;
      pipeline.imageProcessing.toneMappingEnabled = true;
      pipeline.imageProcessing.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;
      pipeline.imageProcessing.exposure = 1.0;
      pipeline.imageProcessing.contrast = 1.2;

      // Configurar FXAA para anti-aliasing
      pipeline.fxaaEnabled = true;

      // Configurar sharpening sutil
      pipeline.sharpenEnabled = true;
      pipeline.sharpen.edgeAmount = 0.3;
      pipeline.sharpen.colorAmount = 0.3;

    } catch (error) {
      console.warn('Erro ao aplicar efeitos de pós-processamento:', error);
    }
  }

  /**
   * Atualiza a intensidade de uma luz específica
   */
  updateLightIntensity(lightId: string, intensity: number): void {
    const light = this.lights.get(lightId);
    if (light) {
      light.intensity = intensity;
    }
  }

  /**
   * Atualiza a cor de uma luz específica
   */
  updateLightColor(lightId: string, hexColor: string): void {
    const light = this.lights.get(lightId);
    if (light) {
      const color = this.hexToColor3(hexColor);
      light.diffuse = color;
      light.specular = color;
    }
  }

  /**
   * Atualiza a posição de uma luz pontual ou spotlight
   */
  updateLightPosition(lightId: string, x: number, y: number, z: number): void {
    const light = this.lights.get(lightId);
    if (light && light instanceof BABYLON.PointLight) {
      light.position = new BABYLON.Vector3(x, y, z);
    } else if (light && light instanceof BABYLON.SpotLight) {
      light.position = new BABYLON.Vector3(x, y, z);
    }
  }

  /**
   * Adiciona uma nova luz personalizada à cena
   */
  addCustomLight(config: LightConfig): void {
    this.createLight(config);

    // Atualizar estado
    const currentState = this.lightingState$.value;
    if (currentState) {
      currentState.customLights.push(config);
      currentState.isCustomized = true;
      this.lightingState$.next(currentState);
    }
  }

  /**
   * Remove uma luz da cena
   */
  removeLight(lightId: string): void {
    const light = this.lights.get(lightId);
    if (light) {
      light.dispose();
      this.lights.delete(lightId);
    }

    const shadowGen = this.shadowGenerators.get(lightId);
    if (shadowGen) {
      shadowGen.dispose();
      this.shadowGenerators.delete(lightId);
    }

    // Atualizar estado
    const currentState = this.lightingState$.value;
    if (currentState) {
      currentState.customLights = currentState.customLights.filter(l => l.id !== lightId);
      this.lightingState$.next(currentState);
    }
  }

  /**
   * Converte cor hexadecimal para BABYLON.Color3
   */
  private hexToColor3(hexColor: string): BABYLON.Color3 {
    // Remover '#' se presente
    const hex = hexColor.replace('#', '');

    // Converter hex para RGB (0-1)
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    return new BABYLON.Color3(r, g, b);
  }

  /**
   * Atualiza o estado da iluminação
   */
  private updateState(preset: LightingPreset): void {
    const state: LightingState = {
      currentPreset: preset,
      customLights: [],
      isCustomized: false,
      ambientLight: {
        intensity: preset.ambientIntensity,
        color: '#FFFFFF'
      }
    };

    this.lightingState$.next(state);
  }

  /**
   * Obtém todas as luzes na cena
   */
  getLights(): BABYLON.Light[] {
    return Array.from(this.lights.values());
  }

  /**
   * Obtém informações sobre uma luz específica
   */
  getLightInfo(lightId: string): { light: BABYLON.Light; config: LightConfig } | null {
    const light = this.lights.get(lightId);
    if (!light) return null;

    const scene = this.babylonService.getScene();
    const config: LightConfig = {
      id: lightId,
      type: light instanceof BABYLON.PointLight ? 'point' : 'directional',
      name: light.name,
      position: {
        x: (light as any).position?.x || 0,
        y: (light as any).position?.y || 0,
        z: (light as any).position?.z || 0
      },
      intensity: light.intensity,
      range: (light as any).range || 100,
      color: this.color3ToHex(light.diffuse || new BABYLON.Color3(1, 1, 1))
    };

    return { light, config };
  }

  /**
   * Converte BABYLON.Color3 para hexadecimal
   */
  private color3ToHex(color: BABYLON.Color3): string {
    const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
    const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
    const b = Math.round(color.b * 255).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`.toUpperCase();
  }
}