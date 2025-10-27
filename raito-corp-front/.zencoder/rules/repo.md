---
description: Repository Information Overview
alwaysApply: true
---

# Raito Corp Front Information

## Summary
An Angular-based frontend application for Raito Corp, featuring a 3D visualization component for lighting environments. The project uses Babylon.js for 3D rendering and provides an interactive interface for exploring different lighting setups, environments, and camera perspectives.

## Structure
- **src/app**: Main application code with feature modules
- **src/app/visualizador-3d**: 3D visualization component with Babylon.js integration
- **src/app/shared**: Shared components and utilities
- **src/app/home**, **src/app/catalog**, **src/app/product-detail**: Feature modules
- **public**: Static assets and resources
- **dist**: Build output directory

## Language & Runtime
**Language**: TypeScript
**Version**: TypeScript 5.7.2
**Framework**: Angular 19.2.0
**Build System**: Angular CLI 19.2.12
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- Angular Core/Common/Router (^19.2.0)
- Babylon.js Core/Loaders/Materials (^6.0.0)
- RxJS (~7.8.0)

**Development Dependencies**:
- Angular CLI/DevKit (^19.2.12)
- Jasmine/Karma (Testing)
- TypeScript (~5.7.2)

## Build & Installation
```bash
npm install
ng serve  # Development server
ng build  # Production build
```

## 3D Visualization Component

### Features
- Interactive 3D environment for lighting visualization
- Multiple lighting presets (12 professional lighting configurations)
- 9 predefined environments (rooms, bathrooms, bedrooms)
- Camera control system with 9 preset views
- PBR (Physically Based Rendering) materials
- Shadow mapping and post-processing effects

### Architecture
- **Services**: Babylon, Lighting, Environment, Camera Control, Material, Product Loader
- **Components**: Main visualizer, Controls UI, Environment/Lighting selectors
- **Configs**: Presets for lighting, environments, cameras
- **Models**: TypeScript interfaces for configuration

### Camera System
The camera system uses Babylon.js ArcRotateCamera with:
- Orbit controls for user navigation
- Zoom in/out functionality
- Preset positions for different viewing angles
- Auto-rotation for presentation mode
- Animation between camera positions

### Lighting System
- Directional, point, and spotlight support
- Shadow mapping with PCF filtering
- Bloom and color grading effects
- 12 professional lighting presets across 4 categories

### Environment System
- 9 predefined environments across 3 categories
- Realistic room geometry with walls, floors, ceilings
- PBR materials for realistic surfaces
- Furniture placement

## Testing
**Framework**: Jasmine/Karma
**Test Location**: Spec files alongside components
**Run Command**:
```bash
ng test
```