'use client';

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import type { TrustNodeCoverage } from '@/lib/parser/types';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface TrustNodeRadarProps {
  data: TrustNodeCoverage;
}

export default function TrustNodeRadar({ data }: TrustNodeRadarProps) {
  const chartData = {
    labels: data.categories.map((cat) => cat.name),
    datasets: [
      {
        label: 'Coverage %',
        data: data.categories.map((cat) => cat.percentage),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        pointLabels: {
          font: {
            size: 12,
          },
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          callback: function (value: number | string) {
            return value + '%';
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const category = data.categories[context.dataIndex];
            return [
              `Coverage: ${category.coverage}/${category.total}`,
              `Percentage: ${category.percentage}%`,
              `Status: ${category.status}`,
            ];
          },
        },
      },
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Trust Node Coverage</h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">
            {data.overall.percentage}%
          </p>
          <p className="text-sm text-gray-600">
            {data.overall.coverage}/{data.overall.total} nodes
          </p>
        </div>
      </div>

      <div className="h-[400px]">
        <Radar data={chartData} options={options} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
        {data.categories.map((category) => (
          <div key={category.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-700">{category.name}</span>
            <span className="font-semibold text-blue-600">
              {category.coverage}/{category.total}
            </span>
          </div>
        ))}
      </div>

      {data.criticalGaps.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg">
          <h4 className="font-semibold text-red-900 mb-2">
            Critical Missing Nodes ({data.criticalGaps.length})
          </h4>
          <ul className="space-y-1">
            {data.criticalGaps.slice(0, 3).map((gap, index) => (
              <li key={index} className="text-sm text-red-800">
                • {gap.name} - {gap.impact}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
