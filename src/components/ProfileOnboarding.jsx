import React, { useState } from 'react';
import { UserPlus, Check, ChevronLeft, ChevronRight, Plus, Trash2, Users } from 'lucide-react';
import {
  ALL_ROLES,
  COMPANIES,
  DEGREES,
  SKILL_SUGGESTIONS,
} from '../data/catalog';

const STEPS = [
  'Personal Info',
  'Education',
  'Experience',
  'Skills',
  'Projects',
  'Career Preferences',
];

export default function ProfileOnboarding({
  profile,
  profiles,
  onSaveProfile,
  onSwitchProfile,
  onCreateNewProfile,
  onFinish,
}) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(profile);
  const [customSkill, setCustomSkill] = useState('');
  const [skillCategory, setSkillCategory] = useState('languages');
  const [savedMsg, setSavedMsg] = useState(false);

  // Sync draft when user switches active profile
  React.useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const updateField = (field, value) => {
    setDraft((prev) => {
      const next = { ...prev, [field]: value };
      onSaveProfile(next);
      return next;
    });
  };

  const toggleSkill = (category, skill) => {
    setDraft((prev) => {
      const current = prev.skills?.[category] || [];
      const exists = current.includes(skill);
      const updatedList = exists ? current.filter((s) => s !== skill) : [...current, skill];
      const next = {
        ...prev,
        skills: {
          ...prev.skills,
          [category]: updatedList,
        },
      };
      onSaveProfile(next);
      return next;
    });
  };

  const addCustomSkill = (e) => {
    e.preventDefault();
    const clean = customSkill.trim();
    if (!clean) return;
    const current = draft.skills?.[skillCategory] || [];
    if (!current.includes(clean)) {
      toggleSkill(skillCategory, clean);
    }
    setCustomSkill('');
  };

  const updateProject = (idx, field, value) => {
    setDraft((prev) => {
      const projects = [...(prev.projects || [])];
      projects[idx] = { ...projects[idx], [field]: value };
      const next = { ...prev, projects };
      onSaveProfile(next);
      return next;
    });
  };

  const addProject = () => {
    setDraft((prev) => {
      const next = {
        ...prev,
        projects: [
          ...(prev.projects || []),
          {
            id: `proj-${Date.now()}`,
            name: '',
            description: '',
            technologies: '',
            teamType: 'Individual',
            responsibilities: '',
            challenges: '',
          },
        ],
      };
      onSaveProfile(next);
      return next;
    });
  };

  const removeProject = (idx) => {
    setDraft((prev) => {
      const projects = (prev.projects || []).filter((_, i) => i !== idx);
      const next = { ...prev, projects: projects.length ? projects : [] };
      onSaveProfile(next);
      return next;
    });
  };

  const handleSaveDone = () => {
    onSaveProfile(draft);
    setSavedMsg(true);
    setTimeout(() => {
      setSavedMsg(false);
      onFinish?.();
    }, 800);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Multi-Candidate Profile Switcher */}
      <div className="gm-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Users className="h-5 w-5 text-[var(--brand-cyan)]" />
            <div>
              <h2 className="text-base font-bold text-[var(--foreground)]">
                Candidate Profiles
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Switch candidates or create a new profile — every Q&amp;A adapts automatically.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCreateNewProfile}
            className="gm-pill-outline"
          >
            <UserPlus className="h-4 w-4" />
            <span>New Candidate</span>
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {profiles.map((p) => {
            const active = p.id === profile.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSwitchProfile(p.id)}
                className={`min-h-[40px] rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'border-[var(--brand-cyan)] bg-[var(--field)] text-[var(--foreground)]'
                    : 'border-[var(--line)] bg-[var(--panel-2)] text-[var(--text-muted)] hover:text-[var(--foreground)]'
                }`}
              >
                {p.fullName || 'Unnamed Candidate'} · {p.degree || 'Degree'} → {p.targetRole || 'Role'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stepper */}
      <div className="gm-card p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-semibold text-[var(--brand-cyan)]">
              Step {step + 1} of {STEPS.length}
            </span>
            <h2 className="text-xl font-bold text-[var(--foreground)]">{STEPS[step]}</h2>
          </div>
          <span className="text-xs text-[var(--live)]">Auto-saved locally</span>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {STEPS.map((label, idx) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(idx)}
              className={`min-h-[40px] rounded-lg border px-2 py-1.5 text-center text-xs font-semibold transition ${
                idx === step
                  ? 'border-[var(--brand-cyan)] bg-[var(--field)] text-[var(--foreground)]'
                  : idx < step
                    ? 'border-[var(--live)]/40 bg-[var(--live-soft)] text-[var(--live)]'
                    : 'border-[var(--line)] bg-[var(--panel-2)] text-[var(--text-muted)]'
              }`}
            >
              {idx + 1}. {label}
            </button>
          ))}
        </div>

        {/* Step 0: Personal Info */}
        {step === 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                Full Name *
              </label>
              <input
                type="text"
                value={draft.fullName || ''}
                onChange={(e) => updateField('fullName', e.target.value)}
                placeholder="e.g. AKKALADEVI Sravan KUMAR"
                className="gm-input"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                Email (optional)
              </label>
              <input
                type="email"
                value={draft.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="you@example.com"
                className="gm-input"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                Location
              </label>
              <input
                type="text"
                value={draft.location || ''}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="e.g. Hyderabad, India"
                className="gm-input"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                Preferred Language
              </label>
              <select
                value={draft.preferredLanguage || 'English + Telugu Support'}
                onChange={(e) => updateField('preferredLanguage', e.target.value)}
                className="gm-input"
              >
                <option value="English">English</option>
                <option value="English + Telugu Support">English + Telugu Support</option>
                <option value="Simple English">Simple English</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                English Communication Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Basic', 'Intermediate', 'Fluent'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => updateField('englishLevel', lvl)}
                    className={`min-h-[44px] rounded-xl border text-sm font-semibold ${
                      draft.englishLevel === lvl
                        ? 'border-[var(--brand-cyan)] bg-[var(--field)] text-[var(--foreground)]'
                        : 'border-[var(--line)] bg-[var(--panel-2)] text-[var(--text-muted)]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Education */}
        {step === 1 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                Highest Qualification
              </label>
              <select
                value={draft.highestQualification || 'Postgraduate'}
                onChange={(e) => updateField('highestQualification', e.target.value)}
                className="gm-input"
              >
                <option value="Postgraduate">Postgraduate</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Diploma">Diploma</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                Degree (MCA, B.Tech, BCA, MBA, BSc...)
              </label>
              <input
                list="step-degrees"
                value={draft.degree || ''}
                onChange={(e) => updateField('degree', e.target.value)}
                placeholder="e.g. MCA"
                className="gm-input"
              />
              <datalist id="step-degrees">
                {DEGREES.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                Specialization
              </label>
              <input
                type="text"
                value={draft.specialization || ''}
                onChange={(e) => updateField('specialization', e.target.value)}
                placeholder="e.g. Computer Applications"
                className="gm-input"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                Graduation Year
              </label>
              <input
                type="text"
                value={draft.graduationYear || ''}
                onChange={(e) => updateField('graduationYear', e.target.value)}
                placeholder="e.g. 2025"
                className="gm-input"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                College Name
              </label>
              <input
                type="text"
                value={draft.collegeName || ''}
                onChange={(e) => updateField('collegeName', e.target.value)}
                placeholder="Your college name"
                className="gm-input"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                University
              </label>
              <input
                type="text"
                value={draft.university || ''}
                onChange={(e) => updateField('university', e.target.value)}
                placeholder="Your university"
                className="gm-input"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                Academic Projects Summary (optional)
              </label>
              <textarea
                rows={2}
                value={draft.academicProjects || ''}
                onChange={(e) => updateField('academicProjects', e.target.value)}
                placeholder="Briefly note any academic mini/major project"
                className="gm-input"
              />
            </div>
          </div>
        )}

        {/* Step 2: Experience */}
        {step === 2 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                Fresher or Experienced
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Fresher', 'Experienced'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => updateField('experienceType', t)}
                    className={`min-h-[44px] rounded-xl border text-sm font-semibold ${
                      draft.experienceType === t
                        ? 'border-[var(--brand-cyan)] bg-[var(--field)] text-[var(--foreground)]'
                        : 'border-[var(--line)] bg-[var(--panel-2)] text-[var(--text-muted)]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {draft.experienceType === 'Experienced' && (
              <>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                    Work Experience in Years
                  </label>
                  <input
                    type="text"
                    value={draft.experienceYears || ''}
                    onChange={(e) => updateField('experienceYears', e.target.value)}
                    placeholder="e.g. 2 years"
                    className="gm-input"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                    Previous Company
                  </label>
                  <input
                    type="text"
                    value={draft.previousCompany || ''}
                    onChange={(e) => updateField('previousCompany', e.target.value)}
                    placeholder="Company name"
                    className="gm-input"
                  />
                </div>
              </>
            )}

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                Internship Details (if any — leave blank if none)
              </label>
              <input
                type="text"
                value={draft.internshipDetails || ''}
                onChange={(e) => updateField('internshipDetails', e.target.value)}
                placeholder="e.g. 2-month Java internship at..."
                className="gm-input"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                Verified Training &amp; Certifications
              </label>
              <input
                type="text"
                value={draft.certifications || ''}
                onChange={(e) => updateField('certifications', e.target.value)}
                placeholder="Only list certifications you actually completed"
                className="gm-input"
              />
            </div>
          </div>
        )}

        {/* Step 3: Technical & Soft Skills */}
        {step === 3 && (
          <div className="space-y-5">
            <form onSubmit={addCustomSkill} className="flex flex-wrap gap-2">
              <select
                value={skillCategory}
                onChange={(e) => setSkillCategory(e.target.value)}
                className="gm-input sm:w-44"
              >
                <option value="languages">Languages</option>
                <option value="frameworks">Frameworks</option>
                <option value="databases">Databases</option>
                <option value="cloud">Cloud</option>
                <option value="devops">DevOps</option>
                <option value="aiml">AI / ML</option>
                <option value="testing">Testing Tools</option>
                <option value="softSkills">Soft Skills</option>
              </select>
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Add custom skill..."
                className="gm-input flex-1"
              />
              <button type="submit" className="gm-pill-primary">
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </button>
            </form>

            {Object.entries(SKILL_SUGGESTIONS).map(([cat, list]) => {
              const selected = draft.skills?.[cat] || [];
              const merged = Array.from(new Set([...list, ...selected]));
              return (
                <div key={cat} className="gm-card-inner p-3.5">
                  <div className="mb-2 text-xs font-bold capitalize text-[var(--text-muted)]">
                    {cat.replace(/([A-Z])/g, ' $1')}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {merged.map((skill) => {
                      const isOn = selected.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(cat, skill)}
                          className={`min-h-[36px] rounded-full border px-3 py-1 text-xs font-semibold transition ${
                            isOn
                              ? 'border-[var(--brand-cyan)] bg-[var(--field)] text-[var(--foreground)]'
                              : 'border-[var(--line)] bg-[var(--panel)] text-[var(--text-muted)]'
                          }`}
                        >
                          {isOn ? '✓ ' : '+ '}
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Step 4: Projects */}
        {step === 4 && (
          <div className="space-y-4">
            {(draft.projects || []).map((proj, idx) => (
              <div key={proj.id || idx} className="gm-card-inner space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[var(--foreground)]">
                    Project #{idx + 1}
                  </span>
                  {draft.projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProject(idx)}
                      className="inline-flex min-h-[36px] items-center gap-1 text-xs font-semibold text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    value={proj.name || ''}
                    onChange={(e) => updateProject(idx, 'name', e.target.value)}
                    placeholder="Project Name"
                    className="gm-input"
                  />
                  <input
                    type="text"
                    value={proj.technologies || ''}
                    onChange={(e) => updateProject(idx, 'technologies', e.target.value)}
                    placeholder="Technologies used (e.g. Java, SQL)"
                    className="gm-input"
                  />
                  <select
                    value={proj.teamType || 'Individual'}
                    onChange={(e) => updateProject(idx, 'teamType', e.target.value)}
                    className="gm-input"
                  >
                    <option value="Individual">Individual Project</option>
                    <option value="Team">Team Project</option>
                  </select>
                  <input
                    type="text"
                    value={proj.responsibilities || ''}
                    onChange={(e) => updateProject(idx, 'responsibilities', e.target.value)}
                    placeholder="Your actual responsibilities"
                    className="gm-input"
                  />
                  <textarea
                    rows={2}
                    value={proj.description || ''}
                    onChange={(e) => updateProject(idx, 'description', e.target.value)}
                    placeholder="Brief description of what the project does"
                    className="gm-input sm:col-span-2"
                  />
                  <input
                    type="text"
                    value={proj.challenges || ''}
                    onChange={(e) => updateProject(idx, 'challenges', e.target.value)}
                    placeholder="Challenges faced & how you solved them"
                    className="gm-input sm:col-span-2"
                  />
                </div>
              </div>
            ))}

            <button type="button" onClick={addProject} className="gm-pill-outline">
              <Plus className="h-4 w-4" />
              <span>Add Another Project</span>
            </button>
          </div>
        )}

        {/* Step 5: Career Preferences */}
        {step === 5 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                Career Track
              </label>
              <select
                value={draft.careerTrack || 'Both'}
                onChange={(e) => updateField('careerTrack', e.target.value)}
                className="gm-input"
              >
                <option value="IT">IT Roles</option>
                <option value="Non-IT">Non-IT Roles</option>
                <option value="Both">Both IT &amp; Non-IT</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                Target Job Role (or type custom)
              </label>
              <input
                list="step-roles"
                value={draft.targetRole || ''}
                onChange={(e) => updateField('targetRole', e.target.value)}
                placeholder="e.g. Quality Associate"
                className="gm-input"
              />
              <datalist id="step-roles">
                {ALL_ROLES.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                Target Company (or type custom)
              </label>
              <input
                list="step-companies"
                value={draft.targetCompany || ''}
                onChange={(e) => updateField('targetCompany', e.target.value)}
                placeholder="e.g. Amazon"
                className="gm-input"
              />
              <datalist id="step-companies">
                {COMPANIES.map((c) => (
                  <option key={c.name} value={c.name} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                Preferred Location
              </label>
              <input
                type="text"
                value={draft.preferredLocation || ''}
                onChange={(e) => updateField('preferredLocation', e.target.value)}
                placeholder="e.g. Hyderabad / Remote"
                className="gm-input"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                Expected Salary (optional)
              </label>
              <input
                type="text"
                value={draft.expectedSalary || ''}
                onChange={(e) => updateField('expectedSalary', e.target.value)}
                placeholder="e.g. As per company standards"
                className="gm-input"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                Shift Preference
              </label>
              <select
                value={draft.shiftPreference || 'Flexible / Any Shift'}
                onChange={(e) => updateField('shiftPreference', e.target.value)}
                className="gm-input"
              >
                <option value="Day Shift">Day Shift</option>
                <option value="Night / US Shift">Night / US Shift</option>
                <option value="Rotational">Rotational</option>
                <option value="Flexible / Any Shift">Flexible / Any Shift</option>
              </select>
            </div>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="gm-pill-outline disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="gm-pill-primary"
            >
              <span>Next Step</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" onClick={handleSaveDone} className="gm-pill-primary">
              <Check className="h-4 w-4" />
              <span>{savedMsg ? 'Saved! Opening Q&A...' : 'Save & Generate Q&A'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
