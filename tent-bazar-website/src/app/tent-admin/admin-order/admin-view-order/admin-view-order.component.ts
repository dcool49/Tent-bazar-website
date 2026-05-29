import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DeleteConfirmModalComponent } from '../../../data-model/delete-confirm-modal/delete-confirm-modal.component';
import { ProductDetailsComponent } from '../../../product-details/product-details.component';

@Component({
  selector: 'app-admin-view-order',
  standalone:false,
  templateUrl: './admin-view-order.component.html',
  styleUrl: './admin-view-order.component.scss'
})
export class AdminViewOrderComponent implements OnInit {
  orderData:any;
  category: any;
  selectedID: any;
  employeeList: any;
  employeeId:any;
  statusList =['TO-DO','In-progress','Done','Cancle','Hold'];
  selectedStatus:any;
  canAssignEmployee = ['admin', 'manager'].includes(localStorage.getItem('role') || '');
  showAddProduct = false;
  productSearch = '';
  productSearchResults: any[] = [];
  searchingProducts = false;
  showUnsavedWarning = false;

  private originalStatus: any;
  private originalEmployeeId: any;
  private originalProductDetails: any[] = [];

  constructor(public dataService: DataService,public dialog: MatDialog,private route: Router,private location: Location){
    if(this.dataService.selectedOrder){
      this.employeeId = this.dataService.selectedOrder?.empId?._id || '';
      this.selectedStatus = this.dataService.selectedOrder.status;
      this.originalStatus = this.selectedStatus;
      this.originalEmployeeId = this.employeeId;
      this.getCatList();
    }
  }
  ngOnInit(): void {
    if(!this.dataService.selectedOrder){
      window.history.back();
    }else{
      this.getorder();
      this.getemployeeList();
    }

  }

