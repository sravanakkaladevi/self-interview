import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  User,
  MessageSquareText,
  Mic,
  LayoutDashboard,
  Wrench,
  Sun,
  Moon,
} from 'lucide-react';
import { DEFAULT_PROFILE, PRESET_PROFILES } from './data/catalog';
import LivePreviewHero from './components/LivePreviewHero';
import ProfileOnboarding from './components/ProfileOnboarding';
import QuestionBank from './components/QuestionBank';
import MockInterview from './components/MockInterview';
import Dashboard from './components/Dashboard';
import ToolsPanel from './components/ToolsPanel';

const NAV_ITEMS = [
  { id: 'preview', label: 'Preview', icon: Sparkles },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'questions', label: 'Q&A', icon: MessageSquareText },
  { id: 'mock', label: 'Mock', icon: Mic },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tools', label: 'Tools', icon: Wrench },
];

const PROFILES_KEY = 'interviewiq-profiles-v3';
const STATE_KEY = 'interviewiq-state-v3';
const THEME_KEY = 'growmetrik-mode';

function loadInitialProfiles() {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore storage errors
  }
  return PRESET_PROFILES;
}

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {
    activeProfileId: DEFAULT_PROFILE.id,
    savedAnswers: {},
    bookmarks: [],
    completedIds: [],
    mockHistory: [],
    dailyGoal: 5,
  };
}

