# 📚 Exemplo de Integração - Visualizador 3D

## Cenário 1: Simples - Just Render

```typescript
// seu-componente.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-visualizador-simples',
  template: `
    <div class="viewer-container">
      <app-visualizador-3d></app-visualizador-3d>
    </div>
  `,
  styles: [`
    .viewer-container {
      width: 100vw;
      height: 100vh;
    }
  `]
})
export class VisualizadorSimplesComponent {}
```

---

## Cenário 2: Intermediário - Com Serviços

```typescript
// seu-componente.component.ts
import { Component, OnInit } from '@angular/core';
import { LightingService } from './services/lighting.service';
import { EnvironmentService } from './services/environment.service';

@Component({
  selector: 'app-visualizador-interativo',
  template: `
    <div class="viewer-wrapper">
      <app-visualizador-3d></app-visualizador-3d>
      
      <div class="custom-controls">
        <button (click)="loadSalaEstar()">Sala de Estar</button>
        <button (click)="applyWarmLight()">Luz Quente</button>
        <button (click)="applyNeutraLight()">Luz Neutra</button>
      </div>
    </div>
  `,
  styles: [`
    .viewer-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
    }
    
    .custom-controls {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 10px;
      z-index: 10;
    }
    
    button {
      padding: 10px 20px;
      background: #00bcd4;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      
      &:hover {
        background: #0097a7;
      }
    }
  `]
})
export class VisualizadorInterativoComponent implements OnInit {
  constructor(
    private lighting: LightingService,
    private environment: EnvironmentService
  ) {}

  ngOnInit() {
    // Inicializar com presets padrão
  }

  loadSalaEstar() {
    this.environment.loadEnvironment('sala_estar');
  }

  applyWarmLight() {
    this.lighting.applyPreset('quente_aconchego');
  }

  applyNeutraLight() {
    this.lighting.applyPreset('neutro_profissional');
  }
}
```

---

## Cenário 3: Avançado - Com Produtos

