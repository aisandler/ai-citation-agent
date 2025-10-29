'use client';

import type { Priorities } from '@/lib/parser/types';
import { getPriorityColor, getImpactColor } from '@/lib/utils';

interface PriorityTimelineProps {
  data: Priorities;
}

export default function PriorityTimeline({ data }: PriorityTimelineProps) {
  const allPriorities = [
    ...data.immediate,
    ...data.strategic,
    ...data.longTerm,
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Strategic Priorities</h3>
        <div className="text-sm text-gray-600">
          {allPriorities.length} total actions
        </div>
      </div>

      {/* Priority Sections */}
      <div className="space-y-6">
        {/* Immediate Priorities */}
        {data.immediate.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                🔴 Immediate
              </span>
              <span className="text-sm text-gray-600">This Month</span>
            </div>
            <div className="space-y-3">
              {data.immediate.map((priority, index) => (
                <PriorityCard key={index} priority={priority} />
              ))}
            </div>
          </div>
        )}

        {/* Strategic Initiatives */}
        {data.strategic.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                🟡 Strategic
              </span>
              <span className="text-sm text-gray-600">This Quarter</span>
            </div>
            <div className="space-y-3">
              {data.strategic.map((priority, index) => (
                <PriorityCard key={index} priority={priority} />
              ))}
            </div>
          </div>
        )}

        {/* Long-term Vision */}
        {data.longTerm.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                🟢 Long-term
              </span>
              <span className="text-sm text-gray-600">6-12 Months</span>
            </div>
            <div className="space-y-3">
              {data.longTerm.map((priority, index) => (
                <PriorityCard key={index} priority={priority} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PriorityCard({ priority }: { priority: any }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-2">{priority.title}</h4>

          {priority.currentStatus && (
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Current:</span> {priority.currentStatus}
            </p>
          )}

          <p className="text-sm text-gray-700 mb-3">{priority.action}</p>

          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${getImpactColor(priority.impact)}`}>
              {priority.impact} Impact
            </span>

            {priority.timeline && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                ⏱ {priority.timeline}
              </span>
            )}
          </div>

          {priority.successMetric && (
            <p className="text-xs text-gray-500 mt-2">
              <span className="font-medium">Success Metric:</span> {priority.successMetric}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