export default function App() {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'dark';
    } catch {
      return 'dark';
    }
  });
  const [activeTab, setActiveTab] = useState('preview');
  const [profiles, setProfiles] = useState(loadInitialProfiles);
  const [appState, setAppState] = useState(loadInitialState);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
    try {
      localStorage.setItem(THEME_KEY, mode);
    } catch {
      // ignore
    }
  }, [mode]);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    } catch {
      // ignore
    }
  }, [profiles]);

  useEffect(() => {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(appState));
    } catch {
      // ignore
    }
  }, [appState]);

  const activeProfile =
    profiles.find((p) => p.id === appState.activeProfileId) || profiles[0] || DEFAULT_PROFILE;

  const updateActiveProfile = (updated) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === activeProfile.id ? { ...p, ...updated } : p))
    );
  };

  const handleCreateNewProfile = () => {
    const newProfile = {
      ...DEFAULT_PROFILE,
      id: `candidate-${Date.now()}`,
      fullName: 'New Candidate',
      degree: 'B.Tech',
      experienceType: 'Fresher',
      experienceYears: '0',
      targetRole: 'Software Engineer',
      targetCompany: 'Google',
      skills: {
        languages: [],
        frameworks: [],
        databases: [],
        cloud: [],
        devops: [],
        aiml: [],
        testing: [],
        softSkills: [],
      },
      projects: [
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
    setProfiles((prev) => [...prev, newProfile]);
    setAppState((prev) => ({ ...prev, activeProfileId: newProfile.id }));
    setActiveTab('profile');
  };

  const handleApplyExtracted = (extracted) => {
    const existingLangs = activeProfile.skills?.languages || [];
    const mergedLangs = Array.from(new Set([...existingLangs, ...extracted.skills]));
    updateActiveProfile({
      ...(extracted.degree ? { degree: extracted.degree } : {}),
      ...(extracted.experienceType ? { experienceType: extracted.experienceType } : {}),
      ...(extracted.experienceYears ? { experienceYears: extracted.experienceYears } : {}),
      skills: {
        ...activeProfile.skills,
        languages: mergedLangs,
      },
    });
  };

  return (
    <div className="min-h-dvh pb-24 lg:pb-0">
      {/* Top Header */}
      <header className="no-print sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--background)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className="flex items-center gap-2.5 text-left"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--chip-line)] bg-[var(--panel-2)] text-sm font-black gm-grad-text">
              IQ
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-[var(--foreground)]">
                Interview<span className="gm-grad-text">IQ</span>
              </div>
              <div className="text-[10px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                Personal Interview Coach
              </div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className="gm-chip hidden items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] sm:inline-flex"
            >
              <span className="h-2 w-2 rounded-full bg-[var(--live)]" />
              <span>
                {activeProfile.fullName || 'Candidate'} · {activeProfile.targetRole}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMode((m) => (m === 'dark' ? 'light' : 'dark'))}
              aria-label="Toggle light/dark theme"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--panel)] text-[var(--foreground)] hover:border-[var(--brand-cyan)]"
            >
              {mode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="mx-auto flex max-w-7xl gap-6 px-0 sm:px-4 lg:px-6">
        {/* Desktop Sidebar */}
        <aside className="no-print hidden w-56 shrink-0 py-6 lg:block">
          <nav className="sticky top-20 space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition ${
                    active
                      ? 'border border-[var(--chip-line)] bg-[var(--field)] text-[var(--foreground)]'
                      : 'text-[var(--text-muted)] hover:bg-[var(--panel)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-[var(--brand-cyan)]' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 pb-10">
          {activeTab === 'preview' && (
            <LivePreviewHero
              activeProfile={activeProfile}
              onApplyPreview={(patch) => {
                updateActiveProfile(patch);
              }}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab !== 'preview' && (
            <div className="px-4 pt-6 sm:px-0">
              {activeTab === 'profile' && (
                <ProfileOnboarding
                  profile={activeProfile}
                  profiles={profiles}
                  onSaveProfile={updateActiveProfile}
                  onSwitchProfile={(id) =>
                    setAppState((prev) => ({ ...prev, activeProfileId: id }))
                  }
                  onCreateNewProfile={handleCreateNewProfile}
                  onFinish={() => setActiveTab('questions')}
                />
              )}

              {activeTab === 'questions' && (
                <QuestionBank
                  profile={activeProfile}
                  onQuickUpdateProfile={updateActiveProfile}
                  savedAnswers={appState.savedAnswers || {}}
                  onSaveCustomAnswer={(key, value) =>
                    setAppState((prev) => ({
                      ...prev,
                      savedAnswers: { ...(prev.savedAnswers || {}), [key]: value },
                    }))
                  }
                  bookmarks={appState.bookmarks || []}
                  onToggleBookmark={(id) =>
                    setAppState((prev) => {
                      const list = prev.bookmarks || [];
                      return {
                        ...prev,
                        bookmarks: list.includes(id)
                          ? list.filter((x) => x !== id)
                          : [...list, id],
                      };
                    })
                  }
                  completedIds={appState.completedIds || []}
                  onToggleCompleted={(id) =>
                    setAppState((prev) => {
                      const list = prev.completedIds || [];
                      return {
                        ...prev,
                        completedIds: list.includes(id)
                          ? list.filter((x) => x !== id)
                          : [...list, id],
                      };
                    })
                  }
                />
              )}

              {activeTab === 'mock' && (
                <MockInterview
                  profile={activeProfile}
                  onRecordSession={(session) =>
                    setAppState((prev) => ({
                      ...prev,
                      mockHistory: [session, ...(prev.mockHistory || [])],
                    }))
                  }
                />
              )}

              {activeTab === 'dashboard' && (
                <Dashboard
                  profile={activeProfile}
                  completedIds={appState.completedIds || []}
                  bookmarks={appState.bookmarks || []}
                  savedAnswers={appState.savedAnswers || {}}
                  mockHistory={appState.mockHistory || []}
                  dailyGoal={appState.dailyGoal || 5}
                  onChangeDailyGoal={(g) =>
                    setAppState((prev) => ({ ...prev, dailyGoal: g }))
                  }
                  onNavigate={setActiveTab}
                />
              )}

              {activeTab === 'tools' && (
                <ToolsPanel
                  profile={activeProfile}
                  onApplyExtracted={handleApplyExtracted}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav
        className="no-print fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-[var(--line)] bg-[var(--panel)]/95 backdrop-blur-md lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex min-h-[58px] flex-col items-center justify-center gap-1 px-1 text-[11px] font-semibold ${
                active ? 'text-[var(--brand-cyan)]' : 'text-[var(--text-muted)]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
