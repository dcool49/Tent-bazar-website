import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminCrmRoutingModule } from './admin-crm-routing.module';
import { AdminCategoryComponent } from '../admin-category/admin-category.component';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { AdminEmployeeComponent } from '../admin-employee/admin-employee.component';
import { AdminHomeComponent } from '../admin-home/admin-home.component';
import { AdminInstagramUrlComponent } from '../admin-instagram-url/admin-instagram-url.component';
import { AdminOrderComponent } from '../admin-order/admin-order.component';
import { AdminProductsComponent } from '../admin-products/admin-products.component';
import { AdminUsersComponent } from '../admin-users/admin-users.component';
import { AdminYoutubeUrlComponent } from '../admin-youtube-url/admin-youtube-url.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AdminTopNavComponent } from '../admin-top-nav/admin-top-nav.component';
import { AdminBannerComponent } from '../admin-banner/admin-banner.component';
import { AdminViewOrderComponent } from '../admin-order/admin-view-order/admin-view-order.component';
import { AddCategoryComponent } from '../admin-category/add-category/add-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AdminCategoryComponent,
    AdminDashboardComponent,
    AdminEmployeeComponent,
    AdminHomeComponent,
    AdminInstagramUrlComponent,
    AdminOrderComponent,
    AdminProductsComponent,
    AdminUsersComponent,
    AdminYoutubeUrlComponent,
    AdminTopNavComponent,
    AdminBannerComponent,
    AdminViewOrderComponent,
    AddCategoryComponent,
  ],
  imports: [CommonModule, AdminCrmRoutingModule, NgxPaginationModule,FormsModule,ReactiveFormsModule],
})
export class AdminCrmModule {}
