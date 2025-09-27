import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- add this

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {

}
