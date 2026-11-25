import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, UserCheck } from 'lucide-react';
import { ALL_ROLES, COMPANIES, DEGREES, IT_ROLES, NON_IT_ROLES } from '../data/catalog';
import { generateLivePreview, getRoleContext } from '../engine/personalizer';

export default function LivePreviewHero({ activeProfile, onApplyPreview, onNavigate }) {
  const [roleTrack, setRoleTrack] = useState('All');
  const [preview, setPreview] = useState({
    name: activeProfile.fullName || 'Akkaladevi Sravan Kumar',
    education: activeProfile.degree || 'MCA',
    experience: activeProfile.experienceType === 'Fresher' ? 'Fresher' : (activeProfile.experienceYears || '2 years'),
    targetRole: activeProfile.targetRole || 'Python Developer',
    company: activeProfile.targetCompany || 'Amazon',
  });
  const [appliedToast, setAppliedToast] = useState(false);

  const generatedIntro = generateLivePreview(preview);
  const roleCtx = getRoleContext(preview.targetRole);
  const trackRoles = roleTrack === 'IT' ? IT_ROLES : roleTrack === 'Non-IT' ? NON_IT_ROLES : ALL_ROLES;

  const handleApply = () => {
    onApplyPreview({
      fullName: preview.name.trim() || 'Candidate',
      degree: preview.education.trim() || 'MCA',
      experienceType: /fresher|0/i.test(preview.experience) ? 'Fresher' : 'Experienced',
      experienceYears: /fresher|0/i.test(preview.experience) ? '0' : preview.experience,
      targetRole: preview.targetRole.trim() || 'Quality Associate',
      targetCompany: preview.company.trim() || 'Amazon',
    });
    setAppliedToast(true);
    setTimeout(() => setAppliedToast(false), 2600);
  };

  return (
    <section className="gm-hero-bg rounded-b-[1.75rem] border-b border-[var(--line)] px-4 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-12">
        {/* Left Hero Copy */}
        <div className="space-y-5 lg:col-span-6">
          <div className="gm-live-badge">
            <span className="h-2 w-2 rounded-full bg-current" />
            <span>InterviewIQ · One Profile = Personalized Prep</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl lg:leading-[1.06]">
            Every question &amp; answer{' '}
            <span className="gm-grad-text">adapts to you.</span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
            Built for every candidate — not one fixed script. Enter your real degree, experience,
            skills, and target role to get natural human answers, Telugu explanations, and realistic
            mock interviews.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => onNavigate('mock')}
              className="gm-pill-primary"
            >
              <span>Let&apos;s Get Started — Mock Interview</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('questions')}
              className="gm-pill-outline"
            >
              <span>Practice Q&amp;A</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 text-xs text-[var(--text-muted)]">
            <span className="gm-chip px-3 py-1.5">7 Answer Styles</span>
            <span className="gm-chip px-3 py-1.5">Zero Invented Claims</span>
            <span className="gm-chip px-3 py-1.5">9-Stage Mock Interview</span>
            <span className="gm-chip px-3 py-1.5">Mobile-First</span>
          </div>
        </div>

        {/* Right Live Personalization Preview Card */}
        <div className="gm-card p-5 sm:p-6 lg:col-span-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
                <Sparkles className="h-4 w-4 text-[var(--brand-cyan)]" />
                <span>Your Interview Setup</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Pick your IT or Non-IT role and target company to preview your introduction.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                Candidate name
              </label>
              <input
                type="text"
                value={preview.name}
                onChange={(e) => setPreview((p) => ({ ...p, name: e.target.value }))}
                placeholder="Enter your full name"
                className="gm-input"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                Education
              </label>
              <input
                list="preview-degrees"
                value={preview.education}
                onChange={(e) => setPreview((p) => ({ ...p, education: e.target.value }))}
                placeholder="e.g. MCA, B.Tech, BCA"
                className="gm-input"
              />
              <datalist id="preview-degrees">
                {DEGREES.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                Experience
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Fresher', '2 years'].map((exp) => {
                  const active = preview.experience.toLowerCase() === exp.toLowerCase();
                  return (
                    <button
                      key={exp}
                      type="button"
                      onClick={() => setPreview((p) => ({ ...p, experience: exp }))}
                      className={`min-h-[44px] rounded-[0.875rem] border px-3 text-sm font-semibold transition ${
                        active
                          ? 'border-[var(--brand-cyan)] bg-[var(--field)] text-[var(--foreground)]'
                          : 'border-[var(--line)] bg-[var(--panel-2)] text-[var(--text-muted)]'
                      }`}
                    >
                      {exp}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="sm:col-span-2">
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-semibold text-[var(--text-muted)]">
                  Target role ({trackRoles.length} fresher roles)
                </label>
                <div className="flex gap-1">
                  {['All', 'IT', 'Non-IT'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setRoleTrack(t);
                        if (t === 'IT' && !IT_ROLES.includes(preview.targetRole)) {
                          setPreview((p) => ({ ...p, targetRole: IT_ROLES[0] }));
                        } else if (t === 'Non-IT' && !NON_IT_ROLES.includes(preview.targetRole)) {
                          setPreview((p) => ({ ...p, targetRole: NON_IT_ROLES[0] }));
                        }
                      }}
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                        roleTrack === t
                          ? 'border-[var(--brand-cyan)] bg-[var(--field)] text-[var(--foreground)]'
                          : 'border-[var(--line)] text-[var(--text-muted)]'
                      }`}
                    >
                      {t === 'All' ? 'All (40)' : t === 'IT' ? 'IT (20)' : 'Non-IT (20)'}
                    </button>
                  ))}
                </div>
              </div>
              <select
                value={trackRoles.includes(preview.targetRole) ? preview.targetRole : ''}
                onChange={(e) => {
                  if (e.target.value) setPreview((p) => ({ ...p, targetRole: e.target.value }));
                }}
                className="gm-input mb-2"
              >
                <option value="">Select from Top {trackRoles.length} {roleTrack} Roles...</option>
                {trackRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <input
                list="preview-roles"
                value={preview.targetRole}
                onChange={(e) => setPreview((p) => ({ ...p, targetRole: e.target.value }))}
                placeholder="Or type custom role..."
                className="gm-input"
              />
              <datalist id="preview-roles">
                {trackRoles.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                Company
              </label>
              <input
                list="preview-companies"
                value={preview.company}
                onChange={(e) => setPreview((p) => ({ ...p, company: e.target.value }))}
                placeholder="e.g. Amazon, TCS, Google"
                className="gm-input"
              />
              <datalist id="preview-companies">
                {COMPANIES.map((c) => (
                  <option key={c.name} value={c.name} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Live Output Box */}
          <div className="gm-card-inner mt-4 p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[var(--brand-cyan)]">
                Generated sample introduction ({roleCtx.track} fresher context)
              </span>
              <span className="text-[11px] font-medium text-[var(--live)]">Live updating</span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--foreground)]">
              &ldquo;{generatedIntro}&rdquo;
            </p>
            <p className="mt-2.5 text-xs text-[var(--text-muted)]">
              This is a basic preview. The full Q&amp;A engine generates detailed answers using your
              verified projects, skills, and education-to-job context.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleApply}
              className="gm-pill-primary w-full sm:w-auto"
            >
              {appliedToast ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Applied to Active Profile!</span>
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4" />
                  <span>Use These Details</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('mock')}
              className="gm-pill-outline w-full sm:w-auto"
            >
              <span>Start Mock Interview</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
