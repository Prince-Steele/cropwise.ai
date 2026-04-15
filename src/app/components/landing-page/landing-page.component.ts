import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  isPublicMenuOpen = false;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  togglePublicMenu(): void {
    this.isPublicMenuOpen = !this.isPublicMenuOpen;
  }

  closePublicMenu(): void {
    this.isPublicMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closePublicMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closePublicMenu();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 760) {
      this.closePublicMenu();
    }
  }
}
