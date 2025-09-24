import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartDetailsComponent } from './cart-details/cart-details.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { ProductListSearchComponent } from './product-list-search/product-list-search.component';
import { EnquiryFormComponent } from './enquiry-form/enquiry-form.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'about-us', component: AboutUsComponent },
    { path: 'sub-category', component: SubCategoryComponent },
    { path: 'details', component: ProductDetailsComponent },
    { path: 'cart', component: CartDetailsComponent },
    { path: 'admin-login', component: AdminLoginComponent },
    { path: 'product-search/:search', component: ProductListSearchComponent},
    { path: 'enquiry', component: EnquiryFormComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: '' },
];
