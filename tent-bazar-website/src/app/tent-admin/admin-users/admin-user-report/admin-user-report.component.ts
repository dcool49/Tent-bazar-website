import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-admin-user-report',
  standalone: false,
  templateUrl: './admin-user-report.component.html',
  styleUrl: './admin-user-report.component.scss',
})
export class AdminUserReportComponent implements OnInit {
  @ViewChild('reportContent') reportContent!: ElementRef;

  userId: string = '';
  userData: any = null;
  orders: any[] = [];
  loading = true;
  downloading = false;

  statusList = ['TO-DO', 'In-progress', 'Done', 'Cancle', 'Hold'];

  statusFilter: string = '';
  searchQuery: string = '';

  get filteredOrders(): any[] {
    let result = this.orders;
    if (this.statusFilter) {
      result = result.filter((o) => o.status === this.statusFilter);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter((o) =>
        o.orderId?.toString().toLowerCase().includes(q) ||
        o.productDetails?.some((p: any) =>
          p.productId?.productName?.toLowerCase().includes(q)
        )
      );
    }
    return result;
  }

  get totalOrders(): number { return this.orders.length; }

  get totalProducts(): number {
    return this.orders.reduce((sum, o) => sum + (o.productDetails?.length || 0), 0);
  }

  get statusCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const s of this.statusList) counts[s] = 0;
    for (const o of this.orders) {
      if (counts[o.status] !== undefined) counts[o.status]++;
      else counts[o.status] = (counts[o.status] || 0) + 1;
    }
    return counts;
  }

  get firstOrderDate(): string {
    if (!this.orders.length) return '—';
    const sorted = [...this.orders].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return new Date(sorted[0].createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  get lastOrderDate(): string {
    if (!this.orders.length) return '—';
    const sorted = [...this.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return new Date(sorted[0].createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dataService: DataService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    if (!this.userId) {
      this.goBack();
      return;
    }
    this.loadUserData();
    this.loadOrders();
  }

  loadUserData(): void {
    const url = `user/fetch?role=user&_id=${this.userId}`;
    this.dataService.getAPICall(url).subscribe({
      next: (res: any) => {
        this.userData = res.data?.[0] || null;
      },
      error: () => {},
    });
  }

  loadOrders(): void {
    this.loading = true;
    const url = 'order/fetch';
    this.dataService.postAPICall(url, { buyerId: this.userId }).subscribe({
      next: (res: any) => {
        this.orders = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  viewOrder(order: any): void {
    this.dataService.selectedOrder = order;
    this.router.navigate(['/admin-home/view-order']);
  }

  goBack(): void {
    this.router.navigate(['/admin-home/Users']);
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      'TO-DO': 'bg-gray-100 text-gray-600',
      'In-progress': 'bg-yellow-100 text-yellow-700',
      'Done': 'bg-green-100 text-green-700',
      'Cancle': 'bg-red-100 text-red-600',
      'Hold': 'bg-orange-100 text-orange-600',
    };
    return map[status] || 'bg-gray-100 text-gray-500';
  }

  clearFilters(): void {
    this.statusFilter = '';
    this.searchQuery = '';
  }

  async downloadReport(): Promise<void> {
    this.downloading = true;
    await new Promise(r => setTimeout(r, 150));

    const el: HTMLElement = this.reportContent.nativeElement;
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, logging: false });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgH = (canvas.height * pageW) / canvas.width;

    let remaining = imgH;
    let yOffset = 0;

    pdf.addImage(imgData, 'PNG', 0, yOffset, pageW, imgH);
    remaining -= pageH;

    while (remaining > 0) {
      yOffset -= pageH;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, yOffset, pageW, imgH);
      remaining -= pageH;
    }

    const name = this.userData?.name || 'User';
    pdf.save(`user-report-${name.replace(/\s+/g, '-')}.pdf`);
    this.downloading = false;
  }
}
