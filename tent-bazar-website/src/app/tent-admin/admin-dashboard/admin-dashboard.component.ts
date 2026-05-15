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

  recentOrders = [
    { id: '#ORD-7721', customer: 'Jane Smith',   initials: 'JS', color: '#6366f1', product: 'Premium Tent',    amount: '₹1,200', status: 'Completed' },
    { id: '#ORD-7720', customer: 'Marcus Chen',  initials: 'MC', color: '#f59e0b', product: 'Wedding Tent',    amount: '₹4,500', status: 'Pending'   },
    { id: '#ORD-7719', customer: 'Aria Lopez',   initials: 'AL', color: '#10b981', product: 'Party Setup',     amount: '₹2,500', status: 'Completed' },
    { id: '#ORD-7718', customer: 'Tom Baker',    initials: 'TB', color: '#8b5cf6', product: 'Corporate Event', amount: '₹8,999', status: 'Completed' },
    { id: '#ORD-7717', customer: 'Rahul Sharma', initials: 'RS', color: '#ef4444', product: 'Stage Setup',     amount: '₹3,200', status: 'Cancelled' },
  ];

  // Sales Analytics – Bar Chart
  public salesChartData: ChartData<'bar'> = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Current Week',
        data: [65, 59, 80, 81, 56, 55, 72],
        backgroundColor: '#6366f1',
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Previous Week',
        data: [28, 48, 40, 35, 70, 42, 60],
        backgroundColor: '#e0e7ff',
        borderRadius: 6,
        borderSkipped: false,
      },
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
      x: {
        grid: { display: false },
        border: { display: false },
      },
      y: {
        grid: { color: '#f3f4f6' },
        border: { display: false },
        ticks: { maxTicksLimit: 5 },
      },
    },
  };

  // Order Status – Doughnut Chart
  public orderStatusData: ChartData<'doughnut'> = {
    labels: ['Completed', 'Cancelled', 'Pending'],
    datasets: [
      {
        data: [70, 15, 15],
        backgroundColor: ['#6366f1', '#fca5a5', '#bfdbfe'],
        hoverBackgroundColor: ['#4f46e5', '#f87171', '#93c5fd'],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  public orderStatusOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ({ label, raw }) => ` ${label}: ${raw}%`,
        },
      },
    },
  };

  constructor(
    private route: Router,
    private dataService: DataService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getDashbordData();
  }

  getDashbordData() {
    const url = 'dashboard/fetch';
    this.dataService.getAPICall(url).subscribe(
      (res: any) => {
        this.data = res.data;
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
