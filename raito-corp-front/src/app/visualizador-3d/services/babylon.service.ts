import { Injectable } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import { BabylonConfig } from '../configs/babylon-config';

/**
 * Serviço central de gerenciamento do Babylon.js
 * Responsável por criar e configurar a cena 3D com máximo realismo
 */
@Injectable({
  providedIn: 'root'
})
export class BabylonService {
  private engine: BABYLON.Engine | null = null;
  private scene: BABYLON.Scene | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private renderLoop: boolean = false;

  /**
   * Inicializa o engine e a cena do Babylon.js
   */
  initializeEngine(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;

    this.engine = new BABYLON.Engine(
      canvas,
      BabylonConfig.engine.antialias,
      BabylonConfig.engine as any
    );

    this.scene = new BABYLON.Scene(this.engine);
    this.configureScene();
    this.startRenderLoop();

    window.addEventListener('resize', () => {
      if (this.engine) {
        this.engine.resize();
      }
    });
  }

  /**
   * Configura a cena com propriedades otimizadas para realismo
   */
  private configureScene(): void {
    if (!this.scene) return;

    this.scene.clearColor = new BABYLON.Color4(0.17, 0.17, 0.17, 1.0);

    const ambientColor = BabylonConfig.scene.ambientColor;
    this.scene.ambientColor = new BABYLON.Color3(
      ambientColor[0],
      ambientColor[1],
      ambientColor[2]
    );

    this.enableAdvancedShadows();
    this.enablePBRSupport();

    if (BabylonConfig.performance.lodEnabled) {
      this.scene.collisionsEnabled = true;
    }

    if (BabylonConfig.performance.frustumCulling) {
      this.scene.skipFrustumClipping = false;
    }

    this.setupPostProcessing();
  }

  /**
   * Configura sistema avançado de sombras
   */
  private enableAdvancedShadows(): void {
    if (!this.scene) return;

    // Usar variância de sombra para sombras mais suaves
    this.scene.shadowsEnabled = true;

    // Técnicas de shadow mapping otimizadas (ShadowGenerator é configurado por instância)
  }

  /**
   * Ativa suporte a PBR (renderização fisicamente baseada)
   */
  private enablePBRSupport(): void {
    if (!this.scene) return;

    // PBR é suportado nativamente no Babylon.js 6.0
    // Gamma correction é aplicado automaticamente em materiais PBR
  }

  /**
   * Configura pós-processamento para melhor qualidade visual
   */
  private setupPostProcessing(): void {
    if (!this.scene) return;

    // Efeitos podem ser adicionados conforme necessário (bloom, etc)
    // Por enquanto mantemos configuração base para performance
  }

  /**
   * Inicia o loop de renderização
   */
  private startRenderLoop(): void {
    if (!this.engine || !this.scene) return;

    this.renderLoop = true;

    this.engine.runRenderLoop(() => {
      this.scene?.render();
    });
  }

  /**
   * Para o loop de renderização
   */
  stopRenderLoop(): void {
    this.renderLoop = false;
    this.engine?.stopRenderLoop();
  }

  /**
   * Retorna a cena atual
   */
  getScene(): BABYLON.Scene | null {
    return this.scene;
  }

  /**
   * Retorna o engine
   */
  getEngine(): BABYLON.Engine | null {
    return this.engine;
  }

  /**
   * Retorna o canvas
   */
  getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  /**
   * Cria uma câmera ArcRotateCamera para controle livre
   */
  createOrbitCamera(
    name: string,
    alpha: number,
    beta: number,
    radius: number,
    target: BABYLON.Vector3
  ): BABYLON.ArcRotateCamera {
    if (!this.scene) throw new Error('Scene not initialized');

    const camera = new BABYLON.ArcRotateCamera(name, alpha, beta, radius, target, this.scene);

    // Configurar camera
    camera.attachControl(this.canvas, true);

    // Limites de zoom - serão sobrescritos por presets
    camera.lowerRadiusLimit = 0.1;
    camera.upperRadiusLimit = 100;

    // Velocidade de movimento
    camera.angularSensibilityX = 1000;
    camera.angularSensibilityY = 1000;

    // Inércia para movimento suave
    camera.inertia = 0.7;
    camera.speed = 5;

    // Garantir que beta está sempre entre 0.1 e Pi-0.1 para evitar inversão
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = Math.PI - 0.1;

    return camera;
  }
  
