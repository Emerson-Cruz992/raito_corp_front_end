import * as BABYLON from '@babylonjs/core';

/**
 * Sistema de modelos 3D procedurais para móveis
 * Cria geometrias realistas de móveis para os ambientes
 */

export class FurnitureModels {
  /**
   * Cria um sofá moderno com geometria mais realista
   */
  static createSofa(scene: BABYLON.Scene, position: BABYLON.Vector3): BABYLON.Mesh {
    const sofaGroup = new BABYLON.TransformNode('sofa', scene);
    sofaGroup.position = position;

    // Base estrutural com cantos arredondados
    const base = BABYLON.MeshBuilder.CreateBox('sofa-base', {
      width: 2.4,
      height: 0.4,
      depth: 0.9
    }, scene);
    base.material = this.createPBRMaterial(scene, 'sofa-fabric', [0.2, 0.2, 0.25], 0.8, 0.1);
    base.parent = sofaGroup;
    base.position.y = 0.2;

    // Encosto com curvatura
    const backrest = BABYLON.MeshBuilder.CreateBox('sofa-backrest', {
      width: 2.4,
      height: 0.8,
      depth: 0.15
    }, scene);
    backrest.material = this.createPBRMaterial(scene, 'sofa-back', [0.25, 0.25, 0.3], 0.7, 0.1);
    backrest.parent = sofaGroup;
    backrest.position.y = 0.6;
    backrest.position.z = -0.375;

    // Braços laterais com design moderno
    for (let side of [-1, 1]) {
      const armrest = BABYLON.MeshBuilder.CreateBox('sofa-arm-' + (side > 0 ? 'r' : 'l'), {
        width: 0.2,
        height: 0.6,
        depth: 0.9
      }, scene);
      armrest.material = this.createPBRMaterial(scene, 'sofa-arm', [0.22, 0.22, 0.27], 0.75, 0.1);
      armrest.parent = sofaGroup;
      armrest.position.x = side * 1.1;
      armrest.position.y = 0.4;
    }

    // Almofadas de assento com formato mais realista
    for (let i = 0; i < 3; i++) {
      const cushion = BABYLON.MeshBuilder.CreateSphere('cushion-' + i, {
        diameterX: 0.7,
        diameterY: 0.2,
        diameterZ: 0.7,
        segments: 16
      }, scene);
      cushion.material = this.createPBRMaterial(scene, 'cushion', [0.3, 0.3, 0.35], 0.6, 0.1);
      cushion.parent = sofaGroup;
      cushion.position.y = 0.5;
      cushion.position.x = -0.8 + i * 0.8;
    }

    // Pés metálicos
    const legPositions = [
      { x: -1.0, z: -0.3 }, { x: 1.0, z: -0.3 },
      { x: -1.0, z: 0.3 }, { x: 1.0, z: 0.3 }
    ];

    legPositions.forEach((pos, idx) => {
      const leg = BABYLON.MeshBuilder.CreateCylinder('sofa-leg-' + idx, {
        diameter: 0.06,
        height: 0.15
      }, scene);
      leg.material = this.createPBRMaterial(scene, 'metal-leg', [0.7, 0.7, 0.7], 0.1, 0.9);
      leg.parent = sofaGroup;
      leg.position.x = pos.x;
      leg.position.z = pos.z;
      leg.position.y = 0.075;
    });

    return sofaGroup as any;
  }

