import Dexie, { type Table } from 'dexie';
import { ResumeRecord, AppGlobalSettings } from '../types/resume';
import { SAMPLE_RESUME_CONTENT } from '../lib/constants';

export class ResumeDatabase extends Dexie {
  resumes!: Table<ResumeRecord, string>;
  settings!: Table<AppGlobalSettings, string>;

  constructor() {
    super('ResumeBuilderDB');
    this.version(2).stores({
      resumes: 'id, title, category, template_id, country_preset, updated_at, is_pinned',
      settings: 'id',
    });
  }
}

export const db = new ResumeDatabase();

// Bank-Grade Salted SHA-256 hashing for local PIN protection with timing-safe verification
import { computeSaltedHash, timingSafeEqual } from '../lib/security';

export async function hashPin(pin: string): Promise<string> {
  return computeSaltedHash(pin.trim());
}

export async function verifyPin(pin: string, storedHash: string): Promise<boolean> {
  if (!pin || !storedHash) return false;
  // Check against salted hash
  const calculatedSalted = await computeSaltedHash(pin.trim());
  if (timingSafeEqual(calculatedSalted, storedHash)) {
    return true;
  }
  // Fallback for legacy unsalted hashes if existing
  const encoder = new TextEncoder();
  const data = encoder.encode(pin.trim());
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const legacyHash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return timingSafeEqual(legacyHash, storedHash);
}

// Global settings helper
export async function getGlobalSettings(): Promise<AppGlobalSettings> {
  const settings = await db.settings.get('global_settings');
  if (settings) {
    return settings;
  }
  const defaultSettings: AppGlobalSettings = {
    id: 'global_settings',
    theme: 'light',
    security: {
      workspaceName: '',
      pinHash: undefined,
      isLocked: false,
    },
    defaultCountryPreset: 'us_ca',
    defaultTemplateId: 'modern_clean',
  };
  await db.settings.put(defaultSettings);
  return defaultSettings;
}

export async function saveGlobalSettings(patch: Partial<AppGlobalSettings>): Promise<AppGlobalSettings> {
  const current = await getGlobalSettings();
  const updated: AppGlobalSettings = {
    ...current,
    ...patch,
    security: {
      ...current.security,
      ...(patch.security || {}),
    },
  };
  await db.settings.put(updated);
  return updated;
}

// Initial seed: if user has no resumes, create Resume #1 automatically so they can edit immediately
export async function seedInitialResumeIfEmpty(): Promise<ResumeRecord> {
  const count = await db.resumes.count();
  if (count === 0) {
    const initialResume: ResumeRecord = {
      id: 'resume-initial-1',
      title: 'Full Stack Architect Resume',
      category: 'Software & Tech',
      template_id: 'modern_clean',
      country_preset: 'us_ca',
      content: SAMPLE_RESUME_CONTENT,
      created_at: Date.now(),
      updated_at: Date.now(),
      is_pinned: true,
    };
    await db.resumes.add(initialResume);
    return initialResume;
  }
  const first = await db.resumes.orderBy('updated_at').reverse().first();
  return first!;
}

// Backup & Restore
export interface BackupData {
  version: number;
  exportedAt: string;
  resumes: ResumeRecord[];
  settings: AppGlobalSettings;
}

export async function exportDatabaseBackup(): Promise<string> {
  const resumes = await db.resumes.toArray();
  const settings = await getGlobalSettings();
  const backup: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    resumes,
    settings,
  };
  return JSON.stringify(backup, null, 2);
}

export async function importDatabaseBackup(jsonString: string): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const data: BackupData = JSON.parse(jsonString);
    if (!data.resumes || !Array.isArray(data.resumes)) {
      throw new Error('Invalid backup file structure: missing resumes array.');
    }

    await db.transaction('rw', db.resumes, db.settings, async () => {
      // Clear existing records to ensure fresh restore
      await db.resumes.clear();
      for (const res of data.resumes) {
        await db.resumes.put(res);
      }
      if (data.settings) {
        await db.settings.put(data.settings);
      }
    });

    return { success: true, count: data.resumes.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || 'Failed to parse backup JSON' };
  }
}
