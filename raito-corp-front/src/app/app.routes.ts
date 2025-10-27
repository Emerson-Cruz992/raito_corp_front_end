import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'catalogo', 
    loadComponent: () => import('./catalog/catalog.component').then(m => m.CatalogComponent)
  },
  {
    path: 'carrinho',
    loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'visualizador-3d',
    loadComponent: () => import('./visualizador-3d/visualizador-3d.component').then(m => m.Visualizador3dComponent)
  },
  { path: '**', redirectTo: '' }
];