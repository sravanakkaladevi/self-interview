import { COMPANIES, DEGREE_FULL_NAMES, IT_ROLES, NON_IT_ROLES, ROLE_FRESHER_CONTEXT, SKILL_SUGGESTIONS } from '../data/catalog';

export function getRoleContext(role) {
  const clean = (role || '').trim();
  const exact = ROLE_FRESHER_CONTEXT[clean];
  if (exact) return exact;
  const track = isNonItRole(clean) ? 'Non-IT' : 'IT';
  return {
    track,
    fresherFocus:
      track === 'Non-IT'
        ? 'accuracy, structured process execution, clear communication, and ownership'
        : 'clean fundamentals, debugging, practical project execution, and fast learning',
    scenarioHint:
      track === 'Non-IT'
        ? 'resolving a workflow bottleneck or quality issue while meeting SLAs'
        : 'debugging an unexpected issue and verifying the fix cleanly',
  };
}

export function getAllSkills(profile) {
  if (!profile?.skills) return [];
  const groups = [
    profile.skills.languages || [],
    profile.skills.frameworks || [],
    profile.skills.databases || [],
    profile.skills.cloud || [],
    profile.skills.devops || [],
    profile.skills.aiml || [],
    profile.skills.testing || [],
    profile.skills.softSkills || [],
  ];
  return Array.from(new Set(groups.flat().map((s) => s.trim()).filter(Boolean)));
}

export function getTechnicalSkills(profile) {
  if (!profile?.skills) return [];
  const groups = [
    profile.skills.languages || [],
    profile.skills.frameworks || [],
    profile.skills.databases || [],
    profile.skills.cloud || [],
    profile.skills.devops || [],
    profile.skills.aiml || [],
    profile.skills.testing || [],
  ];
  return Array.from(new Set(groups.flat().map((s) => s.trim()).filter(Boolean)));
}

export function getDegreeLabel(degree) {
  const clean = (degree || '').trim();
  if (!clean) return 'my degree';
  return DEGREE_FULL_NAMES[clean] || clean;
}

export function isNonItRole(role) {
  if (!role) return false;
  return NON_IT_ROLES.some((r) => r.toLowerCase() === role.toLowerCase()) ||
    /associate|support|operations|hr|process|customer/i.test(role);
}

export function isItRole(role) {
  if (!role) return false;
  return IT_ROLES.some((r) => r.toLowerCase() === role.toLowerCase()) ||
    /developer|engineer|analyst|scientist|tester|qa|devops|cloud|admin|cyber/i.test(role);
}

export function getCompanyFocus(companyName) {
  const match = COMPANIES.find(
    (c) => c.name.toLowerCase() === (companyName || '').trim().toLowerCase()
  );
  return (
    match?.focus ||
    'consistent quality, clear communication, ownership, and practical problem solving'
  );
}

/**
 * Live Personalization Preview generator (used in the Hero preview widget).
 */
export function generateLivePreview({ name, education, experience, targetRole, company }) {
  const safeName = (name || '').trim() || 'Candidate';
  const safeEdu = (education || '').trim() || 'my degree';
  const safeRole = (targetRole || '').trim() || 'target role';
  const safeCompany = (company || '').trim() || 'your target company';
  const isFresher = !experience || /fresher|0/i.test(experience);
  const roleCtx = getRoleContext(safeRole);

  if (isFresher) {
    return `Good morning. My name is ${safeName}. I have completed my ${safeEdu} and I am a fresher (${roleCtx.track} track). I am interested in the ${safeRole} position at ${safeCompany}, where I can focus on ${roleCtx.fresherFocus}, develop relevant skills, and contribute reliably to the organization.`;
  }

  return `Good morning. My name is ${safeName}. I have completed my ${safeEdu} and I bring ${experience} of practical experience. I am excited about the ${safeRole} position at ${safeCompany}, where I can apply ${roleCtx.fresherFocus}, deliver reliable results, and continue growing with the team.`;
}

