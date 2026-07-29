import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common'; 
import { MatDialogModule } from '@angular/material/dialog';
import { LoaderComponent } from './loader/loader.component';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    RouterModule,
    HttpClientModule,
    CommonModule,
    MatDialogModule,
    // DataModelComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'tent-bazar-website';
  hideSomePage = true;
  loadingValue: any;
  private isBackOrForwardNavigation = false;

  constructor(
    private router: Router,
    public dataService: DataService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: any) => {
        this.isBackOrForwardNavigation = event.navigationTrigger === 'popstate';
        // Lets list pages (product list / sub-category) know they should
        // scroll back to the last-viewed product instead of staying at the top.
        sessionStorage.setItem('navTrigger', event.navigationTrigger || 'imperative');
      });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // hide header only on admin-login route
        const url = event.url;
        this.hideSomePage = event.url !== '/admin-login';
        this.hideSomePage = !url.includes('admin');
        // Skip forcing scroll to top on browser back/forward so the router
        // can restore the user's previous scroll position (e.g. back to a
        // product list should return to the clicked product, not the top).
        if (!this.isBackOrForwardNavigation) {
          window.scrollTo(0, 0);
        }
      });
    this.dataService.isLoading$.subscribe((res: any) => {
      this.loadingValue = res;
      this.changeDetectorRef.detectChanges();
    });
  }
}
