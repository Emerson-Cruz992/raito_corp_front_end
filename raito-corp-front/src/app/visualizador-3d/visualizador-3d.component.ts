import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BabylonService } from './services/babylon.service';
import { LightingService } from './services/lighting.service';
import { EnvironmentService } from './services/environment.service';
import { CameraControlService } from './services/camera-control.service';
import { ProductLoaderService } from './services/product-loader.service';
import { LIGHTING_PRESETS, PRESET_GROUPS } from './configs/lighting-presets';
import { ENVIRONMENT_PRESETS, ENVIRONMENT_GROUPS } from './configs/environment-configs';
import { CAMERA_PRESETS, CAMERA_CATEGORIES } from './configs/camera-presets';

/**
 * Componente principal do visualizador 3D
 * Integra todos os serviços para criar experiência imersiva de iluminação
 */
@Component({
  selector: 'app-visualizador-3d',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visualizador-3d.component.html',
  styleUrls: ['./visualizador-3d.component.scss']
})
export class Visualizador3dComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('renderCanvas', { static: false }) renderCanvas!: ElementRef<HTMLCanvasElement>;

  private destroy$ = new Subject<void>();

  // Dados para UI
  lightingCategories = [
    { label: 'Claro', value: 'claro' },
    { label: 'Neutro', value: 'neutro' },
    { label: 'Quente', value: 'quente' },
    { label: 'Cênico', value: 'cenico' }
  ];

  environmentCategories = [
    { label: 'Sala', value: 'sala' },
    { label: 'Banheiro', value: 'banheiro' },
    { label: 'Quarto', value: 'quarto' }
  ];

  currentLightingCategory = 'claro';
  currentEnvironmentCategory = 'sala';

  lightingPresets: any[] = [];
  environmentPresets: any[] = [];
  cameraPresets: any[] = [];

  currentLightingPreset = '';
  currentEnvironmentPreset = '';
  currentCameraPreset = '';

  isInitialized = false;
  isLoading = true;
  isPanelVisible = true;

  constructor(
    private babylonService: BabylonService,
    private lightingService: LightingService,
    private environmentService: EnvironmentService,
    private cameraControlService: CameraControlService,
    private productLoaderService: ProductLoaderService
  ) {}

  ngOnInit(): void {
    this.updateLightingPresets();
    this.updateEnvironmentPresets();
    this.updateCameraPresets();
    this.setupStateSubscriptions();
    
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  }

  ngAfterViewInit(): void {
    // Inicializar Babylon.js
    setTimeout(() => {
      this.initializeBabylon();
    }, 100);
  }

  /**
   * Inicializa o engine Babylon.js
   */
  private initializeBabylon(): void {
    const canvas = this.renderCanvas.nativeElement;

    try {
      this.babylonService.initializeEngine(canvas);
      this.cameraControlService.initializeCamera();

      if (this.environmentPresets.length > 0) {
        this.loadEnvironment(this.environmentPresets[0].id);
      }

      this.currentLightingCategory = 'cenico';
      this.updateLightingPresets();
      this.applyLighting('noturna');

      this.isInitialized = true;
      this.isLoading = false;
    } catch (error) {
      console.error('Erro ao inicializar Babylon.js:', error);
      this.isLoading = false;
    }
  }

  /**
   * Configura inscrições aos observáveis dos serviços
   */
  private setupStateSubscriptions(): void {
    this.lightingService
      .getLightingState$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        if (state) {
          this.currentLightingPreset = state.currentPreset.id;
        }
      });

    this.environmentService
      .getEnvironmentState$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        if (state) {
          this.currentEnvironmentPreset = state.currentEnvironment.id;
        }
      });

    this.cameraControlService
      .getCameraSettings$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(settings => {
        // Atualizar UI se necessário
      });
  }

  /**
   * Atualiza lista de presets de iluminação
   */
  private updateLightingPresets(): void {
    const group = PRESET_GROUPS[this.currentLightingCategory as keyof typeof PRESET_GROUPS];
    this.lightingPresets = group || [];
  }

  /**
   * Atualiza lista de presets de ambiente
   */
  private updateEnvironmentPresets(): void {
    const group = ENVIRONMENT_GROUPS[this.currentEnvironmentCategory as keyof typeof ENVIRONMENT_GROUPS];
    this.environmentPresets = group || [];
  }

  /**
   * Atualiza lista de presets de câmera
   */
  private updateCameraPresets(): void {
    this.cameraPresets = CAMERA_PRESETS['default']
      ? Object.values(CAMERA_PRESETS).slice(0, 9)
      : [];
  }

  /**
   * Altera a categoria de iluminação
   */
  onLightingCategoryChange(category: string): void {
    this.currentLightingCategory = category;
    this.updateLightingPresets();

    if (this.lightingPresets.length > 0) {
      this.applyLighting(this.lightingPresets[0].id);
    }
  }

  /**
   * Altera a categoria de ambiente
   */
  onEnvironmentCategoryChange(category: string): void {
    this.currentEnvironmentCategory = category;
    this.updateEnvironmentPresets();

    if (this.environmentPresets.length > 0) {
      this.loadEnvironment(this.environmentPresets[0].id);
    }
  }

  /**
   * Aplica um preset de iluminação
   */
  applyLighting(presetId: string): void {
    this.lightingService.applyPreset(presetId);
  }

  /**
   * Carrega um ambiente e aplica a câmera estática correspondente
   */
  loadEnvironment(environmentId: string): void {
    this.environmentService.loadEnvironment(environmentId);

    // Aplicar câmera estática específica para este ambiente
    // Mapear ID do ambiente para ID da câmera correspondente
    let cameraId = 'default';
    
    // Determinar qual câmera usar com base no ambiente
    if (environmentId.includes('sala_estar')) {
      cameraId = 'sala_estar';
    } else if (environmentId.includes('sala_comercial')) {
      cameraId = 'sala_comercial';
    } else if (environmentId.includes('sala_gourmet')) {
      cameraId = 'sala_gourmet';
    } else if (environmentId.includes('banheiro_moderno')) {
      cameraId = 'banheiro_moderno';
    } else if (environmentId.includes('banheiro_rustico')) {
      cameraId = 'banheiro_rustico';
    } else if (environmentId.includes('banheiro_spa')) {
      cameraId = 'banheiro_spa';
    } else if (environmentId.includes('quarto_suite')) {
      cameraId = 'quarto_suite';
    } else if (environmentId.includes('quarto_infantil')) {
      cameraId = 'quarto_infantil';
    } else if (environmentId.includes('quarto_hospede')) {
      cameraId = 'quarto_hospede';
    }
    
    // Aplicar a câmera estática
    this.cameraControlService.applyPreset(cameraId);
  }

  /**
   * Aplica um preset de câmera
   */
  applyCamera(presetId: string): void {
    this.cameraControlService.applyPreset(presetId);
  }

  /**
   * Zoom in
   */
  zoomIn(): void {
    this.cameraControlService.zoomIn(1);
  }

  /**
   * Zoom out
   */
  zoomOut(): void {
    this.cameraControlService.zoomOut(1);
  }

  /**
   * Alterna modo apresentação (rotação automática)
   */
  togglePresentation(): void {
    this.cameraControlService.applyPreset('presentation');
  }
  
  /**
   * Alterna visibilidade do painel de controle
   */
  toggleControlPanel(): void {
    this.isPanelVisible = !this.isPanelVisible;
  }

  onWindowResize(event: Event): void {
    if (this.babylonService.getEngine()) {
      this.babylonService.getEngine()?.resize();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.cameraControlService.dispose();
    this.lightingService.getLights();
    this.productLoaderService.clearProducts();
    this.babylonService.stopRenderLoop();
    this.babylonService.clearScene();
    
    document.body.style.overflow = '';
    document.body.style.margin = '';
    document.body.style.padding = '';
  }
}