/**
 * Detects education-to-job or experience-to-job transitions to generate special questions.
 */
export function detectProfileTransitions(profile) {
  const deg = (profile.degree || '').trim();
  const role = (profile.targetRole || '').trim();
  const isFresher = profile.experienceType === 'Fresher';
  const transitions = [];

  if (/mca|bca|b\.tech|m\.tech|bsc/i.test(deg) && isNonItRole(role)) {
    transitions.push({
      id: 'mismatch-tech-to-nonit',
      type: `${deg || 'Technical degree'} + ${role}`,
      questions: [
        {
          id: 'edu-nonit-1',
          category: 'Education-to-Job',
          difficulty: 'Intermediate',
          question: `Why are you applying for a ${role} role after completing ${deg}?`,
          intent: 'Tests clarity of career choice and genuine interest without sounding indecisive.',
        },
        {
          id: 'edu-nonit-2',
          category: 'Education-to-Job',
          difficulty: 'Intermediate',
          question: `How will your ${deg} background help you perform better as a ${role} at ${profile.targetCompany || 'our company'}?`,
          intent: 'Connects analytical, documentation, and technical literacy to operational quality.',
        },
        {
          id: 'edu-nonit-3',
          category: 'Education-to-Job',
          difficulty: 'Advanced',
          question: 'Will you move back to a software development role in the future?',
          intent: 'Assesses commitment and stability in the role.',
        },
      ],
    });
  }

  if (isFresher && isItRole(role)) {
    transitions.push({
      id: 'fresher-developer',
      type: `Fresher + ${role}`,
      questions: [
        {
          id: 'fresh-dev-1',
          category: 'Education-to-Job',
          difficulty: 'Beginner',
          question: `As a fresher, how can you contribute as a ${role} without prior industry experience?`,
          intent: 'Evaluates readiness, learning speed, and hands-on academic/project proof.',
        },
        {
          id: 'fresh-dev-2',
          category: 'Education-to-Job',
          difficulty: 'Intermediate',
          question: 'Walk me through your academic or personal project and the hardest bug or challenge you solved.',
          intent: 'Checks real ownership vs. copied coursework.',
        },
      ],
    });
  }

  if (!isFresher) {
    transitions.push({
      id: 'experienced-transition',
      type: `Experienced (${profile.experienceYears || 'Experienced'}) + ${role}`,
      questions: [
        {
          id: 'exp-1',
          category: 'Education-to-Job',
          difficulty: 'Intermediate',
          question: `Why are you looking to transition into ${role} at ${profile.targetCompany || 'this company'} now?`,
          intent: 'Checks career progression logic and professional maturity.',
        },
        {
          id: 'exp-2',
          category: 'Education-to-Job',
          difficulty: 'Intermediate',
          question: 'How will your previous work experience help you ramp up faster here?',
          intent: 'Translates past habits into immediate value.',
        },
      ],
    });
  }

  return transitions;
}

/**
 * Generates a realistic, profile-adapted question bank across all categories.
 */
