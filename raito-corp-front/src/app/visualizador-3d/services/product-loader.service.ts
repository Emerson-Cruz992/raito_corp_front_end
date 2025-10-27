import { Injectable } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
import { BabylonService } from './babylon.service';
import { MaterialService } from './material.service';
import { Product3D } from '../models/product-3d.interface';

/**
 * Serviço para carregar e gerenciar produtos 3D (luminárias)
 */
@Injectable({
  providedIn: 'root'
})
export class ProductLoaderService {
  private loadedProducts: Map<string, BABYLON.Mesh> = new Map();
  private productLights: Map<string, BABYLON.Light> = new Map();

  constructor(
    private babylonService: BabylonService,
    private materialService: MaterialService
  ) {}

  /**
   * Carrega um produto 3D na cena
   */
  async loadProduct(product: Product3D): Promise<BABYLON.Mesh | null> {
    const scene = this.babylonService.getScene();
    if (!scene) {
      console.error('Cena não inicializada');
      return null;
    }

    try {
      let mesh: BABYLON.Mesh;

      // Se for um arquivo GLB/GLTF, carregar de URL
      if (product.modelPath && product.modelPath.endsWith('.glb') || product.modelPath.endsWith('.gltf')) {
        mesh = await this.loadGLTFModel(product.modelPath);
      } else {
        // Criar geometria padrão se não houver modelo
        mesh = this.createDefaultProductGeometry(product);
      }

      // Aplicar transformações
      mesh.name = product.id;
      mesh.position = new BABYLON.Vector3(
        product.position.x,
        product.position.y,
        product.position.z
      );

      mesh.scaling = new BABYLON.Vector3(product.scale, product.scale, product.scale);

      mesh.rotation = new BABYLON.Vector3(
        product.rotation.x,
        product.rotation.y,
        product.rotation.z
      );

      // Aplicar material
      const material = this.materialService.getCustomPBRMaterial(
        'product-' + product.id,
        product.material.baseColor,
        product.material.roughness,
        product.material.metallic
      );
      mesh.material = material;

      // Habilitar sombras
      mesh.receiveShadows = true;

      // Se for uma luminária, criar luz associada
      if (product.emitsLight && product.lightProperties) {
        this.attachLightToProduct(product, mesh);
      }

      // Armazenar referência
      this.loadedProducts.set(product.id, mesh);

      return mesh;
    } catch (error) {
      console.error(`Erro ao carregar produto ${product.id}:`, error);
      return null;
    }
  }

  /**
   * Carrega modelo GLTF/GLB
   */
  private async loadGLTFModel(modelPath: string): Promise<BABYLON.Mesh> {
    const scene = this.babylonService.getScene();
    if (!scene) throw new Error('Cena não inicializada');

    const result = await BABYLON.SceneLoader.ImportMeshAsync(
      '',
      '',
      modelPath,
      scene
    );

    // Retornar a primeira mesh (ou combinar todas)
    if (result.meshes.length > 0) {
      const parentMesh = new BABYLON.Mesh('product-parent', scene);

      for (const mesh of result.meshes) {
        if (mesh instanceof BABYLON.AbstractMesh) {
          mesh.parent = parentMesh;
        }
      }

      return parentMesh;
    }

    throw new Error('Nenhuma mesh foi carregada do arquivo');
  }

  /**
   * Cria geometria padrão para produto
   */
  private createDefaultProductGeometry(product: Product3D): BABYLON.Mesh {
    const scene = this.babylonService.getScene();
    if (!scene) throw new Error('Cena não inicializada');

    // Criar um cilindro simples como placeholder
    const mesh = BABYLON.MeshBuilder.CreateCylinder(
      'product-' + product.id,
      {
        height: 1,
        diameter: 0.3
      },
      scene
    );

    return mesh;
  }

  /**
   * Anexa uma luz ao produto (para luminárias)
   */
  private attachLightToProduct(product: Product3D, mesh: BABYLON.Mesh): void {
    if (!product.lightProperties) return;

    const lightProps = product.lightProperties;
    const lightColor = this.hexToColor3(lightProps.color);

    // Criar luz pontual
    const light = this.babylonService.createPointLight(
      'light-' + product.id,
      mesh.position,
      lightProps.intensity,
      lightProps.range,
      lightColor
    );

    // Anexar luz à mesh para que se mova com ela
    light.parent = mesh;

    this.productLights.set(product.id, light);
  }

  /**
   * Remove um produto da cena
   */
  removeProduct(productId: string): void {
    const mesh = this.loadedProducts.get(productId);
    if (mesh) {
      mesh.dispose();
      this.loadedProducts.delete(productId);
    }

    const light = this.productLights.get(productId);
    if (light) {
      light.dispose();
      this.productLights.delete(productId);
    }
  }

  /**
   * Limpa todos os produtos
   */
  clearProducts(): void {
    for (const mesh of this.loadedProducts.values()) {
      mesh.dispose();
    }
    this.loadedProducts.clear();

    for (const light of this.productLights.values()) {
      light.dispose();
    }
    this.productLights.clear();
  }

  /**
   * Retorna produto carregado
   */
  getProduct(productId: string): BABYLON.Mesh | null {
    return this.loadedProducts.get(productId) || null;
  }

  /**
   * Lista todos os produtos carregados
   */
  getLoadedProducts(): BABYLON.Mesh[] {
    return Array.from(this.loadedProducts.values());
  }

  /**
   * Atualiza a intensidade de luz de um produto
   */
  updateProductLightIntensity(productId: string, intensity: number): void {
    const light = this.productLights.get(productId);
    if (light) {
      light.intensity = intensity;
    }
  }

  /**
   * Atualiza a cor de luz de um produto
   */
  updateProductLightColor(productId: string, hexColor: string): void {
    const light = this.productLights.get(productId);
    if (light) {
      const color = this.hexToColor3(hexColor);
      light.diffuse = color;
      light.specular = color;
    }
  }

  /**
   * Converte hex para Color3
   */
  private hexToColor3(hexColor: string): BABYLON.Color3 {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    return new BABYLON.Color3(r, g, b);
  }
}