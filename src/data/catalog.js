export const IT_ROLES = [
  'Python Developer',
  'Java Developer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Software Engineer',
  'AI / ML Engineer',
  'Generative AI Engineer',
  'Data Analyst',
  'Data Scientist',
  'QA / Software Tester',
  'Automation Test Engineer',
  'Cloud Support Engineer',
  'DevOps Engineer',
  'Cybersecurity Analyst',
  'Database Administrator',
  'UI/UX Developer',
  'Mobile App Developer',
  'SAP / ERP Analyst',
  'IT Support Engineer',
];

export const NON_IT_ROLES = [
  'Quality Associate',
  'Operations Associate',
  'Business Analyst',
  'Customer Support Associate',
  'Process Associate',
  'Technical Support Associate',
  'HR Executive',
  'Talent Acquisition Associate',
  'Catalog / Content Associate',
  'Trust & Safety Associate',
  'Data Entry / Back Office Associate',
  'Digital Marketing Executive',
  'Sales Development Representative',
  'Account Management Associate',
  'Supply Chain / Logistics Coordinator',
  'Financial / Risk Analyst',
  'KYC / Compliance Analyst',
  'Inside Sales Executive',
  'Client Success Associate',
  'MIS / Reporting Executive',
];

export const ALL_ROLES = [...IT_ROLES, ...NON_IT_ROLES];

