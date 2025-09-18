import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';   // ⬅️ Needed for *ngIf, *ngFor
import { RouterModule } from '@angular/router';   // ⬅️ Needed for routerLink, routerLinkActive

@Component({
  selector: 'app-header',
  standalone: true,             // ⬅️ Mark it standalone
  imports: [CommonModule, RouterModule],  // ⬅️ Add Angular directives here
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']  // ⬅️ fix: use styleUrls (plural)
})
export class HeaderComponent {
  constructor(private route: Router) {}

  urlRout(path: string) {
    this.route.navigate(['/' + path]);
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
