import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QuickNavComponent } from './shared/quick-nav/quick-nav.component';
import { NotificationComponent } from './shared/notification/notification.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, QuickNavComponent, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'raito-corp-front';
}