  /**
   * Cria uma cama com colchão, cabeceira e travesseiros
   */
  static createBed(scene: BABYLON.Scene, position: BABYLON.Vector3): BABYLON.Mesh {
    const bedGroup = new BABYLON.TransformNode('bed', scene);
    bedGroup.position = position;

    // Pés da cama (4 cantos)
    const legPositions = [
      { x: -0.65, z: -0.95 },
      { x: 0.65, z: -0.95 },
      { x: -0.65, z: 0.95 },
      { x: 0.65, z: 0.95 }
    ];

    legPositions.forEach((pos, idx) => {
      const leg = BABYLON.MeshBuilder.CreateBox('bed-leg-' + idx, {
        width: 0.1,
        height: 0.3,
        depth: 0.1
      }, scene);
      leg.material = this.getMaterialByColor(scene, '#654321');
      leg.parent = bedGroup;
      leg.position.x = pos.x;
      leg.position.z = pos.z;
      leg.position.y = 0.15;
    });

    // Base/estrutura da cama
    const frame = BABYLON.MeshBuilder.CreateBox('bed-frame', {
      width: 1.4,
      height: 0.1,
      depth: 2.0
    }, scene);
    frame.material = this.getMaterialByColor(scene, '#8B6F47');
    frame.parent = bedGroup;
    frame.position.y = 0.3;

    // Colchão
    const mattress = BABYLON.MeshBuilder.CreateBox('bed-mattress', {
      width: 1.35,
      height: 0.25,
      depth: 1.95
    }, scene);
    mattress.material = this.getMaterialByColor(scene, '#C0C0C0');
    mattress.parent = bedGroup;
    mattress.position.y = 0.525;

    // Lençol/cobertor
    const sheet = BABYLON.MeshBuilder.CreateBox('bed-sheet', {
      width: 1.3,
      height: 0.05,
      depth: 1.4
    }, scene);
    sheet.material = this.getMaterialByColor(scene, '#E8E8E8');
    sheet.parent = bedGroup;
    sheet.position.y = 0.8;
    sheet.position.z = -0.3;

    // Cabeceira
    const headboard = BABYLON.MeshBuilder.CreateBox('bed-headboard', {
      width: 1.45,
      height: 0.8,
      depth: 0.1
    }, scene);
    headboard.material = this.getMaterialByColor(scene, '#8B6F47');
    headboard.parent = bedGroup;
    headboard.position.y = 0.6;
    headboard.position.z = 1.0;

    // Travesseiros (2 unidades)
    for (let i = 0; i < 2; i++) {
      const pillow = BABYLON.MeshBuilder.CreateBox('bed-pillow-' + i, {
        width: 0.5,
        height: 0.2,
        depth: 0.4
      }, scene);
      pillow.material = this.getMaterialByColor(scene, '#F5F5F5');
      pillow.parent = bedGroup;
      pillow.position.y = 0.8;
      pillow.position.x = -0.35 + i * 0.7;
      pillow.position.z = 0.55;
    }

    return bedGroup as any;
  }

  /**
   * Cria uma mesa moderna com design elegante
   */
  static createTable(scene: BABYLON.Scene, position: BABYLON.Vector3, width: number = 1.2, depth: number = 0.8): BABYLON.Mesh {
    const tableGroup = new BABYLON.TransformNode('table', scene);
    tableGroup.position = position;

    // Tampo da mesa com bordas arredondadas
    const top = BABYLON.MeshBuilder.CreateCylinder('table-top', {
      diameterTop: Math.max(width, depth) * 1.1,
      diameterBottom: Math.max(width, depth) * 1.1,
      height: 0.05,
      tessellation: 32
    }, scene);
    top.material = this.createPBRMaterial(scene, 'table-wood', [0.4, 0.3, 0.2], 0.3, 0.0);
    top.parent = tableGroup;
    top.position.y = 0.4;

    // Base central moderna
    const centralBase = BABYLON.MeshBuilder.CreateCylinder('table-base', {
      diameterTop: 0.3,
      diameterBottom: 0.5,
      height: 0.35,
      tessellation: 16
    }, scene);
    centralBase.material = this.createPBRMaterial(scene, 'table-base', [0.15, 0.15, 0.15], 0.2, 0.8);
    centralBase.parent = tableGroup;
    centralBase.position.y = 0.175;

    // Detalhes decorativos no tampo
    const centerDetail = BABYLON.MeshBuilder.CreateCylinder('table-detail', {
      diameter: 0.1,
      height: 0.01,
      tessellation: 16
    }, scene);
    centerDetail.material = this.createPBRMaterial(scene, 'table-accent', [0.6, 0.5, 0.3], 0.1, 0.3);
    centerDetail.parent = tableGroup;
    centerDetail.position.y = 0.43;

    return tableGroup as any;
  }

  /**
   * Cria um espelho de parede/banheiro
   */
  static createMirror(scene: BABYLON.Scene, position: BABYLON.Vector3): BABYLON.Mesh {
    const mirrorGroup = new BABYLON.TransformNode('mirror', scene);
    mirrorGroup.position = position;

    // Marco do espelho
    const frame = BABYLON.MeshBuilder.CreateBox('mirror-frame', {
      width: 0.8,
      height: 1.0,
      depth: 0.05
    }, scene);
    frame.material = this.getMaterialByColor(scene, '#C0C0C0'); // Prata/Cromo
    frame.parent = mirrorGroup;

    // Vidro do espelho
    const glass = BABYLON.MeshBuilder.CreateBox('mirror-glass', {
      width: 0.7,
      height: 0.9,
      depth: 0.02
    }, scene);
    glass.material = this.getMaterialByColor(scene, '#E0E8F0');
    glass.parent = mirrorGroup;
    glass.position.z = 0.02;

    return mirrorGroup as any;
  }

