import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { ThreeService } from './three.service';

/**
 * Serviço de materiais para Three.js
 * Usa MeshStandardMaterial para PBR otimizado
 */
@Injectable({
  providedIn: 'root'
})
export class ThreeMaterialService {
  private materials: Map<string, THREE.Material> = new Map();

  private materialConfigs = {
    wall: { roughness: 0.7, metalness: 0 },
    wood: { roughness: 0.6, metalness: 0 },
    wood_floor: { roughness: 0.4, metalness: 0 },
    wood_frame: { roughness: 0.6, metalness: 0 },
    ceramic: { roughness: 0.2, metalness: 0 },
    marble: { roughness: 0.15, metalness: 0 },
    glass: { roughness: 0.05, metalness: 0, transparent: true, opacity: 0.3 },
    metal: { roughness: 0.3, metalness: 0.9 },
    fabric: { roughness: 0.9, metalness: 0 },
    plastic: { roughness: 0.5, metalness: 0 },
    stone: { roughness: 0.8, metalness: 0 },
    plaster: { roughness: 0.7, metalness: 0 }
  };

  constructor(private threeService: ThreeService) {}

  /**
   * Obtém ou cria um material
   */
  getMaterial(materialType: string, colorHex: string): THREE.Material {
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
   * Cria um material baseado no tipo e cor
   */
  private createMaterial(materialType: string, colorHex: string): THREE.Material {
    const config = this.materialConfigs[materialType as keyof typeof this.materialConfigs];

    if (!config) {
      console.warn(`Tipo de material desconhecido: ${materialType}, usando padrão`);
      return new THREE.MeshStandardMaterial({
        color: this.hexToNumber(colorHex),
        roughness: 0.5,
        metalness: 0
      });
    }

    const material = new THREE.MeshStandardMaterial({
      color: this.hexToNumber(colorHex),
      roughness: config.roughness,
      metalness: config.metalness,
      envMapIntensity: 0.5
    });

    // Configurações especiais para vidro
    if ('transparent' in config) {
      material.transparent = true;
      material.opacity = config.opacity || 1.0;
    }

    return material;
  }

  /**
   * Cria um material emissor de luz
   */
  createEmissiveMaterial(colorHex: string, intensity: number = 1): THREE.Material {
    const color = this.hexToNumber(colorHex);

    return new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: intensity,
      roughness: 0.5,
      metalness: 0
    });
  }

  /**
   * Cria um material de vidro transparente
   */
  createGlassMaterial(colorHex: string): THREE.Material {
    return new THREE.MeshPhysicalMaterial({
      color: this.hexToNumber(colorHex),
      metalness: 0,
      roughness: 0.05,
      transmission: 0.9,
      thickness: 0.5,
      transparent: true,
      opacity: 0.3
    });
  }

  /**
   * Cria um material de metal polido
   */
  createPolishedMetalMaterial(colorHex: string): THREE.Material {
    return new THREE.MeshStandardMaterial({
      color: this.hexToNumber(colorHex),
      roughness: 0.2,
      metalness: 0.95,
      envMapIntensity: 1.0
    });
  }

  /**
   * Limpa todos os materiais
   */
  clearMaterials(): void {
    for (const material of this.materials.values()) {
      material.dispose();
    }
    this.materials.clear();
  }

  /**
   * Converte hex para number
   */
  private hexToNumber(hex: string): number {
    return parseInt(hex.replace('#', '0x'), 16);
  }
}