  /**
   * Cria uma câmera estática sem controles do usuário
   * Usa ArcRotateCamera mas desabilita interação
   */
  createStaticCamera(
    name: string,
    alpha: number,
    beta: number,
    radius: number,
    target: BABYLON.Vector3
  ): BABYLON.ArcRotateCamera {
    if (!this.scene) throw new Error('Scene not initialized');

    const camera = new BABYLON.ArcRotateCamera(name, alpha, beta, radius, target, this.scene);
    
    // NÃO anexar controles - câmera estática
    // camera.attachControl(this.canvas, true);
    
    // Desabilitar todos os inputs
    camera.inputs.clear();
    
    // Configurar FOV e outras propriedades
    camera.fov = 0.8; // Campo de visão amplo para ver todo o ambiente
    camera.minZ = 0.1;
    camera.maxZ = 1000;
    
    // Definir limites para evitar problemas técnicos
    camera.lowerRadiusLimit = radius;
    camera.upperRadiusLimit = radius;
    camera.lowerBetaLimit = beta;
    camera.upperBetaLimit = beta;
    camera.lowerAlphaLimit = alpha;
    camera.upperAlphaLimit = alpha;
    
    return camera;
  }

  /**
   * Cria uma luz direcional com sombras (sol)
   */
  createDirectionalLight(
    name: string,
    position: BABYLON.Vector3,
    direction: BABYLON.Vector3,
    intensity: number,
    color: BABYLON.Color3
  ): BABYLON.DirectionalLight {
    if (!this.scene) throw new Error('Scene not initialized');

    const light = new BABYLON.DirectionalLight(name, direction, this.scene);
    light.position = position;
    light.intensity = intensity;
    light.diffuse = color;
    light.specular = color;

    return light;
  }

  /**
   * Cria uma luz pontual (ponto/esfera de luz)
   */
  createPointLight(
    name: string,
    position: BABYLON.Vector3,
    intensity: number,
    range: number,
    color: BABYLON.Color3
  ): BABYLON.PointLight {
    if (!this.scene) throw new Error('Scene not initialized');

    const light = new BABYLON.PointLight(name, position, this.scene);
    light.intensity = intensity;
    light.range = range;
    light.diffuse = color;
    light.specular = color;

    return light;
  }

  /**
   * Cria uma luz spotlight (holofote)
   */
  createSpotlight(
    name: string,
    position: BABYLON.Vector3,
    direction: BABYLON.Vector3,
    angle: number,
    exponent: number,
    intensity: number,
    range: number,
    color: BABYLON.Color3
  ): BABYLON.SpotLight {
    if (!this.scene) throw new Error('Scene not initialized');

    const light = new BABYLON.SpotLight(name, position, direction, angle, exponent, this.scene);
    light.intensity = intensity;
    light.range = range;
    light.diffuse = color;
    light.specular = color;

    return light;
  }

  /**
   * Cria sombras avançadas para uma luz
   */
  createShadowMap(
    light: BABYLON.DirectionalLight | BABYLON.SpotLight,
    mapSize: number = 2048
  ): BABYLON.ShadowGenerator {
    if (!this.scene) throw new Error('Scene not initialized');

    const shadowGenerator = new BABYLON.ShadowGenerator(mapSize, light);

    // Configurações avançadas de sombra
    shadowGenerator.useContactHardeningShadow = true;
    shadowGenerator.contactHardeningLightSizeUVRatio = 0.05;
    
    // Usar PCF (Percentage Closer Filtering) para sombras suaves
    shadowGenerator.usePercentageCloserFiltering = true;
    shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_HIGH;

    // Configurações de bias otimizadas
    shadowGenerator.bias = 0.00005;
    shadowGenerator.normalBias = 0.01;

    // Configurações de blur para sombras mais suaves
    shadowGenerator.useKernelBlur = true;
    shadowGenerator.blurKernel = 8;
    shadowGenerator.blurScale = 2;

    return shadowGenerator;
  }

