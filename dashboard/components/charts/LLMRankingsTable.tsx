'use client';

import type { LLMRankings } from '@/lib/parser/types';

interface LLMRankingsTableProps {
  data: LLMRankings;
}

export default function LLMRankingsTable({ data }: LLMRankingsTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">LLM Platform Rankings</h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">
            {data.aiCitationRate}%
          </p>
          <p className="text-sm text-gray-600">AI Citation Rate</p>
        </div>
      </div>

      {/* Platform Results */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Platform
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cited?
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Citations
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.platforms.map((platform) => (
              <tr key={platform.platform}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {platform.platform}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  {platform.cited ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      ✗ No
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                  {platform.position ? (
                    <span className="font-semibold text-blue-600">
                      #{platform.position}
                    </span>
                  ) : (
                    <span className="text-gray-400">{platform.positionText}</span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-900">
                  {platform.citationsFound}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Competitive Rankings */}
      {data.competitors.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Competitive Rankings
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Competitor
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Perplexity
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ChatGPT
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gemini
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.competitors.map((competitor, index) => {
                  // Highlight the brand row (usually has bold name)
                  const isBrand = competitor.name.includes('**') || index === data.competitors.length - 1;
                  const cleanName = competitor.name.replace(/\*\*/g, '');

                  return (
                    <tr
                      key={competitor.name}
                      className={isBrand ? 'bg-blue-50' : ''}
                    >
                      <td className={`px-4 py-3 whitespace-nowrap text-sm ${isBrand ? 'font-bold text-blue-900' : 'text-gray-900'}`}>
                        {cleanName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-900">
                        {competitor.perplexity}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-900">
                        {competitor.chatgpt}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-900">
                        {competitor.gemini}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                        {competitor.avgPosition ?? '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Platform Context */}
      {data.platforms.some((p) => p.context) && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-semibold text-gray-900">Context</h4>
          {data.platforms
            .filter((p) => p.context)
            .map((platform) => (
              <div key={platform.platform} className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
                <span className="font-medium">{platform.platform}:</span> {platform.context}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
