# Visualizador 3D Imersivo de Iluminação

Um sistema profissional e realista para visualizar e simular iluminação em ambientes 3D usando **Babylon.js**. Perfeito para apresentar produtos de iluminação de forma imersiva!

## 🎯 Características Principais

### ⚡ Iluminação Realista
- **12 Presets profissionais** divididos em 4 categorias:
  - **Claro**: Luz natural e brilhante
  - **Neutro**: Profissional e uniforme
  - **Quente**: Aconchego e atmosfera
  - **Cênico**: Dramático e especial

- Tecnologias avançadas:
  - PBR (Physically Based Rendering) para cores precisas
  - Shadow mapping com qualidade alta
  - Efeito bloom para luzes brilhantes
  - Cálculo de iluminação fisicamente correto

### 🏠 Ambientes Predefinidos
- **3 Categorias principais**:
  - **Sala**: Estar, comercial, gourmet
  - **Banheiro**: Moderno, rústico, SPA
  - **Quarto**: Suite, infantil, hóspede

- Cada ambiente com:
  - Geometria realista (paredes, piso, teto)
  - Mobiliário decorativo
  - Materiais apropriados
  - Recomendações de iluminação

### 📷 Controle de Câmera Avançado
- **9 Presets de visualização**:
  - Isométrica, elevada, frontal, lateral
  - Aproximação para detalhes
  - Modo apresentação com rotação automática
  - Volta completa 360°

- **Controles interativos**:
  - Orbit camera (girar, zoom)
  - Zoom in/out suave
  - Movimento intuitivo com mouse

### 🎨 Materiais Realistas
- Sistema PBR com propriedades precisas:
  - Roughness (rugosidade)
  - Metallic (metalicidade)
  - Emissive (brilho próprio)
  - Normal maps e texturas

## 📋 Estrutura do Projeto

```
visualizador-3d/
├── configs/              # Configurações e presets
│   ├── babylon-config.ts        # Config do engine
│   ├── lighting-presets.ts      # Presets de iluminação (12 completos)
│   ├── environment-configs.ts   # Presets de ambientes (9 completos)
│   └── camera-presets.ts        # Presets de câmera (9 presets)
│
├── models/              # Interfaces TypeScript
│   ├── lighting-config.interface.ts
│   ├── environment.interface.ts
│   ├── camera-settings.interface.ts
│   └── product-3d.interface.ts
│
├── services/            # Lógica de negócio
│   ├── babylon.service.ts           # Engine e gerenciamento 3D
│   ├── lighting.service.ts          # Sistema de iluminação
│   ├── environment.service.ts       # Gerenciamento de ambientes
│   ├── camera-control.service.ts    # Controle de câmera
│   ├── material.service.ts          # Sistema de materiais
│   └── product-loader.service.ts    # Carregamento de produtos
│
├── components/          # Componentes da UI
│   ├── lighting-panel/
│   ├── environment-selector/
│   ├── controls-ui/
│   ├── product-selector/
│   └── loading-screen/
│
├── utils/              # Utilitários
│   ├── babylon-helpers.ts
│   ├── lighting-calculations.ts
│   ├── asset-loader.ts
│   └── performance-monitor.ts
│
└── visualizador-3d.component.*  # Componente principal
```

## 🚀 Como Usar

### Instalação Básica

1. **Certificar que Babylon.js está instalado** (já deve estar em `package.json`):
```bash
npm install @babylonjs/core @babylonjs/loaders @babylonjs/materials @babylonjs/post-processes
```

2. **Importar o módulo** (em seu `app.config.ts` ou `app.module.ts`):
```typescript
import { Visualizador3dComponent } from './visualizador-3d/visualizador-3d.component';

// No seu configuração de rotas ou módulo
```

3. **Usar o componente** no template:
```html
<app-visualizador-3d></app-visualizador-3d>
```

### Exemplo de Uso em Componente

```typescript
import { Component } from '@angular/core';
import { LightingService } from './services/lighting.service';
import { EnvironmentService } from './services/environment.service';

@Component({
  selector: 'app-my-viewer',
  template: '<app-visualizador-3d></app-visualizador-3d>'
})
export class MyViewerComponent {
  constructor(
    private lightingService: LightingService,
    private environmentService: EnvironmentService
  ) {}

  // Aplicar iluminação
  applyWarmLighting() {
    this.lightingService.applyPreset('quente_aconchego');
  }

  // Mudar ambiente
  changeToLivingRoom() {
    this.environmentService.loadEnvironment('sala_estar');
  }
}
```