  /**
   * Cria um material PBR realista
   */
  createPBRMaterial(
    name: string,
    baseColor: BABYLON.Color3,
    roughness: number = 0.5,
    metallic: number = 0,
    emissive?: BABYLON.Color3
  ): BABYLON.PBRMetallicRoughnessMaterial {
    if (!this.scene) throw new Error('Scene not initialized');

    const material = new BABYLON.PBRMetallicRoughnessMaterial(name, this.scene);

    // Propriedades PBR
    material.baseColor = baseColor;
    material.metallic = metallic;
    material.roughness = roughness;

    // Emissive (para materiais que emitem luz)
    if (emissive) {
      material.emissiveColor = emissive;
    }

    // Sideorientation para rendering
    material.sideOrientation = BABYLON.Mesh.FRONTSIDE;

    return material;
  }

  /**
   * Cria um material PBR especular
   */
  createPBRSpecularMaterial(
    name: string,
    diffuseColor: BABYLON.Color3,
    specularColor: BABYLON.Color3,
    glossiness: number = 0.5
  ): BABYLON.PBRSpecularGlossinessMaterial {
    if (!this.scene) throw new Error('Scene not initialized');

    const material = new BABYLON.PBRSpecularGlossinessMaterial(name, this.scene);

    material.diffuseColor = diffuseColor;
    material.specularColor = specularColor;
    material.glossiness = glossiness;

    return material;
  }

  /**
   * Cria um material brilhante/espelhado
   */
  createMirrorMaterial(name: string): BABYLON.StandardMaterial {
    if (!this.scene) throw new Error('Scene not initialized');

    const material = new BABYLON.StandardMaterial(name, this.scene);

    material.reflectionTexture = new BABYLON.CubeTexture(
      'https://www.babylonjs-playground.com/textures/skybox',
      this.scene
    );
    material.reflectionTexture.level = 0.5;

    material.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    material.specularPower = 64;

    return material;
  }

  /**
   * Cria uma malha box (cubo) com material
   */
  createBox(
    name: string,
    size: number,
    material: BABYLON.Material,
    position: BABYLON.Vector3 = BABYLON.Vector3.Zero()
  ): BABYLON.Mesh {
    if (!this.scene) throw new Error('Scene not initialized');

    const box = BABYLON.MeshBuilder.CreateBox(name, { size }, this.scene);
    box.material = material;
    box.position = position;

    return box;
  }

  /**
   * Cria uma malha plano (piso/parede)
   */
  createGround(
    name: string,
    width: number,
    depth: number,
    material: BABYLON.Material,
    position: BABYLON.Vector3 = BABYLON.Vector3.Zero()
  ): BABYLON.Mesh {
    if (!this.scene) throw new Error('Scene not initialized');

    const ground = BABYLON.MeshBuilder.CreateGround(
      name,
      { width, height: depth, subdivisions: 50 },
      this.scene
    );
    ground.material = material;
    ground.position = position;

    return ground;
  }

  /**
   * Cria uma malha cilíndro
   */
  createCylinder(
    name: string,
    height: number,
    radiusTop: number,
    radiusBottom: number,
    material: BABYLON.Material,
    position: BABYLON.Vector3 = BABYLON.Vector3.Zero()
  ): BABYLON.Mesh {
    if (!this.scene) throw new Error('Scene not initialized');

    const cylinder = BABYLON.MeshBuilder.CreateCylinder(
      name,
      { height, diameterTop: radiusTop * 2, diameterBottom: radiusBottom * 2 },
      this.scene
    );
    cylinder.material = material;
    cylinder.position = position;

    return cylinder;
  }

  /**
   * Remove uma malha da cena
   */
  removeMesh(mesh: BABYLON.Mesh): void {
    mesh.dispose();
  }

  /**
   * Limpa toda a cena
   */
  clearScene(): void {
    if (this.scene) {
      this.scene.dispose();
      this.scene = null;
    }
  }

  /**
   * Retorna informações de performance
   */
  getPerformanceInfo(): {
    fps: number;
    meshes: number;
    lights: number;
    triangles: number;
  } {
    if (!this.engine || !this.scene) {
      return { fps: 0, meshes: 0, lights: 0, triangles: 0 };
    }

    return {
      fps: this.engine.getFps(),
      meshes: this.scene.meshes.length,
      lights: this.scene.lights.length,
      triangles: this.scene.getActiveMeshes().length
    };
  }
}