import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-top-nav',
  standalone:false,
  templateUrl: './admin-top-nav.component.html',
  styleUrl: './admin-top-nav.component.scss'
})
export class AdminTopNavComponent {
isSidebarOpen: boolean = false;

toggleSidebar() {
  this.isSidebarOpen = !this.isSidebarOpen;
}
}
