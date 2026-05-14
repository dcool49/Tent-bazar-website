import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: 'my-orders', loadComponent: () => import('./user-orders/user-orders.component').then(m => m.UserOrdersComponent) },
  { path: 'my-profile', loadComponent: () => import('./user-profile/user-profile.component').then(m => m.UserProfileComponent) },
  { path: 'about-us', loadComponent: () => import('./about-us/about-us.component').then(m => m.AboutUsComponent) },
  { path: 'sub-category', loadComponent: () => import('./sub-category/sub-category.component').then(m => m.SubCategoryComponent) },
  { path: 'details', loadComponent: () => import('./product-details/product-details.component').then(m => m.ProductDetailsComponent) },
  { path: 'cart', loadComponent: () => import('./cart-details/cart-details.component').then(m => m.CartDetailsComponent) },
  { path: 'admin-login', loadComponent: () => import('./admin-login/admin-login.component').then(m => m.AdminLoginComponent) },
  { path: 'product-search/:search', loadComponent: () => import('./product-list-search/product-list-search.component').then(m => m.ProductListSearchComponent) },
  { path: 'enquiry', loadComponent: () => import('./enquiry-form/enquiry-form.component').then(m => m.EnquiryFormComponent) },
  { path: 'catogery', loadComponent: () => import('./landing-sections/offer-service/offer-service.component').then(m => m.OfferServiceComponent) },
  { path: 'mobile-app', loadComponent: () => import('./landing-sections/mobile-section/mobile-section.component').then(m => m.MobileSectionComponent) },
  { path: 'contact', loadComponent: () => import('./contact-us/contact-us.component').then(m => m.ContactUsComponent) },
  {
    path: 'admin-home',
    canActivate: [authGuard],
    loadChildren: (): any =>
      import('../app/tent-admin/admin-crm/admin-crm.module').then(
        (m) => m.AdminCrmModule
      ),
  },
  { path: 'thankyou', loadComponent: () => import('./enquiry-form/thank-you/thank-you.component').then(m => m.ThankYouComponent) },
  { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent), pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
