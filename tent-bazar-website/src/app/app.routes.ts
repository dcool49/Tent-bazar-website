import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartDetailsComponent } from './cart-details/cart-details.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { ProductListSearchComponent } from './product-list-search/product-list-search.component';
import { EnquiryFormComponent } from './enquiry-form/enquiry-form.component';
import { AdminHomeComponent } from './tent-admin/admin-home/admin-home.component';
import { ThankYouComponent } from './enquiry-form/thank-you/thank-you.component';
import { OfferServiceComponent } from './landing-sections/offer-service/offer-service.component';
import { MobileSectionComponent } from './landing-sections/mobile-section/mobile-section.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'sub-category', component: SubCategoryComponent },
  { path: 'details', component: ProductDetailsComponent },
  { path: 'cart', component: CartDetailsComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'product-search/:search', component: ProductListSearchComponent },
  { path: 'enquiry', component: EnquiryFormComponent },
  {path: 'catogery', component:OfferServiceComponent},
  {path: 'mobile-app', component:MobileSectionComponent},
  {path: 'contact', component: ContactUsComponent},
  {
    path: 'admin-home',
    canActivate: [authGuard],
    loadChildren: (): any =>
      import('../app/tent-admin/admin-crm/admin-crm.module').then(
        (m) => m.AdminCrmModule
      ),
  },
  { path: 'thankyou', component: ThankYouComponent },
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
