import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QuickNavComponent } from './shared/quick-nav/quick-nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, QuickNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'raito-corp-front';
}