export const ROLE_FRESHER_CONTEXT = {
  'Python Developer': {
    track: 'IT',
    fresherFocus: 'clean Python code, Django/REST APIs, SQL queries, debugging, and project ownership',
    scenarioHint: 'debugging an API endpoint or optimizing a Python data/backend script',
  },
  'Java Developer': {
    track: 'IT',
    fresherFocus: 'OOP principles, Core Java, collections, exception handling, and database connectivity',
    scenarioHint: 'fixing a null pointer or data mismatch in a backend service',
  },
  'Full Stack Developer': {
    track: 'IT',
    fresherFocus: 'connecting React/frontend UI with Django/REST APIs and SQL databases end to end',
    scenarioHint: 'tracing a bug across frontend form validation, API payload, and database save',
  },
  'Frontend Developer': {
    track: 'IT',
    fresherFocus: 'responsive UI, React components, state management, accessibility, and browser debugging',
    scenarioHint: 'fixing a mobile layout overflow or slow UI render',
  },
  'Backend Developer': {
    track: 'IT',
    fresherFocus: 'REST API design, authentication, SQL optimization, and server-side error handling',
    scenarioHint: 'handling invalid user requests and preventing duplicate database writes',
  },
  'Software Engineer': {
    track: 'IT',
    fresherFocus: 'data structures, problem solving, clean modular code, and Git collaboration',
    scenarioHint: 'breaking down an unfamiliar feature into testable modules',
  },
  'AI / ML Engineer': {
    track: 'IT',
    fresherFocus: 'data preprocessing, feature engineering, Scikit-learn models, and evaluation metrics',
    scenarioHint: 'handling imbalanced datasets or overfitting in a classification model',
  },
  'Generative AI Engineer': {
    track: 'IT',
    fresherFocus: 'LLM workflows, prompt engineering, RAG basics, and grounded API integrations',
    scenarioHint: 'reducing hallucinations and validating structured LLM outputs',
  },
  'Data Analyst': {
    track: 'IT',
    fresherFocus: 'SQL querying, Python/Pandas cleaning, KPI tracking, and clear visual reporting',
    scenarioHint: 'investigating a sudden drop or anomaly in a daily CSV/SQL report',
  },
  'Data Scientist': {
    track: 'IT',
    fresherFocus: 'exploratory analysis, statistical modeling, clustering/regression, and business insights',
    scenarioHint: 'explaining model accuracy tradeoffs to a non-technical stakeholder',
  },
  'QA / Software Tester': {
    track: 'IT',
    fresherFocus: 'test case design, edge-case validation, bug reporting, and regression checks',
    scenarioHint: 'catching a critical edge case missed before release',
  },
  'Automation Test Engineer': {
    track: 'IT',
    fresherFocus: 'automated test scripts, API/UI assertions, and reproducible bug logs',
    scenarioHint: 'stabilizing a flaky test script in a CI pipeline',
  },
  'Cloud Support Engineer': {
    track: 'IT',
    fresherFocus: 'cloud fundamentals (Azure), Linux basics, logs, and structured incident triage',
    scenarioHint: 'diagnosing a service outage or permission error using logs',
  },
  'DevOps Engineer': {
    track: 'IT',
    fresherFocus: 'Git workflows, Linux, CI/CD basics, automation, and environment reliability',
    scenarioHint: 'resolving a build failure between local and staging environments',
  },
  'Cybersecurity Analyst': {
    track: 'IT',
    fresherFocus: 'threat awareness, log monitoring, access hygiene, and incident escalation',
    scenarioHint: 'triaging suspicious login activity or phishing alerts',
  },
  'Database Administrator': {
    track: 'IT',
    fresherFocus: 'SQL queries, schema integrity, indexing, backups, and query performance',
    scenarioHint: 'identifying a slow query and verifying data consistency',
  },
  'UI/UX Developer': {
    track: 'IT',
    fresherFocus: 'user flows, clean typography, mobile responsiveness, and interactive prototypes',
    scenarioHint: 'simplifying a confusing multi-step user screen',
  },
  'Mobile App Developer': {
    track: 'IT',
    fresherFocus: 'responsive mobile layouts, API integration, offline handling, and performance',
    scenarioHint: 'handling poor network connectivity gracefully in a mobile screen',
  },
  'SAP / ERP Analyst': {
    track: 'IT',
    fresherFocus: 'business process mapping, data validation, structured documentation, and user support',
    scenarioHint: 'resolving a mismatched transaction record across modules',
  },
  'IT Support Engineer': {
    track: 'IT',
    fresherFocus: 'troubleshooting hardware/software issues, ticketing discipline, and calm user communication',
    scenarioHint: 'helping an urgent user resolve an access or system issue step by step',
  },
  'Quality Associate': {
    track: 'Non-IT',
    fresherFocus: 'high accuracy, SOP compliance, root-cause checks, and error-free audits',
    scenarioHint: 'spotting repeated catalog/process defects and documenting root causes',
  },
  'Operations Associate': {
    track: 'Non-IT',
    fresherFocus: 'SLA adherence, workflow coordination, data tracking, and fast issue escalation',
    scenarioHint: 'clearing a sudden backlog while keeping accuracy intact',
  },
  'Business Analyst': {
    track: 'Non-IT',
    fresherFocus: 'requirement gathering, data interpretation, stakeholder clarity, and process improvement',
    scenarioHint: 'translating a vague business request into clear measurable steps',
  },
  'Customer Support Associate': {
    track: 'Non-IT',
    fresherFocus: 'active listening, empathy, clear resolution, and CSAT ownership',
    scenarioHint: 'de-escalating an upset customer and resolving their issue on the first contact',
  },
  'Process Associate': {
    track: 'Non-IT',
    fresherFocus: 'consistent execution, checklist discipline, turnaround time, and zero-defect output',
    scenarioHint: 'catching a missing field before a batch submission deadline',
  },
  'Technical Support Associate': {
    track: 'Non-IT',
    fresherFocus: 'translating technical steps into simple English for customers and logging tickets',
    scenarioHint: 'guiding a non-technical user through troubleshooting without frustration',
  },
  'HR Executive': {
    track: 'Non-IT',
    fresherFocus: 'candidate coordination, onboarding documentation, confidentiality, and people empathy',
    scenarioHint: 'handling overlapping interview schedules smoothly',
  },
  'Talent Acquisition Associate': {
    track: 'Non-IT',
    fresherFocus: 'resume screening, candidate communication, pipeline tracking, and role alignment',
    scenarioHint: 'screening applicants fairly against must-have criteria',
  },
  'Catalog / Content Associate': {
    track: 'Non-IT',
    fresherFocus: 'content accuracy, guideline adherence, detail orientation, and fast review cycles',
    scenarioHint: 'identifying misleading product metadata or policy mismatches',
  },
  'Trust & Safety Associate': {
    track: 'Non-IT',
    fresherFocus: 'policy enforcement, objective judgment, pattern spotting, and escalation rigor',
    scenarioHint: 'reviewing borderline content strictly against policy rules',
  },
  'Data Entry / Back Office Associate': {
    track: 'Non-IT',
    fresherFocus: 'speed with accuracy, spreadsheet/database hygiene, and verification habits',
    scenarioHint: 'verifying duplicate or incomplete records in a large sheet',
  },
  'Digital Marketing Executive': {
    track: 'Non-IT',
    fresherFocus: 'campaign metrics, content hooks, audience targeting, and iterative testing',
    scenarioHint: 'improving low click-through rates on a campaign',
  },
  'Sales Development Representative': {
    track: 'Non-IT',
    fresherFocus: 'prospect research, clear outreach, objection handling, and pipeline discipline',
    scenarioHint: 'handling a prospect who says they already use a competitor',
  },
  'Account Management Associate': {
    track: 'Non-IT',
    fresherFocus: 'client follow-through, relationship building, issue tracking, and retention',
    scenarioHint: 'rebuilding trust after a delayed deliverable',
  },
  'Supply Chain / Logistics Coordinator': {
    track: 'Non-IT',
    fresherFocus: 'shipment tracking, vendor coordination, exception handling, and timeline accuracy',
    scenarioHint: 'rerouting or communicating a delayed dispatch proactively',
  },
  'Financial / Risk Analyst': {
    track: 'Non-IT',
    fresherFocus: 'numerical accuracy, anomaly detection, structured reconciliation, and compliance',
    scenarioHint: 'investigating a discrepancy in daily transaction logs',
  },
  'KYC / Compliance Analyst': {
    track: 'Non-IT',
    fresherFocus: 'document verification, regulatory checklists, risk flags, and audit trails',
    scenarioHint: 'handling mismatched identity or address proof documents',
  },
  'Inside Sales Executive': {
    track: 'Non-IT',
    fresherFocus: 'consultative pitching, active listening, follow-up consistency, and target focus',
    scenarioHint: 'qualifying a lead and turning a hesitant call into a demo',
  },
  'Client Success Associate': {
    track: 'Non-IT',
    fresherFocus: 'smooth onboarding, proactive check-ins, issue resolution, and user adoption',
    scenarioHint: 'helping a new client who is stuck during onboarding',
  },
  'MIS / Reporting Executive': {
    track: 'Non-IT',
    fresherFocus: 'daily dashboards, Excel/SQL accuracy, trend summaries, and on-time reporting',
    scenarioHint: 'automating or double-checking a recurring morning report',
  },
};

