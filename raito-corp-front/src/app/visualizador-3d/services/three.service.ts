import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Serviço central de gerenciamento do Three.js
 * Otimizado para performance máxima
 */
@Injectable({
  providedIn: 'root'
})
export class ThreeService {
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private controls: OrbitControls | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private animationFrameId: number | null = null;

  /**
   * Inicializa o Three.js com configurações otimizadas
   */
  initializeEngine(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;

    // Criar cena
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x2C2C2C);
    this.scene.fog = new THREE.Fog(0x2C2C2C, 10, 50);

    // Criar câmera (posição fixa - vista isométrica superior)
    const aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
    this.camera.position.set(-2.5, 2.8, 4.5); // Vista do canto superior com mais altura

    // Criar renderer com configurações otimizadas
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true
    });

    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limitar para performance
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Sombras suaves e performáticas
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // CÂMERA ESTÁTICA - Controles desabilitados
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enabled = false; // Desabilitar interação do usuário
    this.controls.target.set(0.5, 0.5, 0); // Olhando para o centro da sala
    this.controls.update();

    // Adicionar iluminação ambiente básica
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);

    // Iniciar loop de renderização
    this.startRenderLoop();

    // Lidar com redimensionamento
    window.addEventListener('resize', () => this.onWindowResize());
  }

  /**
   * Loop de renderização otimizado
   */
  private startRenderLoop(): void {
    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);

      if (this.controls) {
        this.controls.update();
      }

      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };

    animate();
  }

  /**
   * Para o loop de renderização
   */
  stopRenderLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Redimensiona o renderer
   */
  private onWindowResize(): void {
    if (!this.canvas || !this.camera || !this.renderer) return;

    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  /**
   * Retorna a cena
   */
  getScene(): THREE.Scene | null {
    return this.scene;
  }

  /**
   * Retorna a câmera
   */
  getCamera(): THREE.PerspectiveCamera | null {
    return this.camera;
  }

  /**
   * Retorna o renderer
   */
  getRenderer(): THREE.WebGLRenderer | null {
    return this.renderer;
  }

  /**
   * Retorna os controles
   */
  getControls(): OrbitControls | null {
    return this.controls;
  }

  /**
   * Cria uma luz direcional (sol)
   */
  createDirectionalLight(
    position: THREE.Vector3,
    color: number,
    intensity: number,
    castShadow: boolean = true
  ): THREE.DirectionalLight {
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.copy(position);
    light.castShadow = castShadow;

    if (castShadow) {
      light.shadow.mapSize.width = 2048;
      light.shadow.mapSize.height = 2048;
      light.shadow.camera.near = 0.5;
      light.shadow.camera.far = 50;
      light.shadow.camera.left = -10;
      light.shadow.camera.right = 10;
      light.shadow.camera.top = 10;
      light.shadow.camera.bottom = -10;
      light.shadow.bias = -0.0001;
    }

    return light;
  }

  /**
   * Cria uma luz pontual
   */
  createPointLight(
    position: THREE.Vector3,
    color: number,
    intensity: number,
    distance: number = 0
  ): THREE.PointLight {
    const light = new THREE.PointLight(color, intensity, distance);
    light.position.copy(position);
    return light;
  }

  /**
   * Cria um spotlight
   */
  createSpotLight(
    position: THREE.Vector3,
    target: THREE.Vector3,
    color: number,
    intensity: number,
    angle: number,
    distance: number = 0
  ): THREE.SpotLight {
    const light = new THREE.SpotLight(color, intensity, distance, angle, 0.5, 2);
    light.position.copy(position);
    light.target.position.copy(target);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    return light;
  }

  /**
   * Cria um material PBR (MeshStandardMaterial)
   */
  createPBRMaterial(
    color: number,
    roughness: number,
    metalness: number
  ): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: roughness,
      metalness: metalness,
      envMapIntensity: 1.0
    });
  }

  /**
   * Cria um plano (piso/parede)
   */
  createPlane(
    width: number,
    height: number,
    material: THREE.Material
  ): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(width, height, 10, 10);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    return mesh;
  }

  /**
   * Cria uma caixa
   */
  createBox(
    width: number,
    height: number,
    depth: number,
    material: THREE.Material
  ): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  /**
   * Cria um cilindro
   */
  createCylinder(
    radiusTop: number,
    radiusBottom: number,
    height: number,
    material: THREE.Material
  ): THREE.Mesh {
    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 32);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  /**
   * Limpa a cena
   */
  clearScene(): void {
    if (this.scene) {
      while (this.scene.children.length > 0) {
        const object = this.scene.children[0];
        this.scene.remove(object);

        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      }
    }

    this.stopRenderLoop();

    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.controls) {
      this.controls.dispose();
    }
  }

  /**
   * Converte hex string para number
   */
  hexToNumber(hex: string): number {
    return parseInt(hex.replace('#', '0x'), 16);
  }
}