## 🎨 Presets de Iluminação Disponíveis

### Categoria: CLARO
1. **Claro Natural** - Simula luz solar do meio do dia
2. **Claro Brilhante** - Ambiente muito iluminado para vendas

### Categoria: NEUTRO
3. **Neutro Profissional** - Branco neutro para avaliação técnica
4. **Neutro Uniforme** - Sem sombras marcadas, uniforme

### Categoria: QUENTE
5. **Quente Aconchego** - 3000K, iluminação confortável
6. **Quente Dramático** - Alto contraste com cores vibrantes

### Categoria: CÊNICO
7. **Pôr do Sol** - Simula cores de pôr do sol (laranja/magenta)
8. **Estúdio Profissional** - Configuração de 3 pontos de luz
9. **Neon Cyberpunk** - Cores vibrantes futuristas

Plus 3 presets adicionais em desenvolvimento!

## 🏠 Ambientes Disponíveis

### Salas (3)
- **Sala de Estar** - Espaço confortável de convivência
- **Sala Comercial** - Escritório profissional
- **Sala Gourmet** - Espaço de gastronomia

### Banheiros (3)
- **Banheiro Moderno** - Acabamentos contemporâneos
- **Banheiro Rústico** - Espaço com acabamentos naturais
- **Banheiro SPA** - Espaço de relaxamento

### Quartos (3)
- **Quarto Suite** - Suíte confortável
- **Quarto Infantil** - Espaço seguro e colorido
- **Quarto de Hóspede** - Acolhedor para visitantes

## 📷 Presets de Câmera Disponíveis

| Preset | Descrição | Tipo |
|--------|-----------|------|
| Isométrica | Visão profissional 45° | Estática |
| Frontal | Visão direta de frente | Estática |
| Lateral | Visão do lado | Estática |
| Elevada | Visão de pássaro (top-down) | Estática |
| Aproximação | Zoom próximo para detalhes | Estática |
| Apresentação | Com rotação automática suave | Dinâmica |
| Volta Completa | Rotação 360° automática | Dinâmica |
| Visão Detalhada | Zoom muito próximo | Detalhada |

## ⚙️ Configurações Avançadas

### Customizar Iluminação

```typescript
import { LightingService } from './services/lighting.service';

export class CustomLighting {
  constructor(private lighting: LightingService) {}

  addCustomLight() {
    const customLight = {
      id: 'custom_light_1',
      type: 'point' as const,
      name: 'Minha Luz',
      position: { x: 5, y: 3, z: 5 },
      intensity: 1.0,
      range: 20,
      color: '#FFB366',
      shadowMap: true,
      shadows: {
        enabled: true,
        mapSize: 2048,
        bias: 0.0001,
        normalBias: 0.02
      }
    };

    this.lighting.addCustomLight(customLight);
  }

  updateLightColor(lightId: string, newHexColor: string) {
    this.lighting.updateLightColor(lightId, newHexColor);
  }

  updateLightIntensity(lightId: string, intensity: number) {
    this.lighting.updateLightIntensity(lightId, intensity);
  }
}
```

### Customizar Ambiente

```typescript
import { EnvironmentService } from './services/environment.service';

export class CustomEnvironment {
  constructor(private environment: EnvironmentService) {}

  getRecommendedLighting() {
    const recommendation = this.environment.getRecommendedLighting('sala_estar');
    console.log(recommendation);
  }

  getCameraPresetsForEnvironment() {
    const presets = this.environment.getCameraPresets('sala_estar');
    return presets;
  }
}
```

## 🎛️ Controle de Câmera

```typescript
import { CameraControlService } from './services/camera-control.service';

export class CameraControls {
  constructor(private camera: CameraControlService) {}

  // Aplicar preset
  useIsometricView() {
    this.camera.applyPreset('isometric');
  }

  // Zoom programático
  zoomToProduct() {
    this.camera.zoomIn(5);
  }

  // Definir alvo manualmente
  lookAtPoint(x: number, y: number, z: number) {
    this.camera.setTarget(x, y, z);
  }

  // Obter posição atual
  getCurrentPosition() {
    return this.camera.getPosition();
  }
}
```

## 🔧 Configuração do Babylon.js