export function generateQuestionsForProfile(profile) {
  const name = profile.fullName || 'Candidate';
  const role = profile.targetRole || 'Quality Associate';
  const company = profile.targetCompany || 'your target company';
  const techSkills = getTechnicalSkills(profile);
  const topSkills = techSkills.slice(0, 3).join(', ') || 'your core skills';
  const validProject = (profile.projects || []).find((p) => p.name?.trim());
  const isFresher = profile.experienceType === 'Fresher';
  const roleCtx = getRoleContext(role);

  const baseQuestions = [
    {
      id: 'hr-intro',
      category: 'HR',
      difficulty: 'Beginner',
      question: 'Tell me about yourself.',
      intent: `Introduce ${name} naturally, connecting ${profile.degree || 'education'} and ${isFresher ? 'fresher readiness' : profile.experienceYears + ' experience'} to ${role} at ${company}.`,
    },
    {
      id: 'hr-why-company',
      category: 'Company-Related',
      difficulty: 'Beginner',
      question: `Why do you want to join ${company} as a ${role}?`,
      intent: `Shows genuine alignment with ${company}'s work culture and ${role} responsibilities.`,
    },
    {
      id: 'hr-strengths',
      category: 'HR',
      difficulty: 'Beginner',
      question: 'What are your key strengths, and how do they help in this role?',
      intent: 'Highlights verified soft and technical strengths with real examples.',
    },
    {
      id: 'tech-skills',
      category: 'Technical',
      difficulty: 'Intermediate',
      question: techSkills.length
        ? `You mentioned ${topSkills}. How have you applied these skills in practice?`
        : `Which technical or analytical tools are you most comfortable using for ${role}?`,
      intent: 'Verifies hands-on depth without exaggerating unverified skills.',
    },
    {
      id: 'tech-project',
      category: 'Technical',
      difficulty: 'Intermediate',
      question: validProject
        ? `Tell me about your project "${validProject.name}". What was your exact responsibility?`
        : 'Tell me about an academic or practical task where you solved a difficult problem.',
      intent: 'Tests concrete ownership, problem-solving, and clarity.',
    },
    {
      id: 'scenario-quality',
      category: 'Practical Scenarios',
      difficulty: 'Intermediate',
      question: `As a fresher ${role} at ${company}, how would you handle ${roleCtx.scenarioHint}?`,
      intent: `Evaluates fresher readiness for ${roleCtx.track} (${roleCtx.fresherFocus}).`,
    },
    {
      id: 'scenario-pressure',
      category: 'Practical Scenarios',
      difficulty: 'Advanced',
      question: 'Describe a time you had to learn something unfamiliar quickly or handle competing priorities.',
      intent: 'Assesses adaptability and time management under pressure.',
    },
    {
      id: 'comm-clarity',
      category: 'Communication',
      difficulty: 'Beginner',
      question: 'How do you explain a technical or complex issue to someone from a non-technical background?',
      intent: 'Checks clarity, patience, and structured communication.',
    },
    {
      id: 'lead-ownership',
      category: 'Leadership',
      difficulty: 'Intermediate',
      question: 'Tell me about a time you took ownership of a task or helped a teammate who was stuck.',
      intent: 'Demonstrates initiative and collaborative ownership.',
    },
    {
      id: 'salary-expectation',
      category: 'Salary Negotiation',
      difficulty: 'Advanced',
      question: 'What are your salary expectations for this position?',
      intent: 'Handles compensation professionally without undervaluing or sounding rigid.',
    },
    {
      id: 'ask-interviewer',
      category: 'Questions to Ask',
      difficulty: 'Beginner',
      question: `What are good questions you can ask the interviewer at ${company}?`,
      intent: 'Shows curiosity about team expectations, onboarding, and success metrics.',
    },
  ];

  const transitionQuestions = detectProfileTransitions(profile).flatMap((t) => t.questions);
  return [...baseQuestions, ...transitionQuestions];
}

/**
 * Generates all 7 personalized answer styles for any question using ONLY verified profile data.
 */
