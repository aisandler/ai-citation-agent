import { loadLatestAudit, hasAudits } from '@/lib/audit-loader';
import { formatDate, getScoreColor, getScoreBgColor } from '@/lib/utils';
import TrustNodeRadar from '@/components/charts/TrustNodeRadar';
import CitationQualityBars from '@/components/charts/CitationQualityBars';
import LLMRankingsTable from '@/components/charts/LLMRankingsTable';
import PriorityTimeline from '@/components/charts/PriorityTimeline';

export default function Home() {
  if (!hasAudits()) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            No Audits Found
          </h2>
          <p className="text-gray-600 mb-8">
            Run an AI visibility audit using the <code className="bg-gray-100 px-2 py-1 rounded">/agents:audit-citations</code> command to generate your first audit report.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto text-left">
            <h3 className="font-semibold text-blue-900 mb-2">Getting Started</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Navigate to the project root</li>
              <li>Run the audit orchestrator: <code className="bg-blue-100 px-1 rounded">/agents:audit-citations</code></li>
              <li>Provide brand name and category when prompted</li>
              <li>Wait ~8-10 minutes for the complete audit</li>
              <li>Audit report will be saved to output/</li>
              <li>Refresh this dashboard to see results</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  const audit = loadLatestAudit();

  if (!audit) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Audit</h2>
          <p className="text-gray-600 mt-4">
            Unable to parse the audit report. Please check the markdown format.
          </p>
        </div>
      </div>
    );
  }

  const { metadata, executiveSummary, trustNodeCoverage, citationQuality, llmRankings, priorities } = audit;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {metadata.brand}
            </h1>
            <p className="text-lg text-gray-600">{metadata.category}</p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-6 py-3 rounded-lg ${getScoreBgColor(executiveSummary.overallScore * 10)}`}>
              <span className={`text-4xl font-bold ${getScoreColor(executiveSummary.overallScore * 10)}`}>
                {executiveSummary.overallScore.toFixed(1)}
              </span>
              <span className="text-lg text-gray-600 ml-1">/10</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Overall AI Visibility Score</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>📅 {formatDate(metadata.date)}</span>
          <span>•</span>
          <span>📊 {metadata.methodology}</span>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-blue-900 mb-3">Executive Summary</h2>
        <p className="text-blue-800 mb-4 leading-relaxed">
          {executiveSummary.bottomLine}
        </p>
        {executiveSummary.keyFindings.length > 0 && (
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Key Findings:</h3>
            <ul className="space-y-1">
              {executiveSummary.keyFindings.map((finding, index) => (
                <li key={index} className="text-sm text-blue-800">
                  • {finding}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Trust Node Coverage"
          value={`${trustNodeCoverage.overall.coverage}/${trustNodeCoverage.overall.total}`}
          percentage={trustNodeCoverage.overall.percentage}
          color="blue"
        />
        <MetricCard
          label="Citation Quality"
          value={citationQuality.average.toFixed(1)}
          percentage={citationQuality.average * 10}
          color="purple"
        />
        <MetricCard
          label="AI Citation Rate"
          value={`${llmRankings.aiCitationRate}%`}
          percentage={llmRankings.aiCitationRate}
          color="green"
        />
        <MetricCard
          label="Platforms Citing"
          value={`${llmRankings.platforms.filter(p => p.cited).length}/${llmRankings.platforms.length}`}
          percentage={(llmRankings.platforms.filter(p => p.cited).length / llmRankings.platforms.length) * 100}
          color="yellow"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Trust Node Radar */}
        <div className="bg-white rounded-lg shadow p-6">
          <TrustNodeRadar data={trustNodeCoverage} />
        </div>

        {/* Citation Quality Bars */}
        <div className="bg-white rounded-lg shadow p-6">
          <CitationQualityBars data={citationQuality} />
        </div>
      </div>

      {/* LLM Rankings - Full Width */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <LLMRankingsTable data={llmRankings} />
      </div>

      {/* Priorities Timeline - Full Width */}
      <div className="bg-white rounded-lg shadow p-6">
        <PriorityTimeline data={priorities} />
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  percentage,
  color,
}: {
  label: string;
  value: string;
  percentage: number;
  color: 'blue' | 'purple' | 'green' | 'yellow';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-4`}>
      <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold mb-2">{value}</p>
      <div className="w-full bg-white rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color === 'blue' ? 'bg-blue-500' : color === 'purple' ? 'bg-purple-500' : color === 'green' ? 'bg-green-500' : 'bg-yellow-500'}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

// Enable ISR (Incremental Static Regeneration) - rebuild every 60 seconds
export const revalidate = 60;