  getCatList() {
    const url = 'category/fetch';
    this.dataService.getAPICall(url).subscribe(
      (res: any) => {
        this.category = res.data;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  getcatName(id: any): String {
    if (this.category.length > 1) {
      const index = this.category.findIndex((val: any) => id === val._id);
      if (index !== -1) {
        return this.category[index]?.categoryName;
      } else {
        return '-';
      }
    } else {
      return '-';
    }
  }


    openDialog(prod: any,index:number): void {
      this.selectedID = prod.productId._id;
      const dialogRef = this.dialog.open(DeleteConfirmModalComponent, {
        width: '500px',
        data: {
          heading: 'Delete Product',
          msg: 'Are you sure you want to delete',
          name: prod.productId.productName,
        },
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.deleteProduct(this.selectedID,index);
        }
      });
    }
  deleteProduct(selectedID: any,i:number) {
    this.orderData.productDetails.splice(i, 1);
  }
  
    openViewDialog(prod: any): void {
      localStorage.setItem('productId', prod.productId._id);
      const dialogRef = this.dialog.open(ProductDetailsComponent, {
        width: '90vw',
        maxWidth: '900px',
        data: { adminView: true },
      });

      dialogRef.afterClosed().subscribe((result) => {
      });
    }
    goBack() {
      this.location.back();
    }

    hasUnsavedChanges(): boolean {
      if (this.selectedStatus !== this.originalStatus) return true;
      if (this.employeeId !== this.originalEmployeeId) return true;
      const current = this.orderData?.productDetails || [];
      if (current.length !== this.originalProductDetails.length) return true;
      for (let i = 0; i < current.length; i++) {
        const orig = this.originalProductDetails[i];
        if (current[i].productId?._id !== orig.productId?._id) return true;
        if ((current[i].quantity || 1) !== (orig.quantity || 1)) return true;
      }
      return false;
    }

    onCancelClick() {
      if (this.hasUnsavedChanges()) {
        this.showUnsavedWarning = true;
      } else {
        this.location.back();
      }
    }

    confirmCancel() {
      this.showUnsavedWarning = false;
      this.location.back();
    }

    dismissCancel() {
      this.showUnsavedWarning = false;
    }

    urlRout(path: any) {
      this.route.navigate(['/admin-home/' + path])
    }
 
    getorder() {
      const url = 'order/fetch';
      const payload = { _id: this.dataService.selectedOrder._id };
      this.dataService.postAPICall(url, payload).subscribe({
        next: (res: any) => {
          this.orderData = res.data[0];
          this.originalProductDetails = JSON.parse(JSON.stringify(res.data[0]?.productDetails || []));
        },
        error: (err) => {
          console.error(err);
        }
      });
    }

orderUpdate(){
  const payload={
    _id:this.orderData._id,
    empId:this.employeeId,
    productDetails: this.orderData.productDetails,
    status:this.selectedStatus
  }
  const url = 'order/update';
  this.dataService.patchApiCall(url,payload).subscribe(
    (res: any) => {
     this.goBack()
    },
    (err) => {
      console.error(err);
    }
  )
}

downloadPdf() {
  const order = this.orderData;
  const orderId = this.dataService.selectedOrder?.orderId || '';
  const date = order?.createdAt
    ? new Date(order.createdAt).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      })
    : '—';

  const productRows = (order?.productDetails || []).map((prod: any, i: number) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#888;">${i + 1}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-weight:500;color:#222;">
        <div style="display:flex;align-items:center;gap:10px;">
          <img src="${prod.productId?.image?.[0]?.img_name || ''}"
               style="width:40px;height:40px;object-fit:cover;border-radius:8px;border:1px solid #eee;"
               onerror="this.style.display='none'" />
          <span>${prod.productId?.productName || '—'}</span>
        </div>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#555;">${this.getcatName(prod.productId?.category_id)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#222;">&#8377; ${prod.productId?.price || '—'}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:center;color:#222;">${prod.quantity || 1}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#222;">&#8377; ${((prod.productId?.price || 0) * (prod.quantity || 1)).toFixed(2)}</td>
    </tr>`).join('');

  const totalAmount = (order?.productDetails || []).reduce(
    (sum: number, prod: any) => sum + ((prod.productId?.price || 0) * (prod.quantity || 1)), 0
  );

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Order #${orderId}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; background: #fff; color: #333; padding: 32px; font-size: 14px; }
    .header { border-bottom: 2px solid #4f46e5; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
    .header h1 { font-size: 22px; font-weight: 700; color: #1e1b4b; }
    .header h1 span { color: #4f46e5; }
    .header .meta { font-size: 12px; color: #666; margin-top: 4px; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: #e0e7ff; color: #4f46e5; }
    .section { background: #fafafa; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; margin-bottom: 20px; }
    .section h2 { font-size: 14px; font-weight: 700; color: #374151; margin-bottom: 14px; letter-spacing: 0.03em; text-transform: uppercase; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
    .info-row { display: flex; gap: 8px; margin-bottom: 10px; align-items: flex-start; }
    .info-label { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }
    .info-value { font-size: 13px; font-weight: 500; color: #111827; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #f3f4f6; }
    th { text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; padding: 10px 12px; border-bottom: 2px solid #e5e7eb; }
    th:last-child, td:last-child { text-align: right; }
    .total-row td { font-weight: 700; font-size: 15px; color: #111827; border-top: 2px solid #e5e7eb; padding: 14px 12px; }
    .footer { margin-top: 28px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 12px; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>Order <span>#${orderId}</span></h1>
      <div class="meta">Date: ${date}</div>
    </div>
    <div>
      <span class="status-badge">${this.selectedStatus}</span>
    </div>
  </div>

  <div class="section">
    <h2>Customer Details</h2>
    <div class="info-row">
      <div style="min-width:120px">
        <div class="info-label">Customer Name</div>
        <div class="info-value">${order?.buyerId?.name || '—'}</div>
      </div>
      <div style="min-width:140px">
        <div class="info-label">Mobile</div>
        <div class="info-value">${order?.buyerId?.mobile || '—'}</div>
      </div>
    </div>
    <div class="info-row">
      <div>
        <div class="info-label">Delivery Address</div>
        <div class="info-value">${order?.addressLine || '—'}${order?.city ? ', ' + order.city : ''}${order?.state ? ', ' + order.state : ''}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Products (${order?.productDetails?.length || 0})</h2>
    <table>
      <thead>
        <tr>
          <th style="width:40px">#</th>
          <th>Product</th>
          <th>Category</th>
          <th>Unit Price</th>
          <th style="text-align:center">Qty</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${productRows || `<tr><td colspan="6" style="padding:20px;text-align:center;color:#9ca3af;">No products</td></tr>`}
        <tr class="total-row">
          <td colspan="5" style="padding:14px 12px;border-top:2px solid #e5e7eb;font-weight:700;color:#111827;font-size:15px;">Grand Total</td>
          <td style="padding:14px 12px;border-top:2px solid #e5e7eb;font-weight:700;color:#4f46e5;font-size:15px;text-align:right;">&#8377; ${totalAmount.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="footer">Generated on ${new Date().toLocaleString('en-IN')} &nbsp;|&nbsp; Tent Bazar</div>
</body>
</html>`;

  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  }
}

toggleAddProduct() {
  this.showAddProduct = !this.showAddProduct;
  if (!this.showAddProduct) {
    this.productSearch = '';
    this.productSearchResults = [];
  }
}

private debounceTimer: any;
onProductSearch() {
  clearTimeout(this.debounceTimer);
  if (!this.productSearch.trim()) {
    this.productSearchResults = [];
    return;
  }
  this.debounceTimer = setTimeout(() => {
    this.searchingProducts = true;
    const url = 'product/fetch?search=' + encodeURIComponent(this.productSearch.trim());
    this.dataService.getAPICall(url).subscribe({
      next: (res: any) => {
        this.productSearchResults = res.data || [];
        this.searchingProducts = false;
      },
      error: () => {
        this.searchingProducts = false;
      }
    });
  }, 350);
}

addProductToOrder(prod: any) {
  const alreadyAdded = this.orderData.productDetails?.some(
    (p: any) => p.productId?._id === prod._id
  );
  if (!alreadyAdded) {
    this.orderData.productDetails.push({ productId: prod, quantity: 1 });
  }
  this.showAddProduct = false;
  this.productSearch = '';
  this.productSearchResults = [];
}

increaseQty(prod: any) {
  prod.quantity = (prod.quantity || 1) + 1;
}

decreaseQty(prod: any) {
  if ((prod.quantity || 1) > 1) {
    prod.quantity = prod.quantity - 1;
  }
}

getemployeeList(){
  const url = 'user/v2/fetch?role=employee';
  this.dataService.getAPICall(url).subscribe(
    (res:any) => {
      this.employeeList = res.data;
    },
    (err) => {
      console.error(err);
    }
  );
}

}
