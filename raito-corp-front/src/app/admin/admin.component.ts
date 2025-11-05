import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  currentUser = 'Admin Raitõ';

  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([`/admin/${path}`]);
  }

  goBack() {
    this.router.navigate(['/']);
  }

  isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }
}