  /**
   * Cria uma pia de banheiro/cozinha
   */
  static createSink(scene: BABYLON.Scene, position: BABYLON.Vector3): BABYLON.Mesh {
    const sinkGroup = new BABYLON.TransformNode('sink', scene);
    sinkGroup.position = position;

    // Gabinete
    const cabinet = BABYLON.MeshBuilder.CreateBox('sink-cabinet', {
      width: 0.6,
      height: 0.6,
      depth: 0.5
    }, scene);
    cabinet.material = this.getMaterialByColor(scene, '#8B7355'); // Madeira clara
    cabinet.parent = sinkGroup;
    cabinet.position.y = 0.3;

    // Tampo
    const countertop = BABYLON.MeshBuilder.CreateBox('sink-counter', {
      width: 0.7,
      height: 0.05,
      depth: 0.6
    }, scene);
    countertop.material = this.getMaterialByColor(scene, '#A0A8B0');
    countertop.parent = sinkGroup;
    countertop.position.y = 0.65;

    // Cuba (parte escavada)
    const basin = BABYLON.MeshBuilder.CreateBox('sink-basin', {
      width: 0.3,
      height: 0.08,
      depth: 0.25
    }, scene);
    basin.material = this.getMaterialByColor(scene, '#C0C8D0');
    basin.parent = sinkGroup;
    basin.position.y = 0.59;

    // Torneira (cilindro)
    const faucet = BABYLON.MeshBuilder.CreateCylinder('sink-faucet', {
      diameter: 0.04,
      height: 0.25
    }, scene);
    faucet.material = this.getMaterialByColor(scene, '#D4D4D4');
    faucet.parent = sinkGroup;
    faucet.position.y = 0.75;

    return sinkGroup as any;
  }

  /**
   * Cria uma poltrona/cadeira
   */
  static createChair(scene: BABYLON.Scene, position: BABYLON.Vector3): BABYLON.Mesh {
    const chairGroup = new BABYLON.TransformNode('chair', scene);
    chairGroup.position = position;

    // Assento
    const seat = BABYLON.MeshBuilder.CreateBox('chair-seat', {
      width: 0.5,
      height: 0.05,
      depth: 0.5
    }, scene);
    seat.material = this.getMaterialByColor(scene, '#6B6B6B');
    seat.parent = chairGroup;
    seat.position.y = 0.35;

    // Encosto
    const back = BABYLON.MeshBuilder.CreateBox('chair-back', {
      width: 0.5,
      height: 0.5,
      depth: 0.1
    }, scene);
    back.material = this.getMaterialByColor(scene, '#5C5C5C');
    back.parent = chairGroup;
    back.position.y = 0.5;
    back.position.z = -0.2;

    // 4 pés
    const legPositions = [
      { x: -0.2, z: -0.2 },
      { x: 0.2, z: -0.2 },
      { x: -0.2, z: 0.2 },
      { x: 0.2, z: 0.2 }
    ];

    legPositions.forEach((pos, idx) => {
      const leg = BABYLON.MeshBuilder.CreateCylinder('chair-leg-' + idx, {
        diameter: 0.04,
        height: 0.35
      }, scene);
      leg.material = this.getMaterialByColor(scene, '#4A4A4A');
      leg.parent = chairGroup;
      leg.position.x = pos.x;
      leg.position.z = pos.z;
      leg.position.y = 0.175;
    });

    return chairGroup as any;
  }

