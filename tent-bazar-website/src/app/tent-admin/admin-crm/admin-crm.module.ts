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
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AddEmployeeComponent } from '../admin-employee/add-employee/add-employee.component';
import { ViewEmployeeComponent } from '../admin-employee/view-employee/view-employee.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AddAdminUserComponent } from '../admin-users/add-admin-user/add-admin-user.component';
import { AdminProfileComponent } from '../admin-profile/admin-profile.component';
import { AdminUserReportComponent } from '../admin-users/admin-user-report/admin-user-report.component';
import { AdminEmployeeReportComponent } from '../admin-employee/admin-employee-report/admin-employee-report.component';
import { EmployeeDashboardComponent } from '../employee-dashboard/employee-dashboard.component';
import { EmployeeOrderListComponent } from '../employee-order-list/employee-order-list.component';
import { AddOrderComponent } from '../admin-order/add-order/add-order.component';

@NgModule({
  declarations: [
    AdminCategoryComponent,
    AdminDashboardComponent,
    EmployeeDashboardComponent,
    EmployeeOrderListComponent,
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
    AddEmployeeComponent,
    ViewEmployeeComponent,
    AddAdminUserComponent,
    AdminProfileComponent,
    AdminUserReportComponent,
    AdminEmployeeReportComponent,
    AddOrderComponent
  ],
  imports: [
    CommonModule,
    AdminCrmRoutingModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    BaseChartDirective,
    MatDialogModule
  ],
  providers: [provideCharts(withDefaultRegisterables())],
})
export class AdminCrmModule {}
