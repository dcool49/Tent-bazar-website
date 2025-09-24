import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';  // ✅ add this
import { MatDialogModule } from '@angular/material/dialog';
//import { DataModelComponent } from './data-model/data-model.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    HeaderComponent,
    FooterComponent,
    RouterModule,HttpClientModule,
    CommonModule,
    MatDialogModule,
    // DataModelComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tent-bazar-website';
  hideSomePage = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // hide header only on admin-login route
        this.hideSomePage = event.url !== '/admin-login';
      });
  }
}
