// Utility functions for dashboard

import { type ClassValue, clsx } from 'clsx';

/**
 * Format date string to readable format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return dateString;
  }
}

/**
 * Get color based on score (0-10 scale)
 */
export function getScoreColor(score: number): string {
  if (score >= 8) return 'text-green-600';
  if (score >= 6) return 'text-yellow-600';
  if (score >= 4) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * Get background color based on score
 */
export function getScoreBgColor(score: number): string {
  if (score >= 8) return 'bg-green-100';
  if (score >= 6) return 'bg-yellow-100';
  if (score >= 4) return 'bg-orange-100';
  return 'bg-red-100';
}

/**
 * Get badge color based on priority level
 */
export function getPriorityColor(level: 'Immediate' | 'Strategic' | 'Long-term'): string {
  switch (level) {
    case 'Immediate':
      return 'bg-red-100 text-red-800';
    case 'Strategic':
      return 'bg-yellow-100 text-yellow-800';
    case 'Long-term':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Get badge color based on impact level
 */
export function getImpactColor(impact: 'High' | 'Medium' | 'Low'): string {
  switch (impact) {
    case 'High':
      return 'bg-red-50 text-red-700 ring-red-600/20';
    case 'Medium':
      return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';
    case 'Low':
      return 'bg-blue-50 text-blue-700 ring-blue-600/20';
    default:
      return 'bg-gray-50 text-gray-700 ring-gray-600/20';
  }
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Truncate text to length with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Generate chart colors (consistent across dashboard)
 */
export const chartColors = {
  primary: 'rgb(59, 130, 246)', // blue-500
  secondary: 'rgb(168, 85, 247)', // purple-500
  success: 'rgb(34, 197, 94)', // green-500
  warning: 'rgb(234, 179, 8)', // yellow-500
  danger: 'rgb(239, 68, 68)', // red-500
  info: 'rgb(14, 165, 233)', // sky-500
  categories: [
    'rgb(59, 130, 246)', // blue
    'rgb(168, 85, 247)', // purple
    'rgb(34, 197, 94)', // green
    'rgb(234, 179, 8)', // yellow
    'rgb(239, 68, 68)', // red
    'rgb(14, 165, 233)', // sky
  ],
};

/**
 * Slugify string for URLs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
