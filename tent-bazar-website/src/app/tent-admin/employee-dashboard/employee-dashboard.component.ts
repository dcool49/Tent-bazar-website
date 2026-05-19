import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-dashboard',
  standalone: false,
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.scss',
})
export class EmployeeDashboardComponent implements OnInit {
  empData: any = null;
  orders: any[] = [];
  loading = true;
  totalOrdersCount = 0;
  pieChartEntries: { label: string; value: number; color: string; percent: string }[] = [];
  recentOrders: { id: string; customer: string; initials: string; color: string; product: string; amount: string; status: string }[] = [];

  readonly statusList = ['TO-DO', 'In-progress', 'Done', 'Cancle', 'Hold'];

  private readonly pieColors: Record<string, string> = {
    'Done':        '#6366f1',
    'TO-DO':       '#bfdbfe',
    'In-progress': '#fde68a',
    'Cancle':      '#fca5a5',
    'Hold':        '#d1d5db',
  };

  private readonly avatarColors = ['#6366f1', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'];

  public orderStatusData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [], borderWidth: 0, hoverOffset: 4 }],
  };

  public orderStatusOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ({ label, raw }) => ` ${label}: ${raw}` } },
    },
  };

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      label: 'Orders',
      data: [],
      backgroundColor: '#6366f1',
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { grid: { display: false }, border: { display: false } },
      y: { grid: { color: '#f3f4f6' }, border: { display: false }, ticks: { maxTicksLimit: 5 } },
    },
  };

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.empData = JSON.parse(localStorage.getItem('adminUser') || '{}');
    if (this.empData?._id) {
      this.loadOrders(this.empData._id);
    }
  }

  loadOrders(empId: string): void {
    this.loading = true;
    this.dataService.postAPICall('order/fetch', { empId }).subscribe({
      next: (res: any) => {
        this.orders = res.data || [];
        this.loading = false;
        this.buildCharts();
        this.buildRecentOrders();
      },
      error: () => { this.loading = false; },
    });
  }

  get statusCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const s of this.statusList) counts[s] = 0;
    for (const o of this.orders) counts[o.status] = (counts[o.status] || 0) + 1;
    return counts;
  }

  get totalOrders(): number { return this.orders.length; }
  get completedOrders(): number { return this.statusCounts['Done']; }
  get inProgressOrders(): number { return this.statusCounts['In-progress']; }
  get pendingOrders(): number { return this.statusCounts['TO-DO']; }

  get completionRate(): string {
    if (!this.orders.length) return '0';
    return ((this.statusCounts['Done'] / this.orders.length) * 100).toFixed(0);
  }

  buildCharts(): void {
    const labels = this.statusList;
    const values = labels.map(l => this.statusCounts[l] || 0);
    const total = values.reduce((a, b) => a + b, 0);
    this.totalOrdersCount = total;

    const bgColors = labels.map(l => this.pieColors[l] ?? '#d1d5db');
    this.pieChartEntries = labels.map((label, i) => ({
      label,
      value: values[i],
      color: bgColors[i],
      percent: total > 0 ? ((values[i] / total) * 100).toFixed(0) + '%' : '0%',
    }));

    this.orderStatusData = {
      labels,
      datasets: [{ data: values, backgroundColor: bgColors, borderWidth: 0, hoverOffset: 4 }],
    };

    const monthlyCounts: Record<string, number> = {};
    for (const o of this.orders) {
      const key = new Date(o.createdAt).toLocaleString('en-IN', { month: 'short', year: '2-digit' });
      monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
    }
    const sortedMonths = Object.keys(monthlyCounts).sort(
      (a, b) => new Date('1 ' + a).getTime() - new Date('1 ' + b).getTime()
    );
    this.barChartData = {
      labels: sortedMonths,
      datasets: [{
        label: 'Orders',
        data: sortedMonths.map(m => monthlyCounts[m]),
        backgroundColor: '#6366f1',
        borderRadius: 6,
        borderSkipped: false,
      }],
    };
  }

  buildRecentOrders(): void {
    this.recentOrders = this.orders.slice(0, 5).map((order, i) => {
      const name: string = order.buyerId?.name ?? 'Unknown';
      const initials = name.split(' ').map((w: string) => w[0] ?? '').join('').toUpperCase().slice(0, 2);
      const productName: string = order.productDetails?.[0]?.productId?.productName ?? '—';
      const amount = (order.productDetails as any[])?.reduce((sum: number, pd: any) =>
        sum + ((pd.productId?.product_selling_price ?? 0) * (pd.quantity ?? 1)), 0) ?? 0;
      return {
        id: `#ORD-${order.orderId}`,
        customer: name,
        initials,
        color: this.avatarColors[i % this.avatarColors.length],
        product: productName,
        amount: `₹${amount}`,
        status: order.status,
      };
    });
  }

  viewOrder(order: any): void {
    this.dataService.selectedOrder = order;
    this.router.navigate(['/admin-home/view-order']);
  }
}
