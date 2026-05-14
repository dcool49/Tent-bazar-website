import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-top-nav',
  standalone:false,
  templateUrl: './admin-top-nav.component.html',
  styleUrl: './admin-top-nav.component.scss'
})
export class AdminTopNavComponent {
  @Output() sidebarToggle = new EventEmitter<void>();
  constructor(private authService:AuthService){}

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  logout(){
    this.authService.logout();
  }
}
