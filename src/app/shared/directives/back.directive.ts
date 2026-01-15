import { Directive, HostListener, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Directive({
  selector: '[appBack]',
  standalone: true
})
export class AppBackDirective {
  private location = inject(Location);
  private router = inject(Router);

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const from = history.state?.from;
    if (from) {
      this.router.navigateByUrl(from);
      return;
    }
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/privado/dashboard']);
    }
  }
}
