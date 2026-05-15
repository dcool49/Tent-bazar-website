import { NgModule } from '@angular/core';
import { provideRouter, RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from '../admin-home/admin-home.component';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { AdminOrderComponent } from '../admin-order/admin-order.component';
import { AdminUsersComponent } from '../admin-users/admin-users.component';
import { AdminEmployeeComponent } from '../admin-employee/admin-employee.component';
import { AdminProductsComponent } from '../admin-products/admin-products.component';
import { AdminCategoryComponent } from '../admin-category/admin-category.component';
import { AdminYoutubeUrlComponent } from '../admin-youtube-url/admin-youtube-url.component';
import { AdminInstagramUrlComponent } from '../admin-instagram-url/admin-instagram-url.component';
import { AddProductComponent } from '../admin-products/add-product/add-product.component';
import { AdminBannerComponent } from '../admin-banner/admin-banner.component';
import { AdminViewOrderComponent } from '../admin-order/admin-view-order/admin-view-order.component';
import { AdminProfileComponent } from '../admin-profile/admin-profile.component';
import { roleGuard } from '../../guard/role.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminHomeComponent,
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'Dashboard', component: AdminDashboardComponent },
      { path: 'Orders', component: AdminOrderComponent },
      { path: 'Users', component: AdminUsersComponent },
      { path: 'Products', component: AdminProductsComponent },
      { path: 'Category', component: AdminCategoryComponent },
      { path: 'view-order', component: AdminViewOrderComponent },
      { path: 'Employees', component: AdminEmployeeComponent, canActivate: [roleGuard] },
      { path: 'YouTube', component: AdminYoutubeUrlComponent, canActivate: [roleGuard] },
      { path: 'Instagram', component: AdminInstagramUrlComponent, canActivate: [roleGuard] },
      { path: 'AddProduct', component: AddProductComponent, canActivate: [roleGuard] },
      { path: 'banner', component: AdminBannerComponent, canActivate: [roleGuard] },
      { path: 'Profile', component: AdminProfileComponent, canActivate: [roleGuard] },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [provideRouter(routes)],
})
export class AdminCrmRoutingModule {}
