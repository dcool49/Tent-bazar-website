import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-top-nav',
  standalone: false,
  templateUrl: './admin-top-nav.component.html',
  styleUrl: './admin-top-nav.component.scss'
})
export class AdminTopNavComponent implements OnInit {
  @Output() sidebarToggle = new EventEmitter<void>();

  adminName = '';
  adminRole = '';
  adminInitial = 'A';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const stored = JSON.parse(localStorage.getItem('adminUser') || 'null');
    if (stored) {
      this.adminName    = stored.name || '';
      this.adminRole    = stored.role || '';
      this.adminInitial = stored.name ? stored.name.charAt(0).toUpperCase() : 'A';
    }
  }

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  logout() {
    this.authService.logout();
  }
}
