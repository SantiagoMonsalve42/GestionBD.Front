import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LoadingComponent } from './core/components/loading/loading.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, CardModule, InputTextModule, TagModule, ToastModule, FooterComponent, LoadingComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('GestionBD.Front');
  
  onButtonClick() {
    alert('¡PrimeNG está funcionando correctamente! 🎉');
  }
}
