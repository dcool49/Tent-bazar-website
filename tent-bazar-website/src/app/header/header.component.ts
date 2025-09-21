import { Component, DoCheck, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';   // ⬅️ Needed for *ngIf, *ngFor
import { RouterModule } from '@angular/router';   // ⬅️ Needed for routerLink, routerLinkActive
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,             // ⬅️ Mark it standalone
  imports: [CommonModule, RouterModule,FormsModule],  // ⬅️ Add Angular directives here
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']  // ⬅️ fix: use styleUrls (plural)
})
export class HeaderComponent implements DoCheck {
  cartCount:number=0;
  searchName:any = localStorage.getItem("searchName");
  constructor(private route: Router) {}
  ngDoCheck(): void {
    const localStorageData = JSON.parse(localStorage.getItem("addedProduct") as any);
    this.cartCount = localStorageData.length;
    console.log("cartCount",this.cartCount);
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //  const localStorageData = JSON.parse(localStorage.getItem("addedProduct") as any);
  //   this.cartCount = localStorageData.length();
  //   console.log("cartCount",this.cartCount);
  // }

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
  searchProd(){
    localStorage.setItem("searchName",this.searchName);
    // this.urlRout('product-search');
    this.route.navigate(['/product-search', this.searchName])
  }

}
