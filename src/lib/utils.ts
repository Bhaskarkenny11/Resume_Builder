import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  // Check if YYYY-MM
  if (/^\d{4}-\d{2}$/.test(dateString)) {
    const [year, month] = dateString.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mIdx = parseInt(month, 10) - 1;
    return `${months[mIdx] || month} ${year}`;
  }
  return dateString;
}

export const DEFAULT_AVATAR_URL = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f1f5f9"/><circle cx="50" cy="38" r="20" fill="%2394a3b8"/><path d="M15 92c0-19.3 15.7-35 35-35s35 15.7 35 35" fill="%2394a3b8"/></svg>`;

export function hexToRgba(hex: string, alpha: number): string {
  if (!hex || hex === 'none') return `rgba(241, 245, 249, ${alpha})`;
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const r = parseInt(clean.substring(0, 2), 16) || 30;
  const g = parseInt(clean.substring(2, 4), 16) || 64;
  const b = parseInt(clean.substring(4, 6), 16) || 175;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getSecondaryAccent(hex: string): string {
  if (!hex || hex === 'none') return '#475569';
  const clean = hex.toLowerCase();
  if (clean.includes('1e40af') || clean.includes('2563eb') || clean.includes('1e3a8a') || clean.includes('2b6cb0')) {
    return '#f59e0b'; // Amber secondary for blue/navy
  }
  if (clean.includes('0d9488') || clean.includes('25839b') || clean.includes('4a7c82')) {
    return '#e11d48'; // Rose secondary for teal
  }
  if (clean.includes('be123c') || clean.includes('f43f5e') || clean.includes('be185d')) {
    return '#2563eb'; // Blue secondary for red/rose
  }
  if (clean.includes('581c87') || clean.includes('701a75') || clean.includes('4f46e5')) {
    return '#0d9488'; // Teal secondary for purple/indigo
  }
  return '#2563eb';
}
