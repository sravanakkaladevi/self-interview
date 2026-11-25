import React, { useState } from 'react';
import { FileText, CheckCircle2, Printer, Sparkles, Upload } from 'lucide-react';
import { analyzeResumeText, compareJobDescription } from '../engine/personalizer';

export default function ToolsPanel({ profile, onApplyExtracted }) {
  const [resumeText, setResumeText] = useState('');
  const [extracted, setExtracted] = useState(null);
  const [confirmedMsg, setConfirmedMsg] = useState(false);

  const [jdText, setJdText] = useState('');
  const [jdResult, setJdResult] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = String(ev.target?.result || '');
      setResumeText(content);
      setExtracted(analyzeResumeText(content));
    };
    reader.readAsText(file);
  };

  const handleExtract = () => {
    setExtracted(analyzeResumeText(resumeText));
    setConfirmedMsg(false);
  };

  const handleConfirmSave = () => {
    if (!extracted) return;
    onApplyExtracted(extracted);
    setConfirmedMsg(true);
  };

  const handleCompareJd = () => {
    setJdResult(compareJobDescription(jdText, profile));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Resume Upload & Extraction (Confirmation Required) */}
      <div className="gm-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)]">
              Resume Extraction (With Confirmation)
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Upload a `.txt`/`.md` resume or paste resume text. Nothing is saved until you confirm.
            </p>
          </div>
          <label className="gm-pill-outline cursor-pointer">
            <Upload className="h-4 w-4" />
            <span>Upload Text Resume</span>
            <input
              type="file"
              accept=".txt,.md"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        <textarea
          rows={4}
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume text here (e.g. MCA graduate, skills: Java, Python, SQL, MySQL)..."
          className="gm-input mt-4"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={handleExtract} className="gm-pill-primary">
            <Sparkles className="h-4 w-4" />
            <span>Extract Details</span>
          </button>
        </div>

        {extracted && (
          <div className="gm-card-inner mt-4 space-y-3 p-4 text-xs">
            <div className="font-bold text-[var(--brand-cyan)]">
              Extracted Preview — Please confirm before saving to your profile:
            </div>
            <div>
              <strong>Degree detected:</strong> {extracted.degree || 'Not detected'}
            </div>
            <div>
              <strong>Experience detected:</strong>{' '}
              {extracted.experienceType
                ? `${extracted.experienceType} (${extracted.experienceYears})`
                : 'Not detected'}
            </div>
            <div>
              <strong>Skills detected:</strong>{' '}
              {extracted.skills.length ? extracted.skills.join(', ') : 'None detected'}
            </div>
            <button type="button" onClick={handleConfirmSave} className="gm-pill-primary">
              <CheckCircle2 className="h-4 w-4" />
              <span>{confirmedMsg ? 'Confirmed & Saved!' : 'Confirm & Save to Profile'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Job Description Skill-Gap Analyzer */}
      <div className="gm-card p-5 sm:p-6">
        <h2 className="text-lg font-bold text-[var(--foreground)]">
          Job Description Skill-Gap Matcher
        </h2>
        <p className="text-xs text-[var(--text-muted)]">
          Paste a target Job Description to compare required skills against your verified profile.
        </p>

        <textarea
          rows={4}
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste job description requirements (e.g. Looking for Quality Associate / Developer with SQL, Python, Attention to Detail, Excel)..."
          className="gm-input mt-4"
        />

        <button type="button" onClick={handleCompareJd} className="gm-pill-primary mt-3">
          <FileText className="h-4 w-4" />
          <span>Compare Skills</span>
        </button>

        {jdResult && (
          <div className="gm-card-inner mt-4 space-y-2 p-4 text-xs">
            <div className="text-sm font-bold text-[var(--foreground)]">
              Skill Match: <span className="gm-grad-text">{jdResult.matchPercent}%</span>
            </div>
            <div>
              <strong className="text-[var(--live)]">Matched Skills:</strong>{' '}
              {jdResult.matched.length ? jdResult.matched.join(', ') : 'None yet'}
            </div>
            <div>
              <strong className="text-amber-400">Missing / Study Focus:</strong>{' '}
              {jdResult.missing.length ? jdResult.missing.join(', ') : 'No skill gaps detected!'}
            </div>
          </div>
        )}
      </div>

      {/* Export Preparation Notes */}
      <div className="gm-card flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-[var(--foreground)]">
            Export Preparation Notes to PDF
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Print or save your personalized questions and answers as a clean PDF.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="gm-pill-outline"
        >
          <Printer className="h-4 w-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>
    </div>
  );
}
