import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../cart.service';
import { Subject, takeUntil } from 'rxjs';

export interface QuickNavItem {
  label: string;
  route: string;
  icon?: string;
  current?: boolean;
  requiresAuth?: boolean;
  hideWhenAuth?: boolean;
}

@Component({
  selector: 'app-quick-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quick-nav.component.html',
  styleUrl: './quick-nav.component.scss'
})
export class QuickNavComponent implements OnInit, OnDestroy {
  @Input() currentPage: string = '';

  isOpen = false;
  isAuthenticated = false;
  isAdmin = false;
  userName: string = '';
  cartItemCount = 0;
  private destroy$ = new Subject<void>();

  navItems: QuickNavItem[] = [
    { label: 'Home', route: '/', icon: 'home' },
    { label: 'Produtos', route: '/catalogo', icon: 'package' },
    { label: 'Visualizador 3D', route: '/visualizador-3d', icon: 'box' },
    { label: 'Carrinho', route: '/carrinho', icon: 'shopping-cart', requiresAuth: true },
    { label: 'Login/Cadastro', route: '/login', icon: 'user', hideWhenAuth: true },
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    // Observar mudanças no estado de autenticação
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.isAuthenticated = !!user;
        this.isAdmin = this.authService.isAdmin();
        this.userName = user?.nome || '';
      });

    // Observar mudanças no carrinho
    this.cartService.items$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.cartItemCount = items.reduce((total, item) => total + item.qty, 0);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get visibleNavItems(): QuickNavItem[] {
    return this.navItems.filter(item => {
      if (item.hideWhenAuth && this.isAuthenticated) return false;
      if (item.requiresAuth && !this.isAuthenticated) return false;
      return true;
    });
  }

  toggleNav() {
    this.isOpen = !this.isOpen;
  }

  closeNav() {
    this.isOpen = false;
  }

  navigateToAdmin() {
    this.router.navigate(['/admin']);
    this.closeNav();
  }

  logout() {
    this.authService.logout();
    this.closeNav();
  }

  navigateToCart() {
    this.router.navigate(['/carrinho']);
  }

  isCurrentPage(route: string): boolean {
    return this.currentPage === route || this.router.url === route;
  }
}
