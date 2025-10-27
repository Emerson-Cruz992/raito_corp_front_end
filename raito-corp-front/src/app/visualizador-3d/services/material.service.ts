import { Injectable } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
import { BabylonService } from './babylon.service';

/**
 * Serviço para gerenciar materiais realistas
 * Utiliza PBR para renderização fisicamente baseada
 */
@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private materials: Map<string, BABYLON.Material> = new Map();
  private materialConfigs = {
    wall: { roughness: 0.3, metallic: 0 },
    wood: { roughness: 0.4, metallic: 0 },
    ceramic: { roughness: 0.2, metallic: 0 },
    ceramic_tile: { roughness: 0.25, metallic: 0 },
    marble: { roughness: 0.15, metallic: 0 },
    glass: { roughness: 0.05, metallic: 0 },
    metal: { roughness: 0.3, metallic: 0.8 },
    fabric: { roughness: 0.7, metallic: 0 },
    plastic: { roughness: 0.5, metallic: 0 },
    stone: { roughness: 0.6, metallic: 0 },
    wood_frame: { roughness: 0.5, metallic: 0 },
    wood_beam: { roughness: 0.5, metallic: 0 },
    stone_wall: { roughness: 0.7, metallic: 0 },
    river_stone: { roughness: 0.65, metallic: 0 },
    wood_floor: { roughness: 0.4, metallic: 0 },
    plaster: { roughness: 0.4, metallic: 0 },
    false_ceiling: { roughness: 0.35, metallic: 0 },
    copper: { roughness: 0.4, metallic: 0.9 },
    stone_frame: { roughness: 0.65, metallic: 0 },
    wooden_floor: { roughness: 0.4, metallic: 0 }
  };

  constructor(private babylonService: BabylonService) {}

  /**
   * Obtém ou cria um material
   */
  getMaterial(materialType: string, colorHex: string): BABYLON.Material {
    const materialKey = `${materialType}_${colorHex}`;

    // Retornar se já existe
    if (this.materials.has(materialKey)) {
      return this.materials.get(materialKey)!;
    }

    // Criar novo material
    const material = this.createMaterial(materialType, colorHex);
    this.materials.set(materialKey, material);

    return material;
  }

  /**
   * Cria um novo material baseado no tipo e cor
   */
  private createMaterial(materialType: string, colorHex: string): BABYLON.Material {
    const color = this.hexToColor3(colorHex);
    const config = this.materialConfigs[materialType as keyof typeof this.materialConfigs];

    if (!config) {
      console.warn(`Tipo de material desconhecido: ${materialType}`);
      return this.createDefaultMaterial(color);
    }

    // Criar material PBR com propriedades realistas
    return this.babylonService.createPBRMaterial(
      `${materialType}_${colorHex}`,
      color,
      config.roughness,
      config.metallic
    );
  }

  /**
   * Cria um material padrão
   */
  private createDefaultMaterial(color: BABYLON.Color3): BABYLON.Material {
    return this.babylonService.createPBRMaterial('default', color, 0.5, 0);
  }

  /**
   * Cria um material de parede com textura
   */
  createWallMaterial(colorHex: string): BABYLON.Material {
    const color = this.hexToColor3(colorHex);
    const material = this.babylonService.createPBRMaterial('wall-' + colorHex, color, 0.3, 0);

    return material;
  }

  /**
   * Cria um material de espelho
   */
  createMirrorMaterial(colorHex: string): BABYLON.Material {
    return this.babylonService.createMirrorMaterial('mirror-' + colorHex);
  }

  /**
   * Cria um material de vidro
   */
  createGlassMaterial(colorHex: string): BABYLON.Material {
    const scene = this.babylonService.getScene();
    if (!scene) return this.createDefaultMaterial(new BABYLON.Color3(1, 1, 1));

    const material = new BABYLON.PBRMetallicRoughnessMaterial('glass-' + colorHex, scene);

    const color = this.hexToColor3(colorHex);
    material.baseColor = color;
    material.metallic = 0;
    material.roughness = 0.05;
    material.alpha = 0.3; // Transparência

    return material;
  }

  /**
   * Cria um material de metal polido
   */
  createPolishedMetalMaterial(colorHex: string): BABYLON.Material {
    const color = this.hexToColor3(colorHex);
    const material = this.babylonService.createPBRMaterial('metal-' + colorHex, color, 0.2, 0.9);

    return material;
  }

  /**
   * Cria um material de madeira
   */
  createWoodMaterial(colorHex: string): BABYLON.Material {
    const color = this.hexToColor3(colorHex);
    const material = this.babylonService.createPBRMaterial('wood-' + colorHex, color, 0.4, 0);

    return material;
  }

  /**
   * Cria um material luminoso/emissive
   */
  createEmissiveMaterial(colorHex: string, emissionIntensity: number = 1): BABYLON.Material {
    const scene = this.babylonService.getScene();
    if (!scene) return this.createDefaultMaterial(new BABYLON.Color3(1, 1, 1));

    const color = this.hexToColor3(colorHex);
    const material = this.babylonService.createPBRMaterial('emissive-' + colorHex, color, 0.5, 0);

    // Adicionar emissão (para luminárias que emitem luz)
    (material as any).emissiveColor = color.scale(emissionIntensity);

    return material;
  }

  /**
   * Limpa todos os materiais armazenados
   */
  clearMaterials(): void {
    for (const material of this.materials.values()) {
      material.dispose();
    }
    this.materials.clear();
  }

  /**
   * Converte hexadecimal para Color3
   */
  private hexToColor3(hexColor: string): BABYLON.Color3 {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    return new BABYLON.Color3(r, g, b);
  }

  /**
   * Obtém material PBR com configuração customizada
   */
  getCustomPBRMaterial(
    name: string,
    baseColor: string,
    roughness: number,
    metallic: number
  ): BABYLON.Material {
    const color = this.hexToColor3(baseColor);
    return this.babylonService.createPBRMaterial(name, color, roughness, metallic);
  }
}