import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, DividerModule, ButtonModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>GestionBD</h3>
          <p>Sistema de Gestión de Base de Datos</p>
        </div>
        
        <div class="footer-section">
          <h4>Contacto</h4>
          <p><i class="pi pi-envelope"></i> santi.monsalve09&#64;gmail.com</p>
          <p><i class="pi pi-phone"></i> +57 (318) 329-7055</p>
        </div>
        
        <div class="footer-section">
          <h4>Redes Sociales</h4>
          <div class="social-links">
            <p-button 
              icon="pi pi-linkedin" 
              [rounded]="true" 
              [text]="true" 
              (click)="openUrl()"
              severity="contrast"
              styleClass="social-btn">
            </p-button>
          </div>
        </div>
      </div>
           
      <div class="footer-bottom">
        <p><i class="pi pi-copyright"></i> {{ currentYear }} GestionBD. Todos los derechos reservados.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: linear-gradient(135deg,#11998e 0%,#38ef7d 100%) !important;
      color: white;
      margin-top: auto;
      padding: 2rem;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1.5rem;
      align-items: start;
    }

    .footer-section h3 {
      margin: 0 0 0.3rem 0;
      font-size: 1.2rem;
      font-weight: bold;
    }

    .footer-section h4 {
      margin: 0 0 0.5rem 0;
      font-size: 0.95rem;
      font-weight: 600;
      opacity: 0.9;
    }

    .footer-section p {
      margin: 0.3rem 0;
      opacity: 0.85;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .footer-section p i {
      font-size: 0.8rem;
    }

    .social-links {
      display: flex;
      gap: 0.5rem;
    }

    ::ng-deep .social-btn {
      color: white !important;
    }

    ::ng-deep .social-btn:hover {
      background: rgba(255, 255, 255, 0.2) !important;
    }

    ::ng-deep .p-divider {
      margin: 1rem 0 0.8rem 0;
    }

    ::ng-deep .p-divider::before {
      border-top-color: rgba(255, 255, 255, 0.3);
    }

    .footer-bottom {
      text-align: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .footer-bottom p {
      margin: 0;
      opacity: 0.85;
      font-size: 0.8rem;
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
    }

    @media (max-width: 768px) {
      .footer {
        padding: 1rem 0.5rem 0.8rem;
      }

      .footer-content {
        grid-template-columns: 1fr;
        gap: 1rem;
        text-align: center;
      }

      .footer-section p {
        justify-content: center;
      }

      .social-links {
        justify-content: center;
      }
    }
  `]
})
export class FooterComponent {
  currentYear : number = new Date().getFullYear();
  linkedInLink: string = "https://www.linkedin.com/in/andr%C3%A9s-santiago-monsalve-salinas-4081a41b9/"
  openUrl(): void{
     window.open(this.linkedInLink, "_blank");
  }
}