```typescript
// seu-componente.component.ts
import { Component, OnInit } from '@angular/core';
import { LightingService } from './services/lighting.service';
import { EnvironmentService } from './services/environment.service';
import { ProductLoaderService } from './services/product-loader.service';
import { Product3D } from './models/product-3d.interface';

@Component({
  selector: 'app-visualizador-produtos',
  template: `
    <div class="viewer-wrapper">
      <app-visualizador-3d></app-visualizador-3d>
      
      <div class="product-panel">
        <h3>Produtos Disponíveis</h3>
        
        <div class="product-list">
          <button 
            *ngFor="let product of products"
            (click)="loadProduct(product)"
            [class.active]="selectedProduct?.id === product.id"
            class="product-btn"
          >
            {{ product.name }}
          </button>
        </div>
        
        <div *ngIf="selectedProduct" class="product-controls">
          <h4>{{ selectedProduct.name }}</h4>
          
          <label>Intensidade de Luz:</label>
          <input 
            type="range" 
            min="0" 
            max="2" 
            step="0.1"
            [value]="productLightIntensity"
            (change)="onLightIntensityChange($event)"
          >
          
          <label>Cor de Luz:</label>
          <input 
            type="color"
            [value]="productLightColor"
            (change)="onLightColorChange($event)"
          >
        </div>
      </div>
    </div>
  `,
  styles: [`
    .viewer-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
    }
    
    .product-panel {
      position: absolute;
      right: 20px;
      top: 20px;
      background: rgba(44, 62, 80, 0.95);
      padding: 20px;
      border-radius: 8px;
      color: white;
      font-family: Arial, sans-serif;
      max-width: 300px;
      max-height: 80vh;
      overflow-y: auto;
      z-index: 20;
    }
    
    h3 {
      margin: 0 0 15px 0;
      font-size: 16px;
      color: #00bcd4;
      border-bottom: 2px solid #00bcd4;
      padding-bottom: 10px;
    }
    
    h4 {
      margin: 10px 0 5px 0;
      font-size: 14px;
    }
    
    .product-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 15px;
    }
    
    .product-btn {
      padding: 10px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(0, 188, 212, 0.3);
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(0, 188, 212, 0.15);
        border-color: #00bcd4;
      }
      
      &.active {
        background: #00bcd4;
        color: #000;
        border-color: #00bcd4;
      }
    }
    
    .product-controls {
      padding-top: 15px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      
      label {
        display: block;
        font-size: 12px;
        margin: 10px 0 5px 0;
        text-transform: uppercase;
        color: #00bcd4;
        font-weight: bold;
      }
      
      input[type="range"],
      input[type="color"] {
        width: 100%;
        cursor: pointer;
        margin-bottom: 10px;
      }
    }
  `]
})
export class VisualizadorProdutosComponent implements OnInit {
  products: Product3D[] = [
    {
      id: 'lamp_pendant_001',
      name: 'Luminária Pendente Moderna',
      description: 'Pendente de teto design contemporâneo',
      modelPath: '/assets/models/pendant-lamp.glb',
      position: { x: 0, y: 2.5, z: 0 },
      scale: 0.8,
      rotation: { x: 0, y: 0, z: 0 },
      material: {
        baseColor: '#D3D3D3',
        roughness: 0.3,
        metallic: 0.7
      },
      emitsLight: true,
      lightProperties: {
        color: '#FFD700',
        intensity: 1.2,
        range: 12,
        temperature: 2700
      }
    },
    {
      id: 'lamp_wall_001',
      name: 'Arandela de Parede',
      description: 'Luz de parede discreta',
      modelPath: '/assets/models/wall-lamp.glb',
      position: { x: -2, y: 1.8, z: 0 },
      scale: 0.6,
      rotation: { x: 0, y: 0, z: 0 },
      material: {
        baseColor: '#FFFFFF',
        roughness: 0.4,
        metallic: 0.5
      },
      emitsLight: true,
      lightProperties: {
        color: '#FFFFFF',
        intensity: 0.8,
        range: 8,
        temperature: 4000
      }
    },
    {
      id: 'lamp_floor_001',
      name: 'Luminária de Piso',
      description: 'Pé de luz elegante',
      modelPath: '/assets/models/floor-lamp.glb',
      position: { x: 2, y: 0.8, z: 1.5 },
      scale: 1,
      rotation: { x: 0, y: 0, z: 0 },
      material: {
        baseColor: '#2F4F4F',
        roughness: 0.5,
        metallic: 0.2
      },
      emitsLight: true,
      lightProperties: {
        color: '#FFE4B5',
        intensity: 0.9,
        range: 10,
        temperature: 3000
      }
    }
  ];

  selectedProduct: Product3D | null = null;
  productLightIntensity: number = 1;
  productLightColor: string = '#FFD700';

  constructor(
    private lighting: LightingService,
    private environment: EnvironmentService,
    private products: ProductLoaderService
  ) {}

  ngOnInit() {
    // Carregar ambiente padrão
    this.environment.loadEnvironment('sala_estar');
    this.lighting.applyPreset('quente_aconchego');
  }

  async loadProduct(product: Product3D) {
    this.selectedProduct = product;
    this.productLightColor = product.lightProperties?.color || '#FFD700';
    this.productLightIntensity = product.lightProperties?.intensity || 1;

    // Remover produtos anteriores
    this.products.forEach(p => {
      if (p.id !== product.id) {
        this.products.removeProduct(p.id);
      }
    });

    // Carregar novo produto
    await this.products.loadProduct(product);
  }

  onLightIntensityChange(event: any) {
    const intensity = parseFloat(event.target.value);
    this.productLightIntensity = intensity;

    if (this.selectedProduct) {
      this.products.updateProductLightIntensity(this.selectedProduct.id, intensity);
    }
  }

  onLightColorChange(event: any) {
    const color = event.target.value;
    this.productLightColor = color;

    if (this.selectedProduct) {
      this.products.updateProductLightColor(this.selectedProduct.id, color);
    }
  }
}
```

---

## Cenário 4: Empresarial - Com API Backend

