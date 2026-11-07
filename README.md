# Novafolio — 100% Serverless, Client-Side Resume Builder

A zero-backend, client-side web application with the visual quality and responsiveness of **FlowCV** and **Resume.io**. It runs entirely inside the user's browser with **NO database, NO Supabase, NO Firebase, and NO server-side API dependencies**.

---

## Key Architectural Highlights

### 1. Persistence Engine (IndexedDB via Dexie.js)
- **Database:** `ResumeBuilderDB`
  - `resumes`: `id`, `title`, `template_id`, `country_preset`, `content`, `updated_at`, `is_pinned`.
  - `settings`: Global theme, export preferences, local security credentials.
- **Zero Data Loss:** 500ms debounced auto-save directly into IndexedDB on every keystroke and drag event.
- **Single-Click Backups:**
  - **Export Backup (.json):** Complete export of all resumes and settings to an offline JSON file.
  - **Import Backup:** Restore data across different browsers or offline devices without any server.

### 2. Resume Quota & Local Access Control
- **Resume #1 (Unrestricted):** Edit immediately upon landing with an initial seed profile.
- **Resume #2+ (Local Profile Gate):**
  - Triggers a clean modal: *"Protect & Organize Your Resumes Locally"*.
  - Prompts the user to set a local workspace name and optional 4-digit PIN.
  - Hashes the PIN locally using the browser's native `window.crypto.subtle` (SHA-256) before storing it in IndexedDB for private local profiles on shared workstations.

### 3. Country-Specific Formatting Engine
- **US & Canada:** Letter format ($8.5 \times 11\text{ in}$). Suppresses headshot photo, birth date, gender, marital status, and nationality for strict ATS and equal-opportunity compliance.
- **UK & EU:** A4 format ($210 \times 297\text{ mm}$). Personal profile statement, CEFR language proficiency grid (A1 to C2).
- **Germany / DACH (Lebenslauf):** A4 format. Profile headshot, birth date (*Geburtsdatum*), place of birth (*Geburtsort*), and nationality (*Staatsangehörigkeit*).
- **Middle East / Gulf (UAE, KSA):** A4 format. Headshot toggle, visa status, driving license, and nationality.
- Switching country presets dynamically toggles form inputs and adjusts the canvas aspect ratio and page boundaries.

### 4. Two-Column FlowCV Editor & Live Canvas
- **Left Panel (Inputs):**
  - Personal Details with dynamic country fields and local Base64 photo storage.
  - Employment History with `@dnd-kit` drag-and-drop sortable items.
  - Bullet-point **Action Verb Auto-Formatter** library (Leadership, Technical, Execution, Innovation, Analysis, Communication).
  - Education, Skills (categorized with proficiency levels), Projects, Certifications, Languages, and Arbitrary Custom Sections.
  - Drag-and-drop reordering and visibility toggles across all sections.
- **Right Panel (Live Canvas):**
  - Scaled real-time A4/Letter page container with interactive zoom (50% to 140%).
  - Visual page boundary line indicator to guide single-page vs multi-page content.
  - **3 Built-in Templates:**
    - *Modern Clean* (FlowCV style)
    - *Classic ATS Single-Column* (Resume.io style)
    - *Executive Minimalist* (Refined editorial typography)
  - Styling controls: Accent color palette, typography selection, font size, line height, and page margins.
  - Single-click **"Download PDF"** generating crisp, ATS-friendly vector text directly via `@react-pdf/renderer`.

### 5. Client-Side Resume Scanner
- Drag-and-drop file upload supporting `.pdf` (via `pdfjs-dist`) and `.docx` (via `mammoth`).
- Built-in heuristic pattern-matching engine detecting candidate names, emails, phone numbers, links, sections, dates, and bullet points.
- Instant import into a new resume in the local database.

---

## Tech Stack
- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Lucide React
- **Local DB:** `dexie` + `dexie-react-hooks`
- **State Store:** `zustand`
- **Drag & Drop:** `@dnd-kit/core` + `@dnd-kit/sortable`
- **PDF Engine:** `@react-pdf/renderer`
- **Extractors:** `pdfjs-dist` + `mammoth`

---

## Getting Started

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build
```
