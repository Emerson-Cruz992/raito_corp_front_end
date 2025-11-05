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
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./admin/products-management/products-management.component').then(m => m.ProductsManagementComponent)
      },
      {
        path: 'stock',
        loadComponent: () => import('./admin/stock-management/stock-management.component').then(m => m.StockManagementComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./admin/orders-management/orders-management.component').then(m => m.OrdersManagementComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];