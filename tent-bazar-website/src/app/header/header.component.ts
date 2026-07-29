import { Component, DoCheck, OnChanges, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';   // ⬅️ Needed for *ngIf, *ngFor
import { RouterModule } from '@angular/router';   // ⬅️ Needed for routerLink, routerLinkActive
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,             // ⬅️ Mark it standalone
  imports: [CommonModule, RouterModule,FormsModule],  // ⬅️ Add Angular directives here
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']  // ⬅️ fix: use styleUrls (plural)
})
export class HeaderComponent implements DoCheck {
  cartCount: number = 0;
  searchName: any = localStorage.getItem("searchName");
  isUserLoggedIn = false;
  userInitial = '';
  isMenuOpen = false;

  constructor(private route: Router) {
    this.route.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (!(event as NavigationEnd).urlAfterRedirects.startsWith('/product-search')) {
          this.searchName = '';
          localStorage.removeItem('searchName');
        }
      });
  }

  ngDoCheck(): void {
    const localStorageData = JSON.parse(localStorage.getItem("addedProduct") as any);
    this.cartCount = localStorageData ? localStorageData.length : 0;

    const userData = JSON.parse(localStorage.getItem('enquiryUserData') || 'null');
    this.isUserLoggedIn = !!(userData?.userId);
    this.userInitial = userData?.name ? userData.name.charAt(0).toUpperCase() : 'U';
  }

  logoutUser() {
    localStorage.removeItem('enquiryUserData');
    localStorage.removeItem('userId');
    this.isUserLoggedIn = false;
    this.closeMenu();
    this.route.navigate(['/home']);
  }

  urlRout(path: string) {
    this.route.navigate(['/' + path]);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
  onSearchNameChange(){
    localStorage.setItem("searchName", this.searchName);
  }
  searchProd(){
    localStorage.setItem("searchName",this.searchName);
    // this.urlRout('product-search');
    this.route.navigate(['/product-search', this.searchName])
  }
searchempty(){
  this.searchName = '';
  this.searchProd()
}
}
