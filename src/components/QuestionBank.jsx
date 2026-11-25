import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  Copy,
  Edit3,
  Save,
  Volume2,
  AlertTriangle,
  Search,
} from 'lucide-react';
import { ALL_ROLES, COMPANIES, IT_ROLES, NON_IT_ROLES } from '../data/catalog';
import {
  generateAllAnswerStyles,
  generateQuestionsForProfile,
  getRoleContext,
} from '../engine/personalizer';

const STYLES = [
  { id: 'natural', label: 'Natural Human' },
  { id: 'professional', label: 'Professional' },
  { id: 'simple', label: 'Simple English' },
  { id: 'short', label: 'Short (20–30s)' },
  { id: 'detailed', label: 'Detailed (60–90s)' },
  { id: 'telugu', label: 'Telugu Explanation' },
  { id: 'speaking', label: 'Speaking Practice' },
];

export default function QuestionBank({
  profile,
  onQuickUpdateProfile,
  savedAnswers,
  onSaveCustomAnswer,
  bookmarks,
  onToggleBookmark,
  completedIds,
  onToggleCompleted,
}) {
  const [roleTrack, setRoleTrack] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [activeStyleByQ, setActiveStyleByQ] = useState({});
  const [editingQ, setEditingQ] = useState(null);
  const [editBuffer, setEditBuffer] = useState('');
  const [copiedId, setCopiedId] = useState('');

  const trackRoles = roleTrack === 'IT' ? IT_ROLES : roleTrack === 'Non-IT' ? NON_IT_ROLES : ALL_ROLES;
  const roleCtx = getRoleContext(profile.targetRole);
  const questions = useMemo(() => generateQuestionsForProfile(profile), [profile]);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(questions.map((q) => q.category)))],
    [questions]
  );

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const matchCat = selectedCategory === 'All' || q.category === selectedCategory;
      const matchDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
      const matchSearch =
        !searchQuery.trim() ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchDiff && matchSearch;
    });
  }, [questions, selectedCategory, selectedDifficulty, searchQuery]);

  const speakSentence = (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.92;
    utter.lang = 'en-IN';
    window.speechSynthesis.speak(utter);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 1800);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      {/* Dynamic Role & Company Quick Switcher */}
      <div className="gm-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)]">
              Personalized Q&amp;A Engine
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Realistic practice questions adapted to{' '}
              <strong className="text-[var(--foreground)]">{profile.fullName || 'Candidate'}</strong>{' '}
              ({profile.degree || 'Degree'} · {profile.experienceType === 'Fresher' ? 'Fresher' : profile.experienceYears})
              — not confidential company questions.
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <div className="mb-1 flex items-center justify-between gap-1">
              <label className="text-xs font-semibold text-[var(--text-muted)]">
                Target Role
              </label>
              <div className="flex gap-1">
                {['All', 'IT', 'Non-IT'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setRoleTrack(t);
                      if (t === 'IT' && !IT_ROLES.includes(profile.targetRole)) {
                        onQuickUpdateProfile({ targetRole: IT_ROLES[0], careerTrack: 'IT' });
                      } else if (t === 'Non-IT' && !NON_IT_ROLES.includes(profile.targetRole)) {
                        onQuickUpdateProfile({ targetRole: NON_IT_ROLES[0], careerTrack: 'Non-IT' });
                      }
                    }}
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                      roleTrack === t
                        ? 'border-[var(--brand-cyan)] bg-[var(--field)] text-[var(--foreground)]'
                        : 'border-[var(--line)] text-[var(--text-muted)]'
                    }`}
                  >
                    {t === 'All' ? 'All 40' : `${t} 20`}
                  </button>
                ))}
              </div>
            </div>
            <select
              value={trackRoles.includes(profile.targetRole) ? profile.targetRole : ''}
              onChange={(e) => {
                if (e.target.value) onQuickUpdateProfile({ targetRole: e.target.value });
              }}
              className="gm-input"
            >
              <option value="">Custom: {profile.targetRole || 'Select role'}</option>
              {trackRoles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
              Target Company
            </label>
            <input
              list="qb-companies"
              value={profile.targetCompany || ''}
              onChange={(e) => onQuickUpdateProfile({ targetCompany: e.target.value })}
              className="gm-input"
              placeholder="Select or type company"
            />
            <datalist id="qb-companies">
              {COMPANIES.map((c) => (
                <option key={c.name} value={c.name} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
              Search Questions
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by keyword..."
                className="gm-input pl-9"
              />
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-[var(--chip-line)] bg-[var(--field)] px-3 py-2 text-xs text-[var(--foreground)]">
          <strong className="text-[var(--brand-cyan)]">{roleCtx.track} Fresher Context:</strong>{' '}
          Adapting questions &amp; answers for <strong>{profile.targetRole}</strong> — focusing on{' '}
          {roleCtx.fresherFocus}.
        </div>

        {/* Category & Difficulty Pills */}
        <div className="no-scrollbar mt-4 flex flex-nowrap gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-[38px] shrink-0 rounded-full border px-3.5 py-1 text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'border-[var(--brand-cyan)] bg-[var(--field)] text-[var(--foreground)]'
                  : 'border-[var(--line)] bg-[var(--panel-2)] text-[var(--text-muted)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[var(--text-muted)]">Difficulty:</span>
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => setSelectedDifficulty(diff)}
              className={`min-h-[32px] rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                selectedDifficulty === diff
                  ? 'border-[var(--live)] bg-[var(--live-soft)] text-[var(--live)]'
                  : 'border-[var(--line)] text-[var(--text-muted)]'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Question Cards */}
      <div className="space-y-4">
        {filtered.map((q) => {
          const activeStyle = activeStyleByQ[q.id] || 'natural';
          const styles = generateAllAnswerStyles(q, profile);
          const customKey = `${q.id}:${activeStyle}`;
          const displayAnswer = savedAnswers[customKey] || styles[activeStyle];
          const isBookmarked = bookmarks.includes(q.id);
          const isDone = completedIds.includes(q.id);
          const isEditing = editingQ === customKey;

          return (
            <article key={q.id} className="gm-card p-4 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[var(--chip-line)] bg-[var(--field)] px-2.5 py-0.5 text-xs font-semibold text-[var(--brand-cyan)]">
                      {q.category}
                    </span>
                    <span className="rounded-full border border-[var(--line)] px-2.5 py-0.5 text-xs font-medium text-[var(--text-muted)]">
                      {q.difficulty}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[var(--foreground)] sm:text-lg">
                    {q.question}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">{q.intent}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleBookmark(q.id)}
                    aria-label="Bookmark question"
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                      isBookmarked
                        ? 'border-[var(--brand-cyan)] bg-[var(--field)] text-[var(--brand-cyan)]'
                        : 'border-[var(--line)] text-[var(--text-muted)]'
                    }`}
                  >
                    <Bookmark className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleCompleted(q.id)}
                    aria-label="Mark practiced"
                    className={`flex h-10 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold ${
                      isDone
                        ? 'border-[var(--live)] bg-[var(--live-soft)] text-[var(--live)]'
                        : 'border-[var(--line)] text-[var(--text-muted)]'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{isDone ? 'Practiced' : 'Mark Done'}</span>
                  </button>
                </div>
              </div>

              {/* 7 Answer Style Tabs */}
              <div className="no-scrollbar mt-4 flex flex-nowrap gap-1.5 overflow-x-auto border-b border-[var(--line)] pb-3 sm:flex-wrap sm:overflow-visible">
                {STYLES.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      setActiveStyleByQ((prev) => ({ ...prev, [q.id]: st.id }));
                      setEditingQ(null);
                    }}
                    className={`min-h-[38px] shrink-0 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                      activeStyle === st.id
                        ? 'bg-[var(--btn-bg)] text-[var(--btn-fg)]'
                        : 'bg-[var(--panel-2)] text-[var(--text-muted)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Answer Content */}
              <div className="gm-card-inner mt-3 p-4">
                {activeStyle === 'speaking' ? (
                  <div className="space-y-3">
                    {styles.speaking.map((item) => (
                      <div
                        key={item.step}
                        className="flex flex-col justify-between gap-2 rounded-xl border border-[var(--line)] bg-[var(--panel)] p-3 sm:flex-row sm:items-center"
                      >
                        <div>
                          <div className="text-sm font-medium text-[var(--foreground)]">
                            {item.step}. {item.sentence}
                          </div>
                          <div className="mt-1 text-xs text-[var(--text-muted)]">
                            Tip: {item.tip}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => speakSentence(item.sentence)}
                          className="gm-pill-outline shrink-0"
                        >
                          <Volume2 className="h-4 w-4" />
                          <span>Listen</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      rows={4}
                      value={editBuffer}
                      onChange={(e) => setEditBuffer(e.target.value)}
                      className="gm-input"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onSaveCustomAnswer(customKey, editBuffer);
                          setEditingQ(null);
                        }}
                        className="gm-pill-primary"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save Answer</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingQ(null)}
                        className="gm-pill-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--foreground)]">
                      {displayAnswer}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--line)] pt-3">
                      <button
                        type="button"
                        onClick={() => handleCopy(customKey, displayAnswer)}
                        className="gm-pill-outline"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span>{copiedId === customKey ? 'Copied!' : 'Copy'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingQ(customKey);
                          setEditBuffer(displayAnswer);
                        }}
                        className="gm-pill-outline"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Edit &amp; Save</span>
                      </button>
                      {activeStyle !== 'telugu' && (
                        <button
                          type="button"
                          onClick={() => speakSentence(displayAnswer)}
                          className="gm-pill-outline"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                          <span>Speak</span>
                        </button>
                      )}
                    </div>
                  </>
                )}

                {styles.missingInfo.length > 0 && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      Missing verified details: <strong>{styles.missingInfo.join(', ')}</strong>.
                      Add them in your Profile so answers stay 100% authentic without placeholders.
                    </span>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