```typescript
// seu-servico-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LuminariasAPIService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>('/api/products/lights');
  }

  getEnvironments(): Observable<any[]> {
    return this.http.get<any[]>('/api/environments');
  }

  saveLightingConfiguration(config: any): Observable<any> {
    return this.http.post('/api/configurations/save', config);
  }

  getLightingConfigurations(): Observable<any[]> {
    return this.http.get<any[]>('/api/configurations');
  }
}

// seu-componente-empresarial.component.ts
import { Component, OnInit } from '@angular/core';
import { LuminariasAPIService } from './luminarias-api.service';
import { LightingService } from './services/lighting.service';

@Component({
  selector: 'app-visualizador-empresarial',
  template: `
    <div class="viewer-enterprise">
      <app-visualizador-3d></app-visualizador-3d>
      
      <div class="enterprise-panel">
        <div class="header">
          <h2>Configurador Profissional de Iluminação</h2>
          <button (click)="saveConfiguration()" class="btn-save">
            💾 Salvar Configuração
          </button>
        </div>

        <div class="configurations-list">
          <h3>Configurações Salvas</h3>
          <div 
            *ngFor="let config of savedConfigs"
            (click)="loadConfiguration(config)"
            [class.active]="selectedConfig?.id === config.id"
            class="config-item"
          >
            <strong>{{ config.name }}</strong>
            <small>{{ config.createdAt | date }}</small>
            <button (click)="deleteConfiguration(config.id); $event.stopPropagation()" class="btn-delete">
              ✕
            </button>
          </div>
        </div>

        <div class="export-section">
          <button (click)="exportAsJSON()">📥 Exportar JSON</button>
          <button (click)="exportAsImage()">📸 Tirar Screenshot</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .viewer-enterprise {
      position: relative;
      width: 100%;
      height: 100%;
      background: #000;
    }

    .enterprise-panel {
      position: absolute;
      left: 20px;
      top: 20px;
      background: rgba(44, 62, 80, 0.95);
      padding: 20px;
      border-radius: 8px;
      color: white;
      width: 320px;
      max-height: calc(100vh - 40px);
      overflow-y: auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #00bcd4;
    }

    h2 {
      margin: 0;
      font-size: 16px;
      color: #00bcd4;
    }

    .btn-save {
      padding: 8px 12px;
      background: #00bcd4;
      color: #000;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      white-space: nowrap;
      
      &:hover {
        background: #0097a7;
      }
    }

    .configurations-list {
      margin-bottom: 20px;
    }

    h3 {
      font-size: 14px;
      margin: 0 0 10px 0;
      color: #00bcd4;
      text-transform: uppercase;
    }

    .config-item {
      padding: 10px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(0, 188, 212, 0.2);
      border-radius: 4px;
      margin-bottom: 8px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s ease;
      
      strong {
        flex: 1;
      }
      
      small {
        font-size: 11px;
        color: #888;
      }
      
      .btn-delete {
        background: #ff4444;
        color: white;
        border: none;
        border-radius: 3px;
        padding: 4px 8px;
        cursor: pointer;
        font-size: 12px;
        
        &:hover {
          background: #cc0000;
        }
      }
      
      &:hover {
        background: rgba(0, 188, 212, 0.15);
        border-color: #00bcd4;
      }
      
      &.active {
        background: #00bcd4;
        color: #000;
        
        strong, small {
          color: #000;
        }
      }
    }

    .export-section {
      display: flex;
      gap: 10px;
      
      button {
        flex: 1;
        padding: 10px;
        background: rgba(0, 188, 212, 0.2);
        color: #00bcd4;
        border: 1px solid #00bcd4;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        
        &:hover {
          background: rgba(0, 188, 212, 0.4);
        }
      }
    }
  `]
})
export class VisualizadorEmpresarialComponent implements OnInit {
  savedConfigs: any[] = [];
  selectedConfig: any = null;

  constructor(
    private api: LuminariasAPIService,
    private lighting: LightingService
  ) {}

  ngOnInit() {
    this.loadConfigurations();
  }

  loadConfigurations() {
    this.api.getLightingConfigurations().subscribe(
      (configs) => {
        this.savedConfigs = configs;
      },
      (error) => {
        console.error('Erro ao carregar configurações', error);
      }
    );
  }

  saveConfiguration() {
    const config = {
      name: `Configuração ${new Date().toLocaleString()}`,
      lightingPreset: this.lighting.getLights(),
      createdAt: new Date()
    };

    this.api.saveLightingConfiguration(config).subscribe(
      (response) => {
        alert('✅ Configuração salva com sucesso!');
        this.loadConfigurations();
      },
      (error) => {
        alert('❌ Erro ao salvar');
      }
    );
  }

  loadConfiguration(config: any) {
    this.selectedConfig = config;
    // Aplicar configuração
  }

  deleteConfiguration(configId: string) {
    if (confirm('Tem certeza que quer deletar?')) {
      this.savedConfigs = this.savedConfigs.filter(c => c.id !== configId);
    }
  }

  exportAsJSON() {
    const config = {
      lighting: this.lighting.getLights(),
      timestamp: new Date()
    };

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + 
      encodeURIComponent(JSON.stringify(config, null, 2)));
    element.setAttribute('download', 'lighting-config.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  exportAsImage() {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `screenshot-${Date.now()}.png`;
      link.click();
    }
  }
}
```

---

## Próximas Integrações

Depois de implementar um desses cenários, você pode:

1. ✅ **Adicionar sistema de comentários**
   - Usuários deixarem feedback sobre presets

2. ✅ **Integrar com carrinho de compras**
   - Adicionar produtos diretamente do visualizador

3. ✅ **Modo colaborativo**
   - Múltiplos usuários visualizando ao mesmo tempo

4. ✅ **AI/ML**
   - Sugestões automáticas de iluminação

5. ✅ **Real-time collab**
   - WebSocket para compartilhamento em tempo real

---

Bom desenvolvimento! 🚀