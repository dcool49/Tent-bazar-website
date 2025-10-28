import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-top-nav',
  standalone:false,
  templateUrl: './admin-top-nav.component.html',
  styleUrl: './admin-top-nav.component.scss'
})
export class AdminTopNavComponent {
isSidebarOpen: boolean = false;
constructor(private authService:AuthService){}
toggleSidebar() {
  this.isSidebarOpen = !this.isSidebarOpen;
}
logout(){
  
this.authService.logout();
}
}
