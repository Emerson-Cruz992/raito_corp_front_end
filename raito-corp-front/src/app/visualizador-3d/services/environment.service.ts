import { Injectable } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EnvironmentPreset, EnvironmentState } from '../models/environment.interface';
import { ENVIRONMENT_PRESETS } from '../configs/environment-configs';
import { BabylonService } from './babylon.service';
import { MaterialService } from './material.service';
import { FurnitureModels } from '../models/furniture-models';

/**
 * Serviço para gerenciar ambientes 3D
 * Responsável por criar e configurar os espaços (sala, banheiro, quarto)
 */
@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private environmentState$ = new BehaviorSubject<EnvironmentState | null>(null);
  private environmentMeshes: BABYLON.Mesh[] = [];

  constructor(
    private babylonService: BabylonService,
    private materialService: MaterialService
  ) {}

  /**
   * Obtém o estado do ambiente como observável
   */
  getEnvironmentState$(): Observable<EnvironmentState | null> {
    return this.environmentState$.asObservable();
  }

  /**
   * Carrega um ambiente predefinido
   */
  loadEnvironment(environmentId: string): void {
    const preset = ENVIRONMENT_PRESETS[environmentId];

    if (!preset) {
      console.error(`Ambiente não encontrado: ${environmentId}`);
      return;
    }

    // Limpar ambiente anterior
    this.clearEnvironment();

    // Criar novo ambiente
    this.createEnvironment(preset);

    // Atualizar estado
    this.updateState(preset);
  }

  /**
   * Limpa o ambiente atual
   */
  private clearEnvironment(): void {
    for (const mesh of this.environmentMeshes) {
      mesh.dispose();
    }
    this.environmentMeshes = [];
  }

  /**
   * Cria o ambiente 3D baseado no preset
   */
  private createEnvironment(preset: EnvironmentPreset): void {
    const geometry = preset.geometry;

    // Criar paredes
    this.createWalls(geometry.walls);

    // Criar piso
    this.createFloor(geometry.floor);

    // Criar teto
    this.createCeiling(geometry.ceiling);

    // Criar objetos decorativos
    if (geometry.objects) {
      for (const obj of geometry.objects) {
        this.createObject(obj);
      }
    }
  }

  /**
   * Cria as paredes do ambiente
   */
  private createWalls(wallConfig: any): void {
    const scene = this.babylonService.getScene();
    if (!scene) return;

    const wallMaterial = this.materialService.getMaterial(wallConfig.material, wallConfig.color);

    // Parede frontal
    const wallFront = BABYLON.MeshBuilder.CreateBox(
      'wall-front',
      {
        width: wallConfig.width,
        height: wallConfig.height,
        depth: 0.1
      },
      scene
    );
    wallFront.position.z = wallConfig.depth / 2;
    wallFront.material = wallMaterial;
    this.environmentMeshes.push(wallFront);

    // Parede traseira
    const wallBack = BABYLON.MeshBuilder.CreateBox(
      'wall-back',
      {
        width: wallConfig.width,
        height: wallConfig.height,
        depth: 0.1
      },
      scene
    );
    wallBack.position.z = -(wallConfig.depth / 2);
    wallBack.material = wallMaterial;
    this.environmentMeshes.push(wallBack);

    // Parede esquerda
    const wallLeft = BABYLON.MeshBuilder.CreateBox(
      'wall-left',
      {
        width: 0.1,
        height: wallConfig.height,
        depth: wallConfig.depth
      },
      scene
    );
    wallLeft.position.x = -(wallConfig.width / 2);
    wallLeft.material = wallMaterial;
    this.environmentMeshes.push(wallLeft);

    // Parede direita
    const wallRight = BABYLON.MeshBuilder.CreateBox(
      'wall-right',
      {
        width: 0.1,
        height: wallConfig.height,
        depth: wallConfig.depth
      },
      scene
    );
    wallRight.position.x = wallConfig.width / 2;
    wallRight.material = wallMaterial;
    this.environmentMeshes.push(wallRight);
  }

  /**
   * Cria o piso do ambiente
   */
  private createFloor(floorConfig: any): void {
    const scene = this.babylonService.getScene();
    if (!scene) return;

    const floorMaterial = this.materialService.getMaterial(floorConfig.material, floorConfig.color);

    const floor = BABYLON.MeshBuilder.CreateGround(
      'floor',
      {
        width: floorConfig.width,
        height: floorConfig.depth,
        subdivisions: 50
      },
      scene
    );

    floor.material = floorMaterial;
    floor.position.y = 0;
    floor.receiveShadows = true;

    this.environmentMeshes.push(floor);
  }

  /**
   * Cria o teto do ambiente
   */
  private createCeiling(ceilingConfig: any): void {
    const scene = this.babylonService.getScene();
    if (!scene) return;

    const ceilingMaterial = this.materialService.getMaterial(ceilingConfig.material, ceilingConfig.color);

    const ceiling = BABYLON.MeshBuilder.CreateGround(
      'ceiling',
      {
        width: ceilingConfig.width,
        height: ceilingConfig.depth,
        subdivisions: 30
      },
      scene
    );

    ceiling.material = ceilingMaterial;
    ceiling.position.y = 2.8; // Altura padrão
    ceiling.rotation.z = Math.PI; // Virar para ficar de cabeça para baixo

    this.environmentMeshes.push(ceiling);
  }

  /**
   * Cria objetos decorativos no ambiente
   */
  private createObject(objConfig: any): void {
    const scene = this.babylonService.getScene();
    if (!scene) return;

    const position = new BABYLON.Vector3(objConfig.position.x, objConfig.position.y, objConfig.position.z);
    
    let mesh: BABYLON.Mesh | BABYLON.TransformNode;

    // Criar geometria baseada no tipo usando modelos de móveis
    switch (objConfig.type) {
      case 'sofa':
        mesh = FurnitureModels.createSofa(scene, position);
        break;

      case 'bed':
        mesh = FurnitureModels.createBed(scene, position);
        break;

      case 'minimal_bed':
        mesh = FurnitureModels.createMinimalBed(scene, position);
        break;

      case 'table':
      case 'dining_table':
      case 'nightstand':
        mesh = FurnitureModels.createTable(scene, position, 1.2, 0.8);
        break;

      case 'small_table':
        mesh = FurnitureModels.createTable(scene, position, 0.6, 0.4);
        break;

      case 'chair':
        mesh = FurnitureModels.createChair(scene, position);
        break;

      case 'mirror':
      case 'vanity':
        mesh = FurnitureModels.createMirror(scene, position);
        break;

      case 'sink':
      case 'counter':
      case 'bathtub':
        mesh = FurnitureModels.createSink(scene, position);
        break;

      case 'dresser':
      case 'cabinet':
        mesh = FurnitureModels.createDresser(scene, position);
        break;

      case 'shelf':
        mesh = FurnitureModels.createShelf(scene, position);
        break;

      case 'tv':
        mesh = FurnitureModels.createTV(scene, position);
        break;

      case 'plant':
      case 'decoration':
        mesh = FurnitureModels.createPlant(scene, position);
        break;

      default:
        // Fallback para box genérico
        mesh = BABYLON.MeshBuilder.CreateBox('object-' + objConfig.id, { size: 1 }, scene);
        (mesh as BABYLON.Mesh).position = position;
    }

    // Aplicar escala se fornecida
    if (objConfig.scale) {
      mesh.scaling = new BABYLON.Vector3(objConfig.scale.x, objConfig.scale.y, objConfig.scale.z);
    }

    // Aplicar sombras
    if (mesh instanceof BABYLON.Mesh) {
      mesh.receiveShadows = true;
    } else {
      // Para TransformNode, fazer o mesmo para as submeshes
      const getChildMeshes = (node: BABYLON.TransformNode | BABYLON.Mesh): BABYLON.Mesh[] => {
        const meshes: BABYLON.Mesh[] = [];
        if (node instanceof BABYLON.Mesh) {
          meshes.push(node);
        }
        for (const child of node.getChildren()) {
          if (child instanceof BABYLON.Mesh || child instanceof BABYLON.TransformNode) {
            meshes.push(...getChildMeshes(child as any));
          }
        }
        return meshes;
      };

      getChildMeshes(mesh).forEach(m => {
        m.receiveShadows = true;
      });
    }

    this.environmentMeshes.push(mesh as BABYLON.Mesh);
  }

  /**
   * Atualiza o estado do ambiente
   */
  private updateState(preset: EnvironmentPreset): void {
    const cameraPreset = preset.cameraPresets[0]; // Usar primeira preset por padrão

    const state: EnvironmentState = {
      currentEnvironment: preset,
      cameraPosition: cameraPreset.position,
      cameraTarget: cameraPreset.target
    };

    this.environmentState$.next(state);
  }

  /**
   * Retorna as meshes do ambiente
   */
  getEnvironmentMeshes(): BABYLON.Mesh[] {
    return this.environmentMeshes;
  }

  /**
   * Retorna informações de iluminação recomendada para o ambiente
   */
  getRecommendedLighting(environmentId: string): string {
    const preset = ENVIRONMENT_PRESETS[environmentId];
    return preset?.lightingRecommendation || 'Iluminação padrão recomendada';
  }

  /**
   * Retorna presets de câmera para um ambiente
   */
  getCameraPresets(environmentId: string): any[] {
    const preset = ENVIRONMENT_PRESETS[environmentId];
    return preset?.cameraPresets || [];
  }

  /**
   * Obtém todos os ambientes disponíveis
   */
  getAllEnvironments(): EnvironmentPreset[] {
    return Object.values(ENVIRONMENT_PRESETS);
  }

  /**
   * Obtém ambientes por categoria
   */
  getEnvironmentsByCategory(category: 'sala' | 'banheiro' | 'quarto'): EnvironmentPreset[] {
    return Object.values(ENVIRONMENT_PRESETS).filter(env => env.category === category);
  }
}