export const COMPANIES = [
  {
    name: 'Amazon',
    focus: 'Customer obsession, ownership, quality metrics, SOP compliance, and bias for action',
  },
  {
    name: 'Google',
    focus: 'Structured problem solving, clarity of thought, scalability, and collaborative execution',
  },
  {
    name: 'Microsoft',
    focus: 'Growth mindset, clean engineering fundamentals, reliability, and cross-team impact',
  },
  {
    name: 'TCS',
    focus: 'Strong core fundamentals, adaptability across enterprise projects, and client communication',
  },
  {
    name: 'Infosys',
    focus: 'Continuous learning, structured delivery, process discipline, and analytical clarity',
  },
  {
    name: 'Wipro',
    focus: 'Execution consistency, domain adaptability, and clear teamwork under deadlines',
  },
  {
    name: 'Accenture',
    focus: 'Consulting mindset, stakeholder communication, agile delivery, and business-tech alignment',
  },
  {
    name: 'Cognizant',
    focus: 'Quality-driven delivery, problem analysis, and enterprise support/development readiness',
  },
  {
    name: 'Capgemini',
    focus: 'Collaborative engineering, process improvement, and reliable sprint execution',
  },
  {
    name: 'Deloitte',
    focus: 'Structured analysis, business impact, attention to detail, and executive communication',
  },
  {
    name: 'IBM',
    focus: 'Enterprise architecture awareness, troubleshooting rigor, and client-first engineering',
  },
];

export const DEGREES = [
  'MCA',
  'B.Tech',
  'BCA',
  'MBA',
  'BSc',
  'M.Tech',
  'B.Com',
  'BA',
];

export const DEGREE_FULL_NAMES = {
  MCA: 'Master of Computer Applications',
  'B.Tech': 'Bachelor of Technology',
  BCA: 'Bachelor of Computer Applications',
  MBA: 'Master of Business Administration',
  BSc: 'Bachelor of Science',
  'M.Tech': 'Master of Technology',
  'B.Com': 'Bachelor of Commerce',
  BA: 'Bachelor of Arts',
};

export const SKILL_SUGGESTIONS = {
  languages: ['Java', 'Python', 'JavaScript', 'TypeScript', 'SQL', 'C++', 'Go', 'HTML/CSS'],
  frameworks: ['React', 'Spring Boot', 'Node.js', 'Express', 'Django', 'FastAPI', 'Tailwind CSS'],
  databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Redis'],
  cloud: ['AWS', 'Azure', 'Google Cloud', 'Vercel'],
  devops: ['Git', 'Docker', 'GitHub Actions', 'Linux', 'CI/CD'],
  aiml: ['Scikit-learn', 'Pandas', 'TensorFlow', 'Prompt Engineering', 'RAG'],
  testing: ['Selenium', 'JUnit', 'PyTest', 'Postman', 'Playwright', 'Manual Testing'],
  softSkills: [
    'Clear Communication',
    'Attention to Detail',
    'Problem Solving',
    'Time Management',
    'Team Collaboration',
    'Adaptability',
  ],
};

