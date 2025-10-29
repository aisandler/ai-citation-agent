'use client';

import { useRouter } from 'next/navigation';
import type { ParsedAudit } from '@/lib/parser/types';

interface AuditNavigationProps {
  currentSlug: string;
  allAudits: ParsedAudit[];
}

export default function AuditNavigation({
  currentSlug,
  allAudits,
}: AuditNavigationProps) {
  const router = useRouter();

  const currentIndex = allAudits.findIndex(
    (audit) => audit.metadata.slug === currentSlug
  );

  const hasPrevious = currentIndex < allAudits.length - 1;
  const hasNext = currentIndex > 0;

  const previousAudit = hasPrevious ? allAudits[currentIndex + 1] : null;
  const nextAudit = hasNext ? allAudits[currentIndex - 1] : null;

  const handleNavigate = (slug: string) => {
    router.push(`/audit/${slug}`);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slug = e.target.value;
    if (slug) {
      router.push(`/audit/${slug}`);
    }
  };

  return (
    <div className="flex items-center gap-4 print:hidden">
      {/* Audit Selector Dropdown */}
      <div className="relative">
        <select
          value={currentSlug}
          onChange={handleSelectChange}
          className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
        >
          {allAudits.map((audit) => (
            <option key={audit.metadata.slug} value={audit.metadata.slug}>
              {audit.metadata.brand} • {audit.metadata.date}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="h-4 w-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => previousAudit && handleNavigate(previousAudit.metadata.slug)}
          disabled={!hasPrevious}
          className={`p-2 rounded-lg border transition-colors ${
            hasPrevious
              ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          title={previousAudit ? `Previous: ${previousAudit.metadata.brand} (${previousAudit.metadata.date})` : 'No previous audit'}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={() => nextAudit && handleNavigate(nextAudit.metadata.slug)}
          disabled={!hasNext}
          className={`p-2 rounded-lg border transition-colors ${
            hasNext
              ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          title={nextAudit ? `Next: ${nextAudit.metadata.brand} (${nextAudit.metadata.date})` : 'No next audit'}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Audit Count */}
      <span className="text-sm text-gray-500">
        {currentIndex + 1} of {allAudits.length}
      </span>
    </div>
  );
}
