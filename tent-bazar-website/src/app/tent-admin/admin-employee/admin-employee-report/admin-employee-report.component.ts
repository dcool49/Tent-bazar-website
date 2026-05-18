import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { ChartData, ChartOptions } from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-admin-employee-report',
  standalone: false,
  templateUrl: './admin-employee-report.component.html',
  styleUrl: './admin-employee-report.component.scss',
})
export class AdminEmployeeReportComponent implements OnInit {
  @ViewChild('reportContent') reportContent!: ElementRef;

  empId: string = '';
  empData: any = null;
  orders: any[] = [];
  loading = true;
  downloading = false;

  statusList = ['TO-DO', 'In-progress', 'Done', 'Cancle', 'Hold'];
  statusFilter: string = '';
  searchQuery: string = '';

  // --- Donut Chart (Status Breakdown) ---
  donutChartData: ChartData<'doughnut'> = {
    labels: ['TO-DO', 'In-Progress', 'Done', 'Cancelled', 'Hold'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0],
        backgroundColor: ['#e5e7eb', '#fef08a', '#86efac', '#fca5a5', '#fdba74'],
        borderColor: ['#d1d5db', '#eab308', '#22c55e', '#ef4444', '#f97316'],
        borderWidth: 1.5,
      },
    ],
  };
  donutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    cutout: '68%',
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
    },
  };

  // --- Bar Chart (Monthly Orders) ---
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Orders',
        data: [],
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: '#6366f1',
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
      x: { grid: { display: false } },
    },
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dataService: DataService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('empId') || '';
    if (!this.empId) {
      this.goBack();
      return;
    }
    this.loadEmpData();
    this.loadOrders();
  }

  loadEmpData(): void {
    const url = `user/fetch?role=employee&_id=${this.empId}`;
    this.dataService.getAPICall(url).subscribe({
      next: (res: any) => {
        this.empData = res.data?.[0] || null;
      },
      error: () => {},
    });
  }

  loadOrders(): void {
    this.loading = true;
    this.dataService.postAPICall('order/fetch', { empId: this.empId }).subscribe({
      next: (res: any) => {
        this.orders = res.data || [];
        this.loading = false;
        this.buildCharts();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  buildCharts(): void {
    const sc = this.statusCounts;
    this.donutChartData = {
      ...this.donutChartData,
      datasets: [
        {
          ...this.donutChartData.datasets[0],
          data: [
            sc['TO-DO'] || 0,
            sc['In-progress'] || 0,
            sc['Done'] || 0,
            sc['Cancle'] || 0,
            sc['Hold'] || 0,
          ],
        },
      ],
    };

    const monthlyCounts: Record<string, number> = {};
    for (const o of this.orders) {
      const d = new Date(o.createdAt);
      const key = d.toLocaleString('en-IN', { month: 'short', year: '2-digit' });
      monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
    }
    const sortedMonths = Object.keys(monthlyCounts).sort((a, b) => {
      const parse = (s: string) => new Date('1 ' + s);
      return parse(a).getTime() - parse(b).getTime();
    });
    this.barChartData = {
      labels: sortedMonths,
      datasets: [
        { ...this.barChartData.datasets[0], data: sortedMonths.map((m) => monthlyCounts[m]) },
      ],
    };
  }

  get filteredOrders(): any[] {
    let result = this.orders;
    if (this.statusFilter) result = result.filter((o) => o.status === this.statusFilter);
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderId?.toString().toLowerCase().includes(q) ||
          o.productDetails?.some((p: any) => p.productId?.productName?.toLowerCase().includes(q))
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
      counts[o.status] = (counts[o.status] || 0) + 1;
    }
    return counts;
  }

  get firstOrderDate(): string {
    if (!this.orders.length) return '—';
    const sorted = [...this.orders].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return new Date(sorted[0].createdAt).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  }

  get lastOrderDate(): string {
    if (!this.orders.length) return '—';
    const sorted = [...this.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return new Date(sorted[0].createdAt).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  }

  get completionRate(): string {
    if (!this.orders.length) return '0';
    return ((this.statusCounts['Done'] / this.orders.length) * 100).toFixed(0);
  }

  viewOrder(order: any): void {
    this.dataService.selectedOrder = order;
    this.router.navigate(['/admin-home/view-order']);
  }

  goBack(): void {
    this.router.navigate(['/admin-home/Employees']);
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

    const name = this.empData?.name || 'Employee';
    pdf.save(`employee-report-${name.replace(/\s+/g, '-')}.pdf`);
    this.downloading = false;
  }
}