export function generateAllAnswerStyles(questionObj, profile) {
  const name = (profile.fullName || '').trim();
  const degree = (profile.degree || '').trim();
  const degreeFull = getDegreeLabel(degree);
  const spec = (profile.specialization || '').trim();
  const college = (profile.collegeName || '').trim();
  const role = (profile.targetRole || '').trim() || 'the target role';
  const company = (profile.targetCompany || '').trim() || 'your organization';
  const isFresher = profile.experienceType === 'Fresher';
  const expYears = (profile.experienceYears || '').trim();
  const prevCompany = (profile.previousCompany || '').trim();
  const internship = (profile.internshipDetails || '').trim();
  const certs = (profile.certifications || '').trim();
  const techSkills = getTechnicalSkills(profile);
  const softSkills = (profile.skills?.softSkills || []).filter(Boolean);
  const validProject = (profile.projects || []).find((p) => p.name?.trim());
  const companyFocus = getCompanyFocus(company);

  const missingInfo = [];
  if (!name) missingInfo.push('Full Name');
  if (!degree) missingInfo.push('Education / Degree');
  if (!isFresher && !prevCompany) missingInfo.push('Previous Company (for experienced profile)');
  if (techSkills.length === 0) missingInfo.push('Technical or Domain Skills');
  if (!validProject) missingInfo.push('At least 1 Real Project (Academic or Work)');

  const eduPhrase = degree
    ? `${degreeFull}${spec ? ` in ${spec}` : ''}${college ? ` from ${college}` : ''}`
    : 'my academic studies';

  const expPhrase = isFresher
    ? 'I am a fresher'
    : `I have ${expYears || 'relevant'} of experience${prevCompany ? ` at ${prevCompany}` : ''}`;

  const skillPhrase =
    techSkills.length > 0
      ? `I have built hands-on familiarity with ${techSkills.slice(0, 4).join(', ')}`
      : 'I have focused on building strong foundational problem-solving skills';

  const projectPhrase = validProject
    ? `In my project "${validProject.name}", ${validProject.description || 'I worked on solving a practical problem'}${validProject.technologies ? ` using ${validProject.technologies}` : ''}.`
    : '';

  const qId = questionObj.id;
  let natural = '';
  let professional = '';
  let simple = '';
  let short = '';
  let detailed = '';
  let telugu = '';

  if (qId === 'hr-intro') {
    const internNote = internship ? ` I also completed an internship (${internship.split(':')[0]}).` : '';
    const certNote = certs ? ` I hold certifications including ${certs}.` : '';

    natural = `Good morning. My name is ${name || '[Your Name]'}. I have completed ${eduPhrase}. ${isFresher ? 'During my academic journey, I developed practical knowledge and worked on real projects to strengthen my core fundamentals.' : `${expPhrase}, where I learned how to deliver work reliably in a team environment.`}${internNote} ${skillPhrase}.${certNote} Right now, I am looking for an opportunity as a ${role} at ${company}, where I can apply my skills, learn from experienced professionals, and contribute consistently to the team.`;

    professional = `Good morning, and thank you for the opportunity. I am ${name || '[Your Name]'}, a ${degree || 'graduate'}${spec ? ` specializing in ${spec}` : ''}. ${isFresher ? 'As a fresher, I bring strong foundational training' : `With ${expYears || 'prior'} experience${prevCompany ? ` at ${prevCompany}` : ''}, I bring practical execution experience`} and hands-on proficiency in ${techSkills.length ? techSkills.slice(0, 4).join(', ') : 'core analytical workflows'}. ${projectPhrase} I am keen to join ${company} as a ${role} because of its emphasis on ${companyFocus}.`;

    simple = `Good morning. My name is ${name || '[Your Name]'}. I completed ${degree || 'my degree'}. ${isFresher ? 'I am a fresher.' : `I have ${expYears || 'work'} experience.`} ${techSkills.length ? `I know ${techSkills.slice(0, 3).join(', ')}.` : ''} I am very interested in working as a ${role} at ${company}. I learn fast and I want to do quality work for the team.`;

    short = `Hi, I'm ${name || '[Your Name]'}, a ${degree || 'graduate'} ${isFresher ? 'fresher' : `with ${expYears} experience`}${techSkills.length ? ` skilled in ${techSkills.slice(0, 3).join(', ')}` : ''}. I'm excited to apply for the ${role} role at ${company} and contribute with strong accuracy and ownership.`;

    detailed = `Good morning. My name is ${name || '[Your Name]'}. I completed ${eduPhrase}. Throughout my ${isFresher ? 'studies' : 'career so far'}, I focused on building a solid foundation rather than just memorizing concepts. ${skillPhrase}. ${projectPhrase || 'I also practiced applying my learning to structured problem-solving exercises.'} ${softSkills.length ? `People who work with me know me for ${softSkills.slice(0, 2).join(' and ').toLowerCase()}.` : ''} What excites me about the ${role} position at ${company} is the chance to work in an environment known for ${companyFocus}. I am ready to learn your processes quickly and add value from day one.`;

    telugu = `ఈ సమాధానం యొక్క అర్థం: "నమస్కారం, నా పేరు ${name || 'మీ పేరు'}. నేను ${degree || 'డిగ్రీ'} పూర్తి చేశాను (${isFresher ? 'ఫ్రెషర్' : expYears + ' అనుభవం'}). నాకు ${techSkills.slice(0, 3).join(', ') || 'సంబంధిత స్కిల్స్'} వచ్చు. ${company} లో ${role} గా చేరి నా నైపుణ్యాలను ఉపయోగించి టీమ్‌కు సహాయం చేయాలనుకుంటున్నాను." — మీరు సహజంగా, ఆత్మవిశ్వాసంతో మాట్లాడేలా ఈ సమాధానం రూపొందించబడింది.`;
  } else if (qId === 'edu-nonit-1' || qId === 'edu-nonit-2' || qId === 'edu-nonit-3') {
    natural = `I appreciate this question. While I completed ${degree || 'my technical degree'}, what I enjoyed most was structured problem-solving, accuracy, and understanding how systems work end to end. A ${role} role at ${company} values attention to detail, root-cause thinking, and clear documentation—skills I actively built during my ${degree || 'studies'}. I am genuinely interested in growing in this operations and quality track rather than treating it as a temporary stop.`;

    professional = `My ${degree || 'academic'} background trained me to analyze data, follow structured processes, and identify edge cases quickly. In a ${role} position at ${company}, those same habits translate directly into higher accuracy, faster issue resolution, and dependable adherence to SLAs and SOPs. My goal is to build long-term domain depth here.`;

    simple = `My ${degree || 'degree'} taught me how to think clearly, check details carefully, and solve problems step by step. Those skills are very useful for a ${role} at ${company}. I want to build a stable career in this role.`;

    short = `My ${degree || 'degree'} built my analytical thinking and attention to detail—both essential for excelling as a ${role} at ${company}.`;

    detailed = `That is a fair question. During my ${degree || 'degree'}${spec ? ` in ${spec}` : ''}, I realized that my strongest areas are spotting inconsistencies, analyzing workflows, and maintaining high accuracy under deadlines. ${techSkills.length ? `Having skills like ${techSkills.slice(0, 3).join(', ')} also helps me understand tools, reports, and dashboards quickly.` : ''} At ${company}, the ${role} role requires ownership and consistent quality, which matches my strengths well. I am committed to growing in this domain and taking on more responsibility over time.`;

    telugu = `ఈ ప్రశ్నకు అర్థం: "${degree} చదివి కూడా ${role} ఉద్యోగానికి ఎందుకు వస్తున్నారు?" అని అడిగినప్పుడు, మీ చదువులోని విశ్లేషణ శక్తి (analytical thinking), ఖచ్చితత్వం (accuracy) ఈ ఉద్యోగానికి ఎలా ఉపయోగపడతాయో స్పష్టంగా చెప్పాలి. మీరు ఈ రంగంలో స్థిరంగా కొనసాగాలనుకుంటున్నారని నమ్మకం కలిగించాలి.`;
  } else if (qId === 'tech-project' || qId === 'fresh-dev-2') {
    const pName = validProject?.name || 'my academic project';
    const pDesc = validProject?.description || 'solving a real-world workflow problem';
    const pResp = validProject?.responsibilities || 'designing the core logic, testing edge cases, and documenting results';
    const pChal = validProject?.challenges || 'handling unexpected input edge cases and keeping the output reliable';

    natural = `In ${pName}, the main goal was ${pDesc}. My responsibility was ${pResp}. One challenge I faced was ${pChal}, which I resolved by breaking the problem down step by step and testing each case carefully. That experience taught me how important verification and clean execution are.`;

    professional = `During ${pName}${validProject?.technologies ? ` (built with ${validProject.technologies})` : ''}, I was responsible for ${pResp}. When we encountered ${pChal}, I isolated the root cause, implemented a structured fix, and validated the outcome to ensure consistent reliability.`;

    simple = `I worked on ${pName}. It was about ${pDesc}. I handled ${pResp}. When I faced a problem with ${pChal}, I tested step by step and fixed it.`;

    short = `In ${pName}, I handled ${pResp} and resolved ${pChal} through systematic testing and debugging.`;

    detailed = `Let me walk you through ${pName}. The objective was ${pDesc}${validProject?.technologies ? `, using ${validProject.technologies}` : ''}. ${validProject?.teamType ? `It was a ${validProject.teamType.toLowerCase()} effort, and my` : 'My'} specific ownership included ${pResp}. The toughest challenge was ${pChal}. Instead of guessing, I reproduced the issue with sample cases, traced where the flow broke, and verified the fix end to end. This gave me practical confidence in handling real tasks for a ${role} role.`;

    telugu = `మీ ప్రాజెక్ట్ గురించి చెప్పేటప్పుడు 4 విషయాలు చెప్పండి: 1) ప్రాజెక్ట్ పేరు (${pName}), 2) మీరు చేసిన పని, 3) మీకు ఎదురైన సమస్య, 4) మీరు దాన్ని ఎలా పరిష్కరించారు. సొంతంగా చేసిన పనిని స్పష్టంగా చెప్పడం ముఖ్యం.`;
  } else {
    natural = `For ${role} at ${company}, I approach this by staying structured and practical. ${isFresher ? `Even as a ${degree || 'recent'} graduate, I rely on my preparation in ${techSkills.slice(0, 3).join(', ') || 'core fundamentals'}` : `Drawing from my ${expYears || 'work'} experience${prevCompany ? ` at ${prevCompany}` : ''}, I focus on clear communication and measurable outcomes`}. First I understand the exact requirement or issue, check the relevant guidelines or data, and then act with accountability while keeping stakeholders informed.`;

    professional = `In the context of ${role} at ${company}, where ${companyFocus} matter, I handle this with a structured process: clarify the objective, verify the facts or data, execute cleanly using ${techSkills.slice(0, 2).join(' and ') || 'established best practices'}, and document any learnings so the team benefits.`;

    simple = `In this situation, I first understand the problem clearly. Then I check all the details carefully and follow the right steps. If needed, I ask questions early so there are no mistakes.`;

    short = `I clarify the goal, verify the details carefully, and execute step by step while keeping the team updated.`;

    detailed = `When facing this as a ${role} at ${company}, I follow three clear steps. First, I gather complete context so I do not make assumptions. Second, I apply my background${techSkills.length ? ` in ${techSkills.slice(0, 3).join(', ')}` : ''} and follow standard guidelines carefully to solve the core issue rather than applying a temporary patch. Third, I double-check the output and share a concise summary with my team or manager. ${isFresher ? 'As a fresher, this disciplined approach helps me learn fast and avoid preventable errors.' : 'This approach has consistently helped me deliver reliable results.'}`;

    telugu = `ఈ ప్రశ్నకు మీరు ఎలా ఆలోచిస్తారు, సమస్యను ఎలా పరిష్కరిస్తారు అని ఇంటర్వ్యూయర్ చూస్తారు. ముందు సమస్యను అర్థం చేసుకోవడం, ఆపై సరైన స్టెప్స్ ఫాలో అవ్వడం, చివరగా ఫలితాన్ని చెక్ చేయడం — ఈ 3 దశల్లో సమాధానం చెబితే చాలా బాగుంటుంది.`;
  }

  const speakingSource = natural.split(/(?<=[.!?])\s+/).filter(Boolean);
  const speaking = speakingSource.map((sentence, idx) => ({
    step: idx + 1,
    sentence,
    tip:
      idx === 0
        ? 'Pause briefly after greeting, smile, and keep a steady pace.'
        : idx === speakingSource.length - 1
          ? 'End clearly with slightly firmer tone on the final words.'
          : 'Stress the key nouns (degree, skills, role, company) and breathe naturally at commas.',
  }));

  return {
    natural,
    professional,
    simple,
    short,
    detailed,
    telugu,
    speaking,
    missingInfo,
  };
}

