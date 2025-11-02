import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { ThreeService } from './three.service';
import { ThreeMaterialService } from './three-material.service';
import { ENVIRONMENT_PRESETS } from '../configs/environment-configs';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Serviço de ambiente para Three.js
 */
@Injectable({
  providedIn: 'root'
})
export class ThreeEnvironmentService {
  private environmentObjects: THREE.Object3D[] = [];
  private environmentState$ = new BehaviorSubject<any>(null);

  constructor(
    private threeService: ThreeService,
    private materialService: ThreeMaterialService
  ) {}

  /**
   * Obtém o estado do ambiente
   */
  getEnvironmentState$(): Observable<any> {
    return this.environmentState$.asObservable();
  }

  /**
   * Carrega um ambiente
   */
  loadEnvironment(environmentId: string): void {
    const preset = ENVIRONMENT_PRESETS[environmentId];
    if (!preset) {
      console.error(`Ambiente não encontrado: ${environmentId}`);
      return;
    }

    // Limpar ambiente anterior
    this.clearEnvironment();

    const scene = this.threeService.getScene();
    if (!scene) return;

    const geometry = preset.geometry;

    // Criar piso
    this.createFloor(geometry.floor);

    // Criar paredes
    this.createWalls(geometry.walls);

    // Criar teto
    this.createCeiling(geometry.ceiling);

    // Criar objetos
    if (geometry.objects) {
      for (const obj of geometry.objects) {
        this.createObject(obj);
      }
    }

    // Atualizar estado
    this.environmentState$.next({
      environmentId,
      preset
    });
  }

  /**
   * Cria o piso
   */
  private createFloor(floorConfig: any): void {
    const scene = this.threeService.getScene();
    if (!scene) return;

    const material = this.materialService.getMaterial(floorConfig.material, floorConfig.color);
    const floor = this.threeService.createPlane(floorConfig.width, floorConfig.depth, material);

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;

    scene.add(floor);
    this.environmentObjects.push(floor);
  }

  /**
   * Cria as paredes
   */
  private createWalls(wallConfig: any): void {
    const scene = this.threeService.getScene();
    if (!scene) return;

    const material = this.materialService.getMaterial(wallConfig.material, wallConfig.color);

    // Parede frontal
    const wallFront = this.threeService.createBox(wallConfig.width, wallConfig.height, 0.1, material);
    wallFront.position.set(0, wallConfig.height / 2, wallConfig.depth / 2);
    scene.add(wallFront);
    this.environmentObjects.push(wallFront);

    // Parede traseira
    const wallBack = this.threeService.createBox(wallConfig.width, wallConfig.height, 0.1, material);
    wallBack.position.set(0, wallConfig.height / 2, -wallConfig.depth / 2);
    scene.add(wallBack);
    this.environmentObjects.push(wallBack);

    // Parede esquerda
    const wallLeft = this.threeService.createBox(0.1, wallConfig.height, wallConfig.depth, material);
    wallLeft.position.set(-wallConfig.width / 2, wallConfig.height / 2, 0);
    scene.add(wallLeft);
    this.environmentObjects.push(wallLeft);

    // Parede direita
    const wallRight = this.threeService.createBox(0.1, wallConfig.height, wallConfig.depth, material);
    wallRight.position.set(wallConfig.width / 2, wallConfig.height / 2, 0);
    scene.add(wallRight);
    this.environmentObjects.push(wallRight);
  }

  /**
   * Cria o teto
   */
  private createCeiling(ceilingConfig: any): void {
    const scene = this.threeService.getScene();
    if (!scene) return;

    const material = this.materialService.getMaterial(ceilingConfig.material, ceilingConfig.color);
    const ceiling = this.threeService.createPlane(ceilingConfig.width, ceilingConfig.depth, material);

    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 2.8;

    scene.add(ceiling);
    this.environmentObjects.push(ceiling);
  }

  /**
   * Cria um objeto no ambiente
   */
  private createObject(objConfig: any): void {
    const scene = this.threeService.getScene();
    if (!scene) return;

    let mesh: THREE.Mesh | THREE.Group;
    const material = this.materialService.getMaterial(
      objConfig.material || 'wood',
      objConfig.color || '#8B7355'
    );

    // Criar geometria baseada no tipo
    switch (objConfig.type) {
      case 'sofa':
        mesh = this.createSofa(material);
        break;

      case 'table':
        mesh = this.createTable(material);
        break;

      case 'small_table':
        mesh = this.createTable(material, 0.5);
        break;

      case 'chair':
        mesh = this.createChair(material);
        break;

      case 'shelf':
        mesh = this.createShelf(material);
        break;

      case 'cabinet':
      case 'drawer':
        mesh = this.createCabinet(material);
        break;

      case 'tv':
      case 'monitor':
        mesh = this.createMonitor(material);
        break;

      case 'plant':
        mesh = this.createPlant();
        break;

      case 'decoration':
      default:
        // Caixa genérica
        mesh = this.threeService.createBox(0.5, 0.5, 0.5, material);
        break;
    }

    // Aplicar posição e escala
    mesh.position.set(objConfig.position.x, objConfig.position.y, objConfig.position.z);

    if (objConfig.scale) {
      mesh.scale.set(objConfig.scale.x, objConfig.scale.y, objConfig.scale.z);
    }

    scene.add(mesh);
    this.environmentObjects.push(mesh);
  }