  /**
   * Cria uma cômoda/armário
   */
  static createDresser(scene: BABYLON.Scene, position: BABYLON.Vector3): BABYLON.Mesh {
    const dresserGroup = new BABYLON.TransformNode('dresser', scene);
    dresserGroup.position = position;

    // Pés da cômoda (4 cantos)
    const legPositions = [
      { x: -0.35, z: -0.15 },
      { x: 0.35, z: -0.15 },
      { x: -0.35, z: 0.15 },
      { x: 0.35, z: 0.15 }
    ];

    legPositions.forEach((pos, idx) => {
      const leg = BABYLON.MeshBuilder.CreateBox('dresser-leg-' + idx, {
        width: 0.08,
        height: 0.35,
        depth: 0.08
      }, scene);
      leg.material = this.getMaterialByColor(scene, '#654321');
      leg.parent = dresserGroup;
      leg.position.x = pos.x;
      leg.position.z = pos.z;
      leg.position.y = 0.175;
    });

    // Corpo principal
    const body = BABYLON.MeshBuilder.CreateBox('dresser-body', {
      width: 0.85,
      height: 0.7,
      depth: 0.4
    }, scene);
    body.material = this.getMaterialByColor(scene, '#9B7F57');
    body.parent = dresserGroup;
    body.position.y = 0.35;

    // 3 gavetas com puxadores
    for (let i = 0; i < 3; i++) {
      // Gaveta
      const drawer = BABYLON.MeshBuilder.CreateBox('dresser-drawer-' + i, {
        width: 0.75,
        height: 0.18,
        depth: 0.35
      }, scene);
      drawer.material = this.getMaterialByColor(scene, '#A89070');
      drawer.parent = dresserGroup;
      drawer.position.y = 0.15 + i * 0.22;
      drawer.position.z = -0.02;

      // Puxador (cilindro pequeno)
      const handle = BABYLON.MeshBuilder.CreateCylinder('dresser-handle-' + i, {
        diameter: 0.04,
        height: 0.15
      }, scene);
      handle.material = this.getMaterialByColor(scene, '#C0C0C0');
      handle.parent = dresserGroup;
      handle.position.y = 0.15 + i * 0.22;
      handle.position.z = -0.15;
      handle.rotation.z = Math.PI / 2;
    }

    return dresserGroup as any;
  }

  /**
   * Cria uma cama tipo "tatami" minimalista
   */
  static createMinimalBed(scene: BABYLON.Scene, position: BABYLON.Vector3): BABYLON.Mesh {
    const bedGroup = new BABYLON.TransformNode('minimal-bed', scene);
    bedGroup.position = position;

    // Colchão baixo/futon
    const mattress = BABYLON.MeshBuilder.CreateBox('bed-mattress-minimal', {
      width: 1.4,
      height: 0.15,
      depth: 2.0
    }, scene);
    mattress.material = this.getMaterialByColor(scene, '#9B9B9B');
    mattress.parent = bedGroup;
    mattress.position.y = 0.075;

    // Pés minimalistas (muito baixos)
    const legPositions = [
      { x: -0.65, z: -0.9 },
      { x: 0.65, z: -0.9 },
      { x: -0.65, z: 0.9 },
      { x: 0.65, z: 0.9 }
    ];

    legPositions.forEach((pos, idx) => {
      const leg = BABYLON.MeshBuilder.CreateBox('bed-leg-' + idx, {
        width: 0.06,
        height: 0.05,
        depth: 0.06
      }, scene);
      leg.material = this.getMaterialByColor(scene, '#4A4A4A');
      leg.parent = bedGroup;
      leg.position.x = pos.x;
      leg.position.z = pos.z;
      leg.position.y = 0.025;
    });

    // Almofadas
    const pillow1 = BABYLON.MeshBuilder.CreateBox('minimal-pillow-1', {
      width: 0.35,
      height: 0.1,
      depth: 0.4
    }, scene);
    pillow1.material = this.getMaterialByColor(scene, '#E0E0E0');
    pillow1.parent = bedGroup;
    pillow1.position.y = 0.2;
    pillow1.position.z = 0.7;

    return bedGroup as any;
  }

  /**
   * Cria uma estante/rack de parede
   */
  static createShelf(scene: BABYLON.Scene, position: BABYLON.Vector3): BABYLON.Mesh {
    const shelfGroup = new BABYLON.TransformNode('shelf', scene);
    shelfGroup.position = position;

    // Suportes verticais (2 laterais)
    for (let side of [-1, 1]) {
      const support = BABYLON.MeshBuilder.CreateBox('shelf-support-' + (side > 0 ? 'r' : 'l'), {
        width: 0.08,
        height: 1.3,
        depth: 0.15
      }, scene);
      support.material = this.getMaterialByColor(scene, '#6B5B4B');
      support.parent = shelfGroup;
      support.position.x = side * 0.6;
      support.position.y = 0.65;
    }

    // 3 prateleiras
    for (let i = 0; i < 3; i++) {
      const shelf = BABYLON.MeshBuilder.CreateBox('shelf-board-' + i, {
        width: 1.25,
        height: 0.03,
        depth: 0.3
      }, scene);
      shelf.material = this.getMaterialByColor(scene, '#8B7B6B');
      shelf.parent = shelfGroup;
      shelf.position.y = 0.15 + i * 0.45;
    }

    return shelfGroup as any;
  }