/**
 * Evaluates a candidate's mock interview answer across 7 dimensions.
 */
export function evaluateMockAnswer(questionObj, userAnswer, profile) {
  const text = (userAnswer || '').trim();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const lower = text.toLowerCase();

  const role = (profile.targetRole || '').toLowerCase();
  const company = (profile.targetCompany || '').toLowerCase();
  const skills = getAllSkills(profile).map((s) => s.toLowerCase());
  const mentionedSkills = skills.filter((s) => lower.includes(s));

  const hasGreetingOrStructure = /good|hello|my name|i am|first|second|because|example|project|experience|learned/i.test(text);
  const hasGrammarIssues = /\bi is\b|\bi has\b|\bi am having a experience\b|\bmyself\s+[a-z]+/i.test(text) || (!/[.!?]$/.test(text) && wordCount > 5);
  const hasHesitation = /\b(um+|uh+|maybe|i don't know|not sure|actually basically)\b/i.test(text);

  const relevance = Math.min(10, Math.max(3, (wordCount >= 18 ? 7 : 4) + (role && lower.includes(role.split(' ')[0]) ? 2 : 0) + (company && lower.includes(company) ? 1 : 0)));
  const communication = Math.min(10, Math.max(3, (wordCount >= 25 ? 7 : 5) + (hasGreetingOrStructure ? 2 : 0) - (hasHesitation ? 2 : 0)));
  const grammar = Math.min(10, Math.max(4, (hasGrammarIssues ? 6 : 8) + (wordCount > 15 ? 1 : 0)));
  const confidenceIndicators = Math.min(10, Math.max(4, (hasHesitation ? 5 : 8) + (/i can|i learned|i built|i completed|i handled/i.test(text) ? 1 : 0)));
  const technicalAccuracy = Math.min(10, Math.max(4, 6 + Math.min(3, mentionedSkills.length) + (/test|data|quality|process|code|database|debug/i.test(text) ? 1 : 0)));
  const clarity = Math.min(10, Math.max(4, wordCount >= 20 && wordCount <= 140 ? 8 : wordCount < 20 ? 5 : 7));
  const personalization = Math.min(10, Math.max(3, 4 + (mentionedSkills.length > 0 ? 2 : 0) + (profile.degree && lower.includes(profile.degree.toLowerCase()) ? 2 : 0) + (company && lower.includes(company) ? 2 : 0)));

  const avg = Number(
    ((relevance + communication + grammar + confidenceIndicators + technicalAccuracy + clarity + personalization) / 7).toFixed(1)
  );

  const goodPoints = [];
  if (wordCount >= 20) goodPoints.push('Your response has enough detail to sound substantive.');
  if (mentionedSkills.length > 0) goodPoints.push(`You naturally referenced your verified skills (${mentionedSkills.slice(0, 3).join(', ')}).`);
  if (hasGreetingOrStructure) goodPoints.push('Good conversational structure that is easy for an interviewer to follow.');
  if (goodPoints.length === 0) goodPoints.push('You gave a direct, honest starting response.');

  const improvements = [];
  if (wordCount < 20) improvements.push('Expand your answer to 3–5 clear sentences (around 35–70 words) with one concrete example.');
  if (personalization < 7) improvements.push(`Mention your actual ${profile.degree || 'education'}, ${profile.targetRole || 'target role'}, or ${profile.targetCompany || 'target company'} to make it sound tailored.`);
  if (hasHesitation) improvements.push('Remove filler/hesitation phrases like "maybe", "um", or "not sure".');
  if (hasGrammarIssues) improvements.push('Check subject-verb agreement and end sentences cleanly with punctuation.');

  let correctedEnglish = text
    .replace(/\bmyself\s+([A-Za-z]+)/gi, 'My name is $1')
    .replace(/\bi is\b/gi, 'I am')
    .replace(/\bi has\b/gi, 'I have')
    .trim();
  if (correctedEnglish && !/[.!?]$/.test(correctedEnglish)) correctedEnglish += '.';

  const improvedNatural = generateAllAnswerStyles(questionObj, profile).natural;

  const followUps = [
    `Can you share one specific example that proves your strength in ${profile.targetRole || 'this area'}?`,
    `What would you do in your first 30 days at ${profile.targetCompany || 'the company'} to get up to speed?`,
    `If you faced a tight deadline on a ${profile.targetRole || 'project'} task, how would you prioritize?`,
  ];

  return {
    overallScore: avg,
    breakdown: {
      relevance,
      communication,
      grammar,
      confidenceIndicators,
      technicalAccuracy,
      clarity,
      personalization,
    },
    goodPoints,
    improvements,
    correctedEnglish: correctedEnglish || 'Please enter a response to receive grammar corrections.',
    improvedNatural,
    followUpQuestion: followUps[Math.floor(wordCount % followUps.length)],
  };
}

/**
 * Extracts skills, degree, and experience hints from pasted/uploaded resume text.
 * Never auto-saves: returns candidate-reviewable suggestions.
 */
export function analyzeResumeText(text) {
  const content = (text || '').trim();
  if (!content) return { degree: '', experienceType: '', skills: [] };

  const lower = content.toLowerCase();
  const degreeMatches = ['MCA', 'B.Tech', 'M.Tech', 'BCA', 'MBA', 'BSc', 'B.Com'];
  const foundDegree = degreeMatches.find((d) => lower.includes(d.toLowerCase())) || '';

  const yearMatch = content.match(/(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/i);
  const experienceType = yearMatch ? 'Experienced' : /fresher|internship|graduate/i.test(lower) ? 'Fresher' : '';
  const experienceYears = yearMatch ? `${yearMatch[1]} years` : '0';

  const allKnownSkills = Object.values(SKILL_SUGGESTIONS).flat();
  const foundSkills = allKnownSkills.filter((skill) =>
    lower.includes(skill.toLowerCase())
  );

  return {
    degree: foundDegree,
    experienceType,
    experienceYears,
    skills: Array.from(new Set(foundSkills)),
  };
}

/**
 * Compares a pasted Job Description against the candidate's verified skills.
 */
export function compareJobDescription(jdText, profile) {
  const lower = (jdText || '').toLowerCase();
  const allKnownSkills = Object.values(SKILL_SUGGESTIONS).flat();
  const jdKeywords = allKnownSkills.filter((s) => lower.includes(s.toLowerCase()));

  const candidateSkills = getAllSkills(profile).map((s) => s.toLowerCase());
  const matched = jdKeywords.filter((k) => candidateSkills.includes(k.toLowerCase()));
  const missing = jdKeywords.filter((k) => !candidateSkills.includes(k.toLowerCase()));

  const matchPercent = jdKeywords.length
    ? Math.round((matched.length / jdKeywords.length) * 100)
    : 0;

  return {
    jdKeywords,
    matched,
    missing,
    matchPercent,
  };
}
