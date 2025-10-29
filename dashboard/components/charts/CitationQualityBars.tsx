'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { CitationQuality } from '@/lib/parser/types';
import { getScoreColor } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CitationQualityBarsProps {
  data: CitationQuality;
}

export default function CitationQualityBars({ data }: CitationQualityBarsProps) {
  const chartData = {
    labels: data.dimensions.map((dim) => dim.name),
    datasets: [
      {
        label: 'Score (0-10)',
        data: data.dimensions.map((dim) => dim.score),
        backgroundColor: data.dimensions.map((dim) => {
          if (dim.score >= 8) return 'rgba(34, 197, 94, 0.8)'; // green
          if (dim.score >= 6) return 'rgba(234, 179, 8, 0.8)'; // yellow
          if (dim.score >= 4) return 'rgba(249, 115, 22, 0.8)'; // orange
          return 'rgba(239, 68, 68, 0.8)'; // red
        }),
        borderColor: data.dimensions.map((dim) => {
          if (dim.score >= 8) return 'rgb(34, 197, 94)';
          if (dim.score >= 6) return 'rgb(234, 179, 8)';
          if (dim.score >= 4) return 'rgb(249, 115, 22)';
          return 'rgb(239, 68, 68)';
        }),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
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
            const dimension = data.dimensions[context.dataIndex];
            return [
              `Score: ${dimension.score}/10`,
              `Assessment: ${dimension.assessment}`,
            ];
          },
        },
      },
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Citation Quality Scorecard</h3>
        <div className="text-right">
          <p className={`text-2xl font-bold ${getScoreColor(data.average * 10)}`}>
            {data.average.toFixed(1)}/10
          </p>
          <p className="text-sm text-gray-600">Average Quality</p>
        </div>
      </div>

      <div className="h-[350px]">
        <Bar data={chartData} options={options} />
      </div>

      <div className="grid grid-cols-3 gap-4 text-center text-sm">
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">
            {data.distribution.highQuality.count}
          </p>
          <p className="text-gray-600">High Quality</p>
          <p className="text-xs text-gray-500">
            {data.distribution.highQuality.percentage}%
          </p>
        </div>
        <div className="p-3 bg-yellow-50 rounded-lg">
          <p className="text-2xl font-bold text-yellow-600">
            {data.distribution.mediumQuality.count}
          </p>
          <p className="text-gray-600">Medium Quality</p>
          <p className="text-xs text-gray-500">
            {data.distribution.mediumQuality.percentage}%
          </p>
        </div>
        <div className="p-3 bg-red-50 rounded-lg">
          <p className="text-2xl font-bold text-red-600">
            {data.distribution.lowQuality.count}
          </p>
          <p className="text-gray-600">Low Quality</p>
          <p className="text-xs text-gray-500">
            {data.distribution.lowQuality.percentage}%
          </p>
        </div>
      </div>

      <div className="flex justify-between text-sm pt-2 border-t">
        <div>
          <span className="text-gray-600">Strongest:</span>{' '}
          <span className="font-semibold text-green-600">{data.strongest}</span>
        </div>
        <div>
          <span className="text-gray-600">Weakest:</span>{' '}
          <span className="font-semibold text-red-600">{data.weakest}</span>
        </div>
      </div>
    </div>
  );
}
