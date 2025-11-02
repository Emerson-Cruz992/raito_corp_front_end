import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ThreeService } from './services/three.service';
import { ThreeLightingService } from './services/three-lighting.service';
import { ThreeEnvironmentService } from './services/three-environment.service';
import { ENVIRONMENT_PRESETS } from './configs/environment-configs';

/**
 * Componente principal do visualizador 3D
 * Migrado para Three.js para melhor performance
 */
@Component({
  selector: 'app-visualizador-3d',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visualizador-3d.component.html',
  styleUrls: ['./visualizador-3d.component.scss']
})
export class Visualizador3dComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('renderCanvas', { static: false }) renderCanvas!: ElementRef<HTMLCanvasElement>;

  private destroy$ = new Subject<void>();

  // ============================================
  // Estado da Interface
  // ============================================
  isLoading = true;
  isInitialized = false;
  isCustomizing = false;

  // ============================================
  // Ambientes
  // ============================================
  allEnvironments = [
    { ...ENVIRONMENT_PRESETS['sala_moderna'], previewImage: 'assets/environments/sala_moderna.jpg' }
  ];
  selectedEnvironment = 'sala_moderna';

  // ============================================
  // Tipos de Iluminação
  // ============================================
  lampTypes = [
    {
      id: 'sala_natural',
      name: 'Natural',
      preset: 'sala_natural'
    }
  ];
  selectedLampType = 'sala_natural';

  // ============================================
  // Controles de Iluminação
  // ============================================
  lightIntensity = 100;
  lightsEnabled = true;

  constructor(
    private threeService: ThreeService,
    private lightingService: ThreeLightingService,
    private environmentService: ThreeEnvironmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupStateSubscriptions();
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeThree();
    }, 100);
  }

  /**
   * Inicializa o Three.js
   */
  private initializeThree(): void {
    const canvas = this.renderCanvas.nativeElement;

    try {
      // Inicializar Three.js
      this.threeService.initializeEngine(canvas);

      // Carregar ambiente padrão
      this.loadEnvironment(this.selectedEnvironment);

      // Aplicar iluminação padrão
      this.applyLighting(this.selectedLampType);

      this.isInitialized = true;
      this.isLoading = false;
    } catch (error) {
      console.error('Erro ao inicializar Three.js:', error);
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
        // Atualizar estado de iluminação
      });

    this.environmentService
      .getEnvironmentState$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        // Atualizar estado de ambiente
      });
  }

  // ============================================
  // Seleção de Ambiente
  // ============================================
  selectEnvironment(environmentId: string): void {
    this.selectedEnvironment = environmentId;
    this.loadEnvironment(environmentId);
  }

  private loadEnvironment(environmentId: string): void {
    this.environmentService.loadEnvironment(environmentId);
  }

  // ============================================
  // Painel de Customização
  // ============================================
  toggleCustomizationPanel(): void {
    this.isCustomizing = !this.isCustomizing;
  }

  // ============================================
  // Controles de Iluminação
  // ============================================
  selectLampType(typeId: string): void {
    this.selectedLampType = typeId;
    const lampType = this.lampTypes.find(t => t.id === typeId);
    if (lampType) {
      this.applyLighting(lampType.preset);
    }
  }

  updateLightIntensity(event: any): void {
    this.lightIntensity = Number(event.target.value);
    const multiplier = this.lightIntensity / 100;

    // Atualizar todas as luzes da cena
    const lights = this.lightingService.getLights();
    lights.forEach(light => {
      const baseIntensity = (light as any)._baseIntensity || light.intensity;
      (light as any)._baseIntensity = baseIntensity;
      light.intensity = baseIntensity * multiplier;
    });
  }

  private applyLighting(presetId: string): void {
    this.lightingService.applyPreset(presetId);
  }

  // ============================================
  // Ferramentas da Viewport
  // ============================================
  resetCamera(): void {
    const controls = this.threeService.getControls();
    if (controls) {
      controls.reset();
    }
  }

  toggleLights(): void {
    this.lightsEnabled = !this.lightsEnabled;
    const lights = this.lightingService.getLights();
    lights.forEach(light => {
      light.visible = this.lightsEnabled;
    });
  }

  // ============================================
  // Navegação
  // ============================================
  goBack(): void {
    this.router.navigate(['/']);
  }

  // ============================================
  // Eventos
  // ============================================
  onWindowResize(event: Event): void {
    // O Three.js já lida com redimensionamento automaticamente
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.threeService.clearScene();

    document.body.style.overflow = '';
    document.body.style.margin = '';
    document.body.style.padding = '';
  }
}
