import { Component } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  // Define the chart data using the explicit 'pie' generic
  public pieChartData: ChartData<'pie'> = {
    labels: ['Download Sales', 'In-Store Sales', 'Mail Sales'],
    datasets: [
      {
        data:[10,20,30], // Replace with your actual data
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  // Define the chart type explicitly
  public pieChartType = 'pie';

  // Define the chart options, explicitly typed for a pie chart
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: ({ dataIndex, raw }) => {
            const label = this.pieChartData.labels?.[dataIndex] || '';
            const value = raw as number;
            
            const dataValues = this.pieChartData.datasets?.[0].data;
            if (!dataValues) {
              return `${label}: ${value}`;
            }

            const total = dataValues.reduce(
              (sum: number, current: number) => sum + current,
              0
            );
            
            const percentage = ((value / total) * 100).toFixed(2) + '%';
            return `${label}: ${value} (${percentage})`;
          },
        },
      },
    },
  };

}