Edite `babylon-config.ts` para otimizar:

```typescript
export const BabylonConfig = {
  engine: {
    antialias: true,              // Suavizar bordas
    powerPreference: 'high-performance',
    stencil: true,                // Para efeitos avançados
    preserveDrawingBuffer: false  // Economizar memória
  },
  
  scene: {
    clearColor: [0.2, 0.2, 0.3, 1.0],  // Cor de fundo RGB + Alpha
    ambientColor: [0.3, 0.3, 0.4],      // Luz ambiente
  },
  
  performance: {
    maxTextureSize: 2048,         // Tamanho máximo de textura
    lodEnabled: true,             // Level of Detail
    frustumCulling: true,         // Culling de objetos fora da câmera
    maxLights: 8,                 // Máximo de luzes
    shadowMapSize: 1024           // Resolução de sombras
  }
};
```

## 🎬 Adicionar Produtos 3D

```typescript
import { ProductLoaderService } from './services/product-loader.service';
import { Product3D } from './models/product-3d.interface';

export class ProductViewer {
  constructor(private products: ProductLoaderService) {}

  async addLamp() {
    const lampProduct: Product3D = {
      id: 'lamp_001',
      name: 'Luminária Premium',
      description: 'Luminária de teto moderna',
      modelPath: '/assets/models/lamp.glb',  // Arquivo GLB/GLTF
      position: { x: 0, y: 2, z: 0 },
      scale: 1,
      rotation: { x: 0, y: 0, z: 0 },
      material: {
        baseColor: '#FFFFFF',
        roughness: 0.3,
        metallic: 0.8
      },
      emitsLight: true,
      lightProperties: {
        color: '#FFD700',
        intensity: 1.2,
        range: 15,
        temperature: 2700 // Kelvin
      }
    };

    await this.products.loadProduct(lampProduct);
  }

  updateLampColor(productId: string, hexColor: string) {
    this.products.updateProductLightColor(productId, hexColor);
  }
}
```

## 📊 Performance

### Otimizações Implementadas
- ✅ Frustum culling (não renderiza objetos fora da câmera)
- ✅ LOD (Level of Detail) para modelos complexos
- ✅ Sombras de alta qualidade com blur
- ✅ PBR para realismo com performance
- ✅ Shadow PCF para sombras macias
- ✅ Pooling de materiais (reuso de materiais iguais)

### FPS Esperado
- Desktop moderno: **60 FPS**
- Laptop: **30-50 FPS**
- Mobile: **20-30 FPS**

## 🔍 Debugging

```typescript
import { BabylonService } from './services/babylon.service';

export class DebugTools {
  constructor(private babylon: BabylonService) {}

  showPerformance() {
    const perf = this.babylon.getPerformanceInfo();
    console.log(`
      FPS: ${perf.fps}
      Meshes: ${perf.meshes}
      Lights: ${perf.lights}
      Triangles: ${perf.triangles}
    `);
  }

  // Ativar inspector do Babylon
  toggleInspector() {
    const scene = this.babylon.getScene();
    if (scene) {
      scene.debugLayer.show();
    }
  }
}
```

## 📱 Responsividade

O sistema funciona em:
- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablet
- ✅ Mobile (com controles adaptados)

## 🚨 Troubleshooting

### Canvas em branco
- Verificar se arquivo HTML tem `#renderCanvas`
- Confirmar que Babylon.js está carregado
- Verificar console para erros

### Sombras não aparecem
- Habilitar `shadowMap: true` no preset de iluminação
- Usar `DirectionalLight` ou `SpotLight` (não PointLight)
- Adicionar meshes ao shadow generator

### Performance baixa
- Reduzir `maxTextureSize` em babylon-config.ts
- Desabilitar bloom em presets desnecessários
- Reduzir número de luzes máximas
- Usar modelos 3D otimizados (fewer polygons)

## 🎓 Recursos Adicionais

- [Documentação Babylon.js](https://doc.babylonjs.com/)
- [Playground Babylon.js](https://www.babylonjs-playground.com/)
- [PBR Material Generator](https://www.babylonjs-playground.com/index.html?29)

## 📄 Licença

Este sistema é parte do projeto RaitoCorp e segue os termos de licença do projeto principal.

---

**Desenvolvido com ❤️ usando Babylon.js v6**

Para dúvidas ou melhorias, entre em contato com o time de desenvolvimento!