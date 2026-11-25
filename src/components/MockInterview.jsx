import React, { useMemo, useState } from 'react';
import { Mic, MicOff, Send, Award, RotateCcw, Volume2, ArrowRight } from 'lucide-react';
import { evaluateMockAnswer, generateQuestionsForProfile } from '../engine/personalizer';

export default function MockInterview({ profile, onRecordSession }) {
  const questions = useMemo(() => {
    const all = generateQuestionsForProfile(profile);
    // Build structured 8-question interview flow + final feedback stage (9 stages total)
    const orderedIds = [
      'hr-intro',
      'edu-nonit-1',
      'hr-why-company',
      'tech-skills',
      'tech-project',
      'scenario-quality',
      'hr-strengths',
      'salary-expectation',
    ];
    const picked = [];
    orderedIds.forEach((id) => {
      const found = all.find((q) => q.id === id);
      if (found) picked.push(found);
    });
    all.forEach((q) => {
      if (picked.length < 8 && !picked.some((p) => p.id === q.id)) {
        picked.push(q);
      }
    });
    return picked.slice(0, 8);
  }, [profile]);

  const [started, setStarted] = useState(false);
  const [stageIdx, setStageIdx] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [currentEval, setCurrentEval] = useState(null);
  const [history, setHistory] = useState([]);
  const [listening, setListening] = useState(false);
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[stageIdx];
  const candidateName = profile.preferredName || profile.fullName || 'Candidate';

  const startVoice = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return;
    const rec = new SpeechRec();
    rec.lang = 'en-IN';
    rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (e) => {
      const transcript = e.results?.[0]?.[0]?.transcript || '';
      setAnswerText((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    rec.start();
  };

  const speakPrompt = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-IN';
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  };

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    const evaluation = evaluateMockAnswer(currentQuestion, answerText, profile);
    setCurrentEval(evaluation);
    setHistory((prev) => [
      ...prev,
      {
        question: currentQuestion.question,
        category: currentQuestion.category,
        userAnswer: answerText,
        ...evaluation,
      },
    ]);
  };

  const handleNext = () => {
    if (stageIdx + 1 < questions.length) {
      setStageIdx((i) => i + 1);
      setAnswerText('');
      setCurrentEval(null);
    } else {
      const avgScore = Number(
        (
          history.reduce((sum, item) => sum + item.overallScore, 0) /
          Math.max(1, history.length)
        ).toFixed(1)
      );
      onRecordSession({
        id: `mock-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        role: profile.targetRole || 'Quality Associate',
        company: profile.targetCompany || 'Target Company',
        score: avgScore,
        questionsCount: history.length,
        entries: history,
      });
      setFinished(true);
    }
  };

  const resetMock = () => {
    setStarted(false);
    setStageIdx(0);
    setAnswerText('');
    setCurrentEval(null);
    setHistory([]);
    setFinished(false);
  };

  if (!started) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="gm-card p-6 sm:p-8">
          <div className="gm-live-badge mb-3">9-Stage Personalized Mock Interview</div>
          <h2 className="text-2xl font-extrabold text-[var(--foreground)] sm:text-3xl">
            Hello {candidateName}, ready for your {profile.targetRole || 'Interview'} practice?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)]">
            This mock interviewer adapts every question to your {profile.degree || 'education'},{' '}
            {profile.experienceType === 'Fresher' ? 'fresher profile' : profile.experienceYears},
            skills, and target company ({profile.targetCompany || 'selected company'}). After each
            response, you get a score out of 10, grammar corrections, an improved natural answer,
            and a follow-up question.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="gm-card-inner p-3.5 text-xs">
              <div className="font-bold text-[var(--foreground)]">1. Personalized Flow</div>
              <p className="mt-1 text-[var(--text-muted)]">
                Intro → Education → Role → Skills → Projects → Scenario → HR → Feedback
              </p>
            </div>
            <div className="gm-card-inner p-3.5 text-xs">
              <div className="font-bold text-[var(--foreground)]">2. Honest Scoring</div>
              <p className="mt-1 text-[var(--text-muted)]">
                Evaluates clarity, relevance, grammar, and written confidence indicators.
              </p>
            </div>
            <div className="gm-card-inner p-3.5 text-xs">
              <div className="font-bold text-[var(--foreground)]">3. Text or Voice</div>
              <p className="mt-1 text-[var(--text-muted)]">
                Type your answer or use browser voice dictation where supported.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStarted(true)}
            className="gm-pill-primary mt-6 w-full sm:w-auto"
          >
            <span>Start Mock Interview</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    const avgScore = Number(
      (
        history.reduce((sum, item) => sum + item.overallScore, 0) /
        Math.max(1, history.length)
      ).toFixed(1)
    );
    return (
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="gm-card p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="gm-live-badge mb-2">Stage 9 · Final Interview Feedback</div>
              <h2 className="text-2xl font-extrabold text-[var(--foreground)]">
                Well done, {candidateName}!
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                {profile.targetRole} · {profile.targetCompany}
              </p>
            </div>
            <div className="gm-card-inner px-5 py-3 text-center">
              <div className="text-xs text-[var(--text-muted)]">Overall Score</div>
              <div className="tnum text-3xl font-extrabold gm-grad-text">{avgScore} / 10</div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {history.map((item, idx) => (
              <div key={idx} className="gm-card-inner p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-bold text-[var(--foreground)]">
                    Q{idx + 1}: {item.question}
                  </span>
                  <span className="tnum rounded-full bg-[var(--live-soft)] px-2.5 py-0.5 text-xs font-bold text-[var(--live)]">
                    {item.overallScore}/10
                  </span>
                </div>
                <p className="mt-2 text-xs text-[var(--text-muted)]">
                  <strong>Your answer:</strong> {item.userAnswer}
                </p>
                <p className="mt-1.5 text-xs text-[var(--foreground)]">
                  <strong>Improved natural version:</strong> {item.improvedNatural}
                </p>
              </div>
            ))}
          </div>

          <button type="button" onClick={resetMock} className="gm-pill-primary mt-6">
            <RotateCcw className="h-4 w-4" />
            <span>Start Another Mock Interview</span>
          </button>
        </div>
      </div>
    );
  }

  const speechSupported =
    typeof window !== 'undefined' &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="gm-card p-5 sm:p-7">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-[var(--brand-cyan)]">
            Stage {stageIdx + 1} of {questions.length} · {currentQuestion.category}
          </span>
          <button
            type="button"
            onClick={() => speakPrompt(currentQuestion.question)}
            className="gm-pill-outline"
          >
            <Volume2 className="h-4 w-4" />
            <span>Hear Question</span>
          </button>
        </div>

        <h2 className="text-xl font-bold text-[var(--foreground)] sm:text-2xl">
          {stageIdx === 0
            ? `Good morning ${candidateName}. ${currentQuestion.question}`
            : currentQuestion.question}
        </h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">{currentQuestion.intent}</p>

        <form onSubmit={handleSubmitAnswer} className="mt-5 space-y-3">
          <textarea
            rows={5}
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Speak or type your answer naturally as you would in the interview..."
            className="gm-input"
            disabled={Boolean(currentEval)}
          />

          {!currentEval && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              {speechSupported ? (
                <button
                  type="button"
                  onClick={startVoice}
                  className="gm-pill-outline"
                >
                  {listening ? <MicOff className="h-4 w-4 text-rose-400" /> : <Mic className="h-4 w-4" />}
                  <span>{listening ? 'Listening...' : 'Voice Input'}</span>
                </button>
              ) : (
                <span className="text-xs text-[var(--text-muted)]">
                  Tip: Aim for 3–5 clear sentences using your real background.
                </span>
              )}

              <button type="submit" className="gm-pill-primary w-full sm:w-auto">
                <Send className="h-4 w-4" />
                <span>Submit &amp; Evaluate</span>
              </button>
            </div>
          )}
        </form>

        {currentEval && (
          <div className="mt-6 space-y-4 border-t border-[var(--line)] pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[var(--brand-cyan)]" />
                <span className="text-base font-bold text-[var(--foreground)]">
                  Evaluation Score:
                </span>
                <span className="tnum text-xl font-extrabold gm-grad-text">
                  {currentEval.overallScore} / 10
                </span>
              </div>
              <button type="button" onClick={handleNext} className="gm-pill-primary w-full sm:w-auto">
                <span>
                  {stageIdx + 1 < questions.length ? 'Next Question' : 'Finish & View Report'}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Object.entries(currentEval.breakdown).map(([k, val]) => (
                <div key={k} className="gm-card-inner p-2.5 text-center">
                  <div className="text-[11px] capitalize text-[var(--text-muted)]">
                    {k.replace(/([A-Z])/g, ' $1')}
                  </div>
                  <div className="tnum mt-0.5 text-base font-bold text-[var(--foreground)]">
                    {val}/10
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="gm-card-inner p-3.5 text-xs">
                <div className="font-bold text-[var(--live)]">What was good</div>
                <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[var(--foreground)]">
                  {currentEval.goodPoints.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>
              <div className="gm-card-inner p-3.5 text-xs">
                <div className="font-bold text-amber-400">What needs improvement</div>
                <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[var(--foreground)]">
                  {currentEval.improvements.map((imp, i) => (
                    <li key={i}>{imp}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="gm-card-inner space-y-2 p-4 text-xs">
              <div>
                <span className="font-bold text-[var(--brand-cyan)]">Corrected English: </span>
                <span className="text-[var(--foreground)]">{currentEval.correctedEnglish}</span>
              </div>
              <div>
                <span className="font-bold text-[var(--brand-cyan)]">Improved natural answer: </span>
                <span className="text-[var(--foreground)]">{currentEval.improvedNatural}</span>
              </div>
              <div>
                <span className="font-bold text-[var(--live)]">Follow-up question: </span>
                <span className="text-[var(--foreground)]">{currentEval.followUpQuestion}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
