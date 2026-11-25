import React from 'react';
import { Award, Bookmark, CheckCircle2, Target, TrendingUp } from 'lucide-react';
import { generateQuestionsForProfile, getAllSkills } from '../engine/personalizer';

export default function Dashboard({
  profile,
  completedIds,
  bookmarks,
  savedAnswers,
  mockHistory,
  dailyGoal,
  onChangeDailyGoal,
  onNavigate,
}) {
  const questions = generateQuestionsForProfile(profile);
  const allSkills = getAllSkills(profile);
  const progressPct = questions.length
    ? Math.round((completedIds.length / questions.length) * 100)
    : 0;

  const avgMockScore = mockHistory.length
    ? (mockHistory.reduce((s, m) => s + m.score, 0) / mockHistory.length).toFixed(1)
    : '—';

  const weakAreas = [];
  if (allSkills.length < 3) weakAreas.push('Add at least 3 verified skills in Profile');
  if (!(profile.projects || []).some((p) => p.name?.trim()))
    weakAreas.push('Add 1 real academic or work project');
  if (completedIds.length < 3) weakAreas.push('Practice at least 3 core Q&A prompts');
  if (mockHistory.length === 0) weakAreas.push('Complete 1 full Mock Interview');

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      {/* Candidate Profile Card */}
      <div className="gm-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="gm-live-badge mb-2">Personal Interview Dashboard</div>
            <h2 className="text-2xl font-extrabold text-[var(--foreground)]">
              {profile.fullName || 'Candidate'}
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              {profile.degree || 'Degree'} ·{' '}
              {profile.experienceType === 'Fresher'
                ? 'Fresher'
                : profile.experienceYears || 'Experienced'}{' '}
              → <strong className="text-[var(--foreground)]">{profile.targetRole}</strong> at{' '}
              <strong className="text-[var(--foreground)]">{profile.targetCompany}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="gm-pill-outline"
          >
            Edit Profile
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="gm-card-inner p-3.5">
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <CheckCircle2 className="h-4 w-4 text-[var(--live)]" />
              <span>Completed Q&amp;A</span>
            </div>
            <div className="tnum mt-1 text-2xl font-extrabold text-[var(--foreground)]">
              {completedIds.length} / {questions.length}
            </div>
          </div>

          <div className="gm-card-inner p-3.5">
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Award className="h-4 w-4 text-[var(--brand-cyan)]" />
              <span>Mock Avg Score</span>
            </div>
            <div className="tnum mt-1 text-2xl font-extrabold text-[var(--foreground)]">
              {avgMockScore}
            </div>
          </div>

          <div className="gm-card-inner p-3.5">
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Bookmark className="h-4 w-4 text-[var(--brand-violet)]" />
              <span>Bookmarked</span>
            </div>
            <div className="tnum mt-1 text-2xl font-extrabold text-[var(--foreground)]">
              {bookmarks.length}
            </div>
          </div>

          <div className="gm-card-inner p-3.5">
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <TrendingUp className="h-4 w-4 text-[var(--brand-blue)]" />
              <span>Saved Edits</span>
            </div>
            <div className="tnum mt-1 text-2xl font-extrabold text-[var(--foreground)]">
              {Object.keys(savedAnswers).length}
            </div>
          </div>
        </div>

        {/* Preparation Progress Bar */}
        <div className="mt-5">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-[var(--foreground)]">Preparation Progress</span>
            <span className="tnum font-bold text-[var(--brand-cyan)]">{progressPct}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--panel-2)]">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progressPct}%`,
                background: 'var(--brand-grad)',
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Weak Areas & Next Actions */}
        <div className="gm-card p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <Target className="h-4 w-4 text-amber-400" />
            <span>Focus &amp; Weak Areas</span>
          </div>
          {weakAreas.length === 0 ? (
            <p className="text-xs text-[var(--live)]">
              Great readiness! Keep practicing mock interviews and refining your saved answers.
            </p>
          ) : (
            <ul className="space-y-2 text-xs text-[var(--text-muted)]">
              {weakAreas.map((w, i) => (
                <li key={i} className="gm-card-inner px-3 py-2 text-[var(--foreground)]">
                  • {w}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 border-t border-[var(--line)] pt-3">
            <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
              Daily Practice Goal (questions/day)
            </label>
            <div className="flex items-center gap-2">
              {[3, 5, 10].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => onChangeDailyGoal(g)}
                  className={`min-h-[36px] rounded-lg border px-3 text-xs font-bold ${
                    dailyGoal === g
                      ? 'border-[var(--brand-cyan)] bg-[var(--field)] text-[var(--foreground)]'
                      : 'border-[var(--line)] text-[var(--text-muted)]'
                  }`}
                >
                  {g} / day
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mock Interview History */}
        <div className="gm-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-bold text-[var(--foreground)]">Interview History</span>
            <button
              type="button"
              onClick={() => onNavigate('mock')}
              className="text-xs font-semibold text-[var(--brand-cyan)] underline"
            >
              New Session
            </button>
          </div>
          {mockHistory.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)]">
              No mock interviews completed yet. Run a 9-stage session to see your score trends.
            </p>
          ) : (
            <div className="space-y-2.5">
              {mockHistory.map((m) => (
                <div
                  key={m.id}
                  className="gm-card-inner flex items-center justify-between p-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-[var(--foreground)]">
                      {m.role} · {m.company}
                    </div>
                    <div className="text-[var(--text-muted)]">
                      {m.date} · {m.questionsCount} questions
                    </div>
                  </div>
                  <span className="tnum rounded-full bg-[var(--live-soft)] px-2.5 py-1 font-bold text-[var(--live)]">
                    {m.score}/10
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