  /**
   * Cria uma televisão/TV na parede
   */
  static createTV(scene: BABYLON.Scene, position: BABYLON.Vector3): BABYLON.Mesh {
    const tvGroup = new BABYLON.TransformNode('tv', scene);
    tvGroup.position = position;

    // Suporte/pé (coluna central)
    const stand = BABYLON.MeshBuilder.CreateBox('tv-stand', {
      width: 0.15,
      height: 0.35,
      depth: 0.15
    }, scene);
    stand.material = this.getMaterialByColor(scene, '#3A3A3A');
    stand.parent = tvGroup;
    stand.position.y = 0.175;

    // Base do suporte
    const standBase = BABYLON.MeshBuilder.CreateBox('tv-stand-base', {
      width: 0.5,
      height: 0.05,
      depth: 0.2
    }, scene);
    standBase.material = this.getMaterialByColor(scene, '#2A2A2A');
    standBase.parent = tvGroup;
    standBase.position.y = 0.025;

    // Marco/borda (preto)
    const frame = BABYLON.MeshBuilder.CreateBox('tv-frame', {
      width: 0.78,
      height: 0.48,
      depth: 0.04
    }, scene);
    frame.material = this.getMaterialByColor(scene, '#1A1A1A');
    frame.parent = tvGroup;
    frame.position.y = 0.3;
    frame.position.z = 0.01;

    // Tela (cinza escuro com brilho)
    const screen = BABYLON.MeshBuilder.CreateBox('tv-screen', {
      width: 0.68,
      height: 0.38,
      depth: 0.02
    }, scene);
    screen.material = this.getMaterialByColor(scene, '#2A2A3A');
    screen.parent = tvGroup;
    screen.position.y = 0.3;
    screen.position.z = 0.015;

    return tvGroup as any;
  }

  /**
   * Cria uma planta/vaso decorativo
   */
  static createPlant(scene: BABYLON.Scene, position: BABYLON.Vector3): BABYLON.Mesh {
    const plantGroup = new BABYLON.TransformNode('plant', scene);
    plantGroup.position = position;

    // Vaso
    const pot = BABYLON.MeshBuilder.CreateCylinder('plant-pot', {
      diameter: 0.2,
      height: 0.25
    }, scene);
    pot.material = this.getMaterialByColor(scene, '#C8956C');
    pot.parent = plantGroup;
    pot.position.y = 0.125;

    // Folhagem (esfera)
    const foliage = BABYLON.MeshBuilder.CreateSphere('plant-foliage', {
      diameter: 0.4,
      segments: 8
    }, scene);
    foliage.material = this.getMaterialByColor(scene, '#4A7C3C');
    foliage.parent = plantGroup;
    foliage.position.y = 0.35;

    return plantGroup as any;
  }

  /**
   * Cria material PBR realista
   */
  private static createPBRMaterial(
    scene: BABYLON.Scene, 
    name: string, 
    baseColor: number[], 
    roughness: number = 0.5, 
    metallic: number = 0.0
  ): BABYLON.PBRMetallicRoughnessMaterial {
    const material = new BABYLON.PBRMetallicRoughnessMaterial(name + '-' + Math.random(), scene);
    material.baseColor = new BABYLON.Color3(baseColor[0], baseColor[1], baseColor[2]);
    material.roughness = roughness;
    material.metallic = metallic;
    (material as any).environmentIntensity = 0.8;
    return material;
  }

  /**
   * Função auxiliar para criar material por cor (fallback)
   */
  private static getMaterialByColor(scene: BABYLON.Scene, color: string): BABYLON.StandardMaterial {
    const material = new BABYLON.StandardMaterial('mat-' + Math.random(), scene);
    material.diffuseColor = BABYLON.Color3.FromHexString(color);
    material.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    material.ambientColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    return material;
  }
}