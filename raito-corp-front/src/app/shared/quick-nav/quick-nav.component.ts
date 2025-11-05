import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

export interface QuickNavItem {
  label: string;
  route: string;
  icon?: string;
  current?: boolean;
}

@Component({
  selector: 'app-quick-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quick-nav.component.html',
  styleUrl: './quick-nav.component.scss'
})
export class QuickNavComponent {
  @Input() currentPage: string = '';
  @Input() showAdminLink: boolean = false;

  isOpen = false;

  navItems: QuickNavItem[] = [
    { label: 'Home', route: '/', icon: 'home' },
    { label: 'Produtos', route: '/catalogo', icon: 'package' },
    { label: 'Visualizador 3D', route: '/visualizador-3d', icon: 'box' },
    { label: 'Carrinho', route: '/carrinho', icon: 'shopping-cart' },
    { label: 'Login/Cadastro', route: '/login', icon: 'user' },
  ];

  constructor(private router: Router) {}

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

  isCurrentPage(route: string): boolean {
    return this.currentPage === route || this.router.url === route;
  }
}