  /**
   * Cria um sofá moderno
   */
  private createSofa(material: THREE.Material): THREE.Group {
    const sofa = new THREE.Group();

    // Assento principal
    const seat = this.threeService.createBox(2.5, 0.4, 1.0, material);
    seat.position.y = 0.4;
    sofa.add(seat);

    // Encosto
    const backrest = this.threeService.createBox(2.5, 0.6, 0.2, material);
    backrest.position.y = 0.7;
    backrest.position.z = -0.4;
    sofa.add(backrest);

    // Braço esquerdo
    const armLeft = this.threeService.createBox(0.2, 0.6, 1.0, material);
    armLeft.position.set(-1.15, 0.6, 0);
    sofa.add(armLeft);

    // Braço direito
    const armRight = this.threeService.createBox(0.2, 0.6, 1.0, material);
    armRight.position.set(1.15, 0.6, 0);
    sofa.add(armRight);

    // Base
    const base = this.threeService.createBox(2.5, 0.1, 1.0, material);
    base.position.y = 0.05;
    sofa.add(base);

    return sofa;
  }

  /**
   * Cria uma mesa (versão otimizada)
   */
  private createTable(material: THREE.Material, scale: number = 1): THREE.Group {
    const table = new THREE.Group();

    // Tampo
    const top = this.threeService.createBox(1.2 * scale, 0.05, 0.8 * scale, material);
    top.position.y = 0.75;
    table.add(top);

    // Pernas (cilindros mais simples - 6 segmentos)
    const legMaterial = material;
    const legGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.75, 6);

    const legPositions = [
      { x: 0.5 * scale, z: 0.35 * scale },
      { x: -0.5 * scale, z: 0.35 * scale },
      { x: 0.5 * scale, z: -0.35 * scale },
      { x: -0.5 * scale, z: -0.35 * scale }
    ];

    legPositions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(pos.x, 0.375, pos.z);
      leg.castShadow = true;
      table.add(leg);
    });

    return table;
  }

  /**
   * Cria uma cadeira (versão otimizada)
   */
  private createChair(material: THREE.Material): THREE.Group {
    const chair = new THREE.Group();

    // Assento
    const seat = this.threeService.createBox(0.5, 0.05, 0.5, material);
    seat.position.y = 0.45;
    chair.add(seat);

    // Encosto
    const backrest = this.threeService.createBox(0.5, 0.5, 0.05, material);
    backrest.position.y = 0.7;
    backrest.position.z = -0.225;
    chair.add(backrest);

    // Pernas (4 segmentos apenas)
    const legGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.45, 4);

    const legPositions = [
      { x: 0.2, z: 0.2 },
      { x: -0.2, z: 0.2 },
      { x: 0.2, z: -0.2 },
      { x: -0.2, z: -0.2 }
    ];

    legPositions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, material);
      leg.position.set(pos.x, 0.225, pos.z);
      leg.castShadow = true;
      chair.add(leg);
    });

    return chair;
  }

  /**
   * Cria uma estante
   */
  private createShelf(material: THREE.Material): THREE.Group {
    const shelf = new THREE.Group();

    // Laterais
    const side = this.threeService.createBox(0.05, 1.5, 0.3, material);
    const sideLeft = side.clone();
    sideLeft.position.set(-0.375, 0.75, 0);
    shelf.add(sideLeft);

    const sideRight = side.clone();
    sideRight.position.set(0.375, 0.75, 0);
    shelf.add(sideRight);

    // Prateleiras
    for (let i = 0; i < 4; i++) {
      const shelfPlank = this.threeService.createBox(0.8, 0.02, 0.3, material);
      shelfPlank.position.set(0, 0.4 * i, 0);
      shelf.add(shelfPlank);
    }

    return shelf;
  }

  /**
   * Cria um gaveteiro/armário
   */
  private createCabinet(material: THREE.Material): THREE.Mesh {
    return this.threeService.createBox(0.4, 0.6, 0.4, material);
  }

  /**
   * Cria um monitor/TV
   */
  private createMonitor(material: THREE.Material): THREE.Group {
    const monitor = new THREE.Group();

    // Tela
    const screen = this.threeService.createBox(0.6, 0.4, 0.05, material);
    screen.position.y = 0.2;
    monitor.add(screen);

    // Base
    const baseMaterial = this.materialService.getMaterial('plastic', '#333333');
    const base = this.threeService.createBox(0.15, 0.05, 0.15, baseMaterial);
    base.position.y = 0.025;
    monitor.add(base);

    return monitor;
  }

  /**
   * Cria uma planta (versão super otimizada - 3 folhas)
   */
  private createPlant(): THREE.Group {
    const plant = new THREE.Group();

    // Vaso (menos segmentos)
    const potMaterial = this.materialService.getMaterial('ceramic', '#8B4513');
    const pot = this.threeService.createCylinder(0.15, 0.12, 0.2, potMaterial);
    pot.position.y = 0.1;
    plant.add(pot);

    // Folhas (apenas 3, low-poly)
    const leafMaterial = this.materialService.getMaterial('plastic', '#228B22');

    for (let i = 0; i < 3; i++) {
      const leafGeometry = new THREE.SphereGeometry(0.08, 6, 6); // Low-poly sphere
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);

      const angle = (Math.PI * 2 * i) / 3;
      leaf.position.set(
        Math.cos(angle) * 0.1,
        0.3 + (i * 0.1),
        Math.sin(angle) * 0.1
      );

      leaf.castShadow = true;
      plant.add(leaf);
    }

    return plant;
  }

  /**
   * Limpa o ambiente
   */
  private clearEnvironment(): void {
    const scene = this.threeService.getScene();
    if (!scene) return;

    for (const obj of this.environmentObjects) {
      scene.remove(obj);

      // Limpar geometrias e materiais
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        }
      });
    }

    this.environmentObjects = [];
  }

  /**
   * Retorna objetos do ambiente
   */
  getEnvironmentObjects(): THREE.Object3D[] {
    return this.environmentObjects;
  }
}
