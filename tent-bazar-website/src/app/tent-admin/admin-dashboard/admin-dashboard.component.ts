import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  data: any;

  showDatePicker = false;
  startDate = '';
  endDate = '';
  displayDateRange = '';

  widgetData = { orders: 0, users: 0, product: 0, employee: 0, category: 0 };
  totalOrdersCount = 0;
  pieChartEntries: { label: string; value: number; color: string; percent: string }[] = [];

  recentOrders: { id: string; customer: string; initials: string; color: string; product: string; amount: string; status: string }[] = [];

  private readonly pieColors: Record<string, string> = {
    'Done':        '#6366f1',
    'TO-DO':       '#bfdbfe',
    'In-progress': '#fde68a',
    'Cancle':      '#fca5a5',
    'Hold':        '#d1d5db',
  };

  private readonly avatarColors = ['#6366f1', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'];

  public salesChartData: ChartData<'bar'> = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      { label: 'Current Week',  data: [0, 0, 0, 0, 0, 0, 0], backgroundColor: '#6366f1', borderRadius: 6, borderSkipped: false },
      { label: 'Previous Week', data: [0, 0, 0, 0, 0, 0, 0], backgroundColor: '#e0e7ff', borderRadius: 6, borderSkipped: false },
    ],
  };

  public salesChartOptions: ChartOptions<'bar'> = {
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

  constructor(
    private route: Router,
    private dataService: DataService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setLastWeek();
  }

  toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  setCurrentWeek() {
    const today = new Date();
    const day = today.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    this.startDate = this.formatDate(monday);
    this.endDate = this.formatDate(sunday);
    this.applyDateRange();
  }

  setLastWeek() {
    const today = new Date();
    const day = today.getDay();
    const diffToLastMonday = day === 0 ? -13 : 1 - day - 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToLastMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    this.startDate = this.formatDate(monday);
    this.endDate = this.formatDate(sunday);
    this.applyDateRange();
  }

  setLast30Days() {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 29);
    this.startDate = this.formatDate(start);
    this.endDate = this.formatDate(today);
    this.applyDateRange();
  }

  applyDateRange() {
    this.updateDisplayRange();
    this.showDatePicker = false;
    this.getDashbordData();
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private updateDisplayRange() {
    if (!this.startDate || !this.endDate) return;
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const start = new Date(this.startDate + 'T00:00:00');
    const end = new Date(this.endDate + 'T00:00:00');
    this.displayDateRange = `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`;
  }

  getDashbordData() {
    const url = `dashboard/fetch?startDate=${this.startDate}&endDate=${this.endDate}`;
    this.dataService.getAPICall(url).subscribe(
      (res: any) => {
        this.data = res.data;
        this.bindWidgets();
        this.bindCharts();
        this.bindRecentOrders();
      },
      (err) => { console.error(err); }
    );
  }

  private bindWidgets() {
    this.widgetData = this.data.widget;
  }

  private bindCharts() {
    this.salesChartData = this.data.weeklyChart as ChartData<'bar'>;

    const pie = this.data.piechart as Record<string, number>;
    const labels = Object.keys(pie);
    const values = Object.values(pie);
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
  }

  private bindRecentOrders() {
    this.recentOrders = (this.data.recent.orders as any[]).map((order, i) => {
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
}