export const DEFAULT_PROFILE = {
  id: 'sravan-permanent',
  fullName: 'Akkaladevi Sravan Kumar',
  preferredName: 'Sravan',
  email: 'akkaladevisravankumar@gmail.com',
  location: 'Hyderabad, India',
  preferredLanguage: 'English + Telugu Support',
  englishLevel: 'Intermediate',
  highestQualification: 'Postgraduate',
  degree: 'MCA',
  collegeName: "Aurora's PG College, Hyderabad",
  university: 'Osmania University / Aurora PG College',
  graduationYear: '2026',
  specialization: 'Computer Applications (Previous: B.Com Computer Applications, CGPA 7.52)',
  academicProjects: 'CareerCraft, OrganChain, Crime Rate Prediction using K-Means Clustering',
  experienceType: 'Fresher',
  experienceYears: '0',
  previousCompany: '',
  internshipDetails:
    'AI/ML Virtual Intern at Edunet Foundation – Microsoft & AICTE (Apr 2025 – May 2025, Remote): Built a Loan Prediction System using Python, Pandas, NumPy, and Scikit-learn with data preprocessing, feature engineering, EDA, and model evaluation.',
  certifications:
    'Microsoft Certified: Azure AI Fundamentals (Sep 2026); Cybersecurity Analyst Job Simulation – Forage (Feb 2026)',
  skills: {
    languages: ['Python', 'SQL'],
    frameworks: ['Django', 'Django REST Framework', 'REST APIs', 'React', 'TypeScript'],
    databases: ['PostgreSQL', 'SQLite', 'DBMS'],
    cloud: ['Microsoft Azure (Azure AI Fundamentals)'],
    devops: ['Git', 'GitHub', 'Linux', 'VS Code', 'LaTeX'],
    aiml: [
      'Machine Learning',
      'Generative AI',
      'LLM Concepts',
      'RAG Basics',
      'Prompt Engineering',
      'Scikit-learn',
      'Pandas',
      'NumPy',
      'Data Preprocessing',
      'Feature Engineering',
      'K-Means Clustering',
    ],
    testing: ['Debugging', 'Dataset Validation', 'Model Evaluation'],
    softSkills: ['Attention to Detail', 'Problem Solving', 'Clear Communication', 'Analytical Thinking'],
  },
  projects: [
    {
      id: 'proj-careercraft',
      name: 'CareerCraft – Full-Stack Career & Placement Preparation Platform',
      description:
        'End-to-end career platform with resume building, ATS analysis, mock interviews, and AI Career Agent with OpenAI & Google Gemini API support.',
      technologies: 'React, TypeScript, Django, Django REST Framework, Python, SQL, LaTeX',
      teamType: 'Individual',
      responsibilities:
        'Built full-stack React + Django REST workflows, integrated AI Career Agent for ATS keyword optimization and STAR practice, and implemented LaTeX/PDF resume generation.',
      challenges:
        'Handled structured resume processing across multiple templates and reliable live preview rendering.',
    },
    {
      id: 'proj-organchain',
      name: 'OrganChain – Blockchain-Based Organ Donation Tracking System',
      description:
        'Django-based healthcare application covering donor registration, hospital workflows, recipient management, organ matching, and transplantation tracking.',
      technologies: 'Python, Django, SQLite, Solidity, Web3.py, Ethereum, Ganache',
      teamType: 'Individual',
      responsibilities:
        'Integrated Python, Django, SQLite, and Web3.py with Ethereum smart-contract transactions and implemented workflow validation.',
      challenges:
        'Connected off-chain Django workflows reliably with on-chain smart-contract transaction tracking and testing.',
    },
    {
      id: 'proj-crime',
      name: 'Crime Rate Prediction & Analysis using K-Means Clustering',
      description:
        'Django application for CSV-based crime data upload, preprocessing, validation, K-Means clustering across Indian states, and Polynomial Regression forecasting.',
      technologies: 'Python, Django, Pandas, NumPy, Scikit-learn, Matplotlib, Folium',
      teamType: 'Individual',
      responsibilities:
        'Built CSV preprocessing/validation pipelines, applied K-Means clustering and Polynomial Regression, and generated statistical and geographical visualizations.',
      challenges:
        'Cleaned inconsistent CSV records and tuned clustering & regression workflows for clear visual reporting.',
    },
  ],
  careerTrack: 'Both',
  targetRole: 'Python Developer',
  targetCompany: 'Amazon',
  preferredLocation: 'Hyderabad',
  expectedSalary: '',
  shiftPreference: 'Flexible / Any Shift',
};

export const PRESET_PROFILES = [DEFAULT_PROFILE];
