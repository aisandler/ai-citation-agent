import { notFound } from 'next/navigation';
import { loadAllAudits, loadAuditBySlug } from '@/lib/audit-loader';
import TrustNodeRadar from '@/components/charts/TrustNodeRadar';
import CitationQualityBars from '@/components/charts/CitationQualityBars';
import LLMRankingsTable from '@/components/charts/LLMRankingsTable';
import PriorityTimeline from '@/components/charts/PriorityTimeline';
import AuditNavigation from '@/components/AuditNavigation';
import PrintButton from '@/components/PrintButton';

export const revalidate = 60;

export async function generateStaticParams() {
  const audits = loadAllAudits();
  return audits.map((audit) => ({
    slug: audit.metadata.slug,
  }));
}

export default function AuditPage({ params }: { params: { slug: string } }) {
  const audit = loadAuditBySlug(params.slug);

  if (!audit) {
    notFound();
  }

  const allAudits = loadAllAudits();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {audit.metadata.brand}
            </h1>
            <p className="text-lg text-gray-600">
              {audit.metadata.category} • {audit.metadata.date}
            </p>
          </div>
          <div className="flex gap-4">
            <PrintButton />
            <AuditNavigation
              currentSlug={params.slug}
              allAudits={allAudits}
            />
          </div>
        </div>

        {/* Overall Score Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 mb-8 text-white print:bg-blue-600">
          <div className="text-center">
            <p className="text-blue-100 text-sm font-medium uppercase tracking-wide mb-2">
              Overall AI Visibility Score
            </p>
            <p className="text-6xl font-bold mb-2">
              {audit.executiveSummary.overallScore.toFixed(1)}
              <span className="text-3xl text-blue-200">/10</span>
            </p>
            <p className="text-blue-100 max-w-2xl mx-auto">
              {audit.executiveSummary.bottomLine}
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Key Findings
          </h2>
          <ul className="space-y-3">
            {audit.executiveSummary.keyFindings.map((finding, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-gray-700">{finding}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Trust Node Coverage
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {audit.trustNodeCoverage.overall.coverage}/
              {audit.trustNodeCoverage.overall.total}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {audit.trustNodeCoverage.overall.percentage}% complete
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Citation Quality
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {audit.citationQuality.average.toFixed(1)}
              <span className="text-lg text-gray-500">/10</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {audit.citationQuality.distribution.highQuality.count} high-quality
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-600 mb-1">
              AI Citation Rate
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {audit.llmRankings.aiCitationRate}%
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {audit.llmRankings.platforms.filter((p) => p.cited).length} of 3
              platforms
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-600 mb-1">Best Position</p>
            <p className="text-3xl font-bold text-gray-900">
              {audit.llmRankings.platforms
                .filter((p) => p.position !== null)
                .sort((a, b) => (a.position || 99) - (b.position || 99))[0]
                ?.position
                ? `#${
                    audit.llmRankings.platforms
                      .filter((p) => p.position !== null)
                      .sort((a, b) => (a.position || 99) - (b.position || 99))[0]
                      ?.position
                  }`
                : 'N/A'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {audit.llmRankings.platforms.find(
                (p) =>
                  p.position ===
                  Math.min(
                    ...audit.llmRankings.platforms
                      .filter((p) => p.position !== null)
                      .map((p) => p.position || 99)
                  )
              )?.platform || 'None'}
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Trust Node Coverage
            </h2>
            <TrustNodeRadar data={audit.trustNodeCoverage} />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Citation Quality Dimensions
            </h2>
            <CitationQualityBars data={audit.citationQuality} />
          </div>
        </div>

        {/* LLM Rankings Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            LLM Platform Rankings
          </h2>
          <LLMRankingsTable data={audit.llmRankings} />
        </div>

        {/* Priority Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Strategic Priorities
          </h2>
          <PriorityTimeline data={audit.priorities} />
        </div>
      </div>
    </div>
  );
